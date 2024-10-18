import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/UserModel.js";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Login Controller
export const login = async (req, res) => {
    const { user_id, password } = req.body;

    try {
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Handle role-based responses first
        if (user.role === "admin" || user.role === "faculty") {
            // Prompt for security code if role is admin or faculty
            return res.json({ message: "prompt-security-code", securityCodeRequired: true, role: user.role });
        } 
        
        if (user.role === "student") {
            // Generate JWT after successful security code verification
            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "60d" });
            res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "none" });

            if (user.mustChangePassword) {
                return res.json({ message: "Security code verified, JWT issued and prompt-password", mustChangePassword: true, token, role: user.role });
            }
            else {return res.json({ message: "Security code verified, JWT issued", mustChangePassword: false, token, role: user.role });}
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Security Code Verification Controller for Admin/Faculty
export const verifySecurityCode = async (req, res) => {
    const { user_id, securityCode } = req.body;

    try {
        const user = await User.findOne({ user_id, role: { $in: ["admin", "faculty"] } });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check if the security code matches the hashed security code in the database
        const isSecurityCodeValid = await bcrypt.compare(securityCode, user.securityCode);
        if (!isSecurityCodeValid) {
            return res.status(400).json({ message: "Invalid security code" });
        }

        // Generate JWT after successful security code verification
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "60d" });
        res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "none" });

        if (user.mustChangePassword) {
            return res.json({ message: "Security code verified, JWT issued and prompt-password", mustChangePassword: true, token, role: user.role});
        }
        else {return res.json({ message: "Security code verified, JWT issued", mustChangePassword: false, token, role: user.role });}

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Change Password Controller
export const changePassword = async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
        const user = await User.findOne({ user_id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password and set mustChangePassword to false
        user.password = hashedPassword;
        user.mustChangePassword = false;

        await user.save();
        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const forgotPassword = async (req, res) => {
    const { user_id } = req.body;

    try {
        // Find the user by user_id
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a temporary password (e.g., 8 characters)
        const tempPassword = Math.random().toString(36).slice(-8);

        // Hash the temporary password
        const salt = await bcrypt.genSalt(10);
        const hashedTempPassword = await bcrypt.hash(tempPassword, salt);

        // Update user's password and set mustChangePassword to true
        user.password = hashedTempPassword;
        user.mustChangePassword = true;
        await user.save();

        // Send the temporary password to the user's email
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // You can use any email service provider
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password or app password
            },
        });
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email, 
            subject: 'Password Reset for Your StudySync Account',
            
            text: `
            Hello ${user.user_id},
        
            We received a request to reset your StudySync account password. Below is your one-time password:
        
            One-Time Password: ${tempPassword}
        
            Please use this one-time password to log in to your account and change your password immediately.
        
            If you did not request this, please ignore this email or contact support.
        
            Best regards,
            The StudySync Team
            `,
        
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <table style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px;">
                    <tr>
                        <td style="padding: 10px 0;">
                            <h2 style="text-align: center; color: #6f42c1; margin-bottom: 20px;">StudySync Password Reset</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #fff; padding: 20px; border-radius: 10px;">
                            <p style="font-size: 16px; margin-bottom: 10px;">
                                Hello <strong>${user.user_id}</strong>,
                            </p>
                            <p style="font-size: 16px; margin-bottom: 20px;">
                                We received a request to reset your StudySync account password. Below is your one-time password:
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <p style="font-size: 18px; color: #6f42c1; font-weight: bold; padding: 10px; background-color: #f1f1f1; display: inline-block; border-radius: 5px;">
                                    ${tempPassword}
                                </p>
                            </div>
                            <p style="font-size: 16px; margin-bottom: 20px;">
                                Please use this one-time password to log in and change your password immediately.
                            </p>
                            <p style="font-size: 16px; margin-bottom: 20px;">
                                If you did not request this, please ignore this email or <a href="mailto:studysync.cms@gmail.com" style="color: #6f42c1;">contact us</a> for further assistance.
                            </p>
                            <p style="font-size: 16px; margin-bottom: 10px;">Best regards,</p>
                            <p style="font-size: 16px; color: #6f42c1; font-weight: bold;">The StudySync Team</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; text-align: center; color: #777; font-size: 12px;">
                            &copy; ${new Date().getFullYear()} StudySync. All rights reserved.
                            <br>
                            <a href="mailto:studysync.cms@gmail.com" style="color: #6f42c1;">Contact Us</a> for any inquiries or issues.
                        </td>
                    </tr>
                </table>
            </div>
            `,
        };
        
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ message: "Failed to send email" });
            }
            console.log('Email sent:', info.response);
            res.json({ message: "Temporary password sent to your email" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// const salt = await bcrypt.genSalt(10);
// const hashedPassword1 = await bcrypt.hash('adminPass456', salt);
// console.log(hashedPassword1);
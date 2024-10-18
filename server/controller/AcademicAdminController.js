import Student from '../model/studentModel.js';
import User from '../model/UserModel.js';
import Faculty from '../model/facultyModel.js';
import Course from '../model/courseModel.js';
import Feedback from '../model/feedbackModel.js';
import Question from '../model/questionModel.js';
import TAModel from '../model/TaModel.js';
import dotenv from "dotenv";

import { hash } from 'bcrypt';
import twilio from 'twilio'; // Import Twilio

dotenv.config();

// const sid = "ACd20c0961e10c674a35238bb1b1e488fa";
// const auth_token = "f28213b4ad4f47ca83499349a49e732d";
const sid = process.env.sid;
const auth_token = process.env.auth_token;
const twilioClient = twilio(sid, auth_token);

// Helper function to generate enrollment number
const generateUniqueEnrollmentNumber = async (branchCode, degreeCode) => {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const prefix = `${currentYear}${currentMonth}${degreeCode}${branchCode}`;

  let increment = 0; // Start from 0
  let enrollmentNumber;

  while (true) {
    // Format the increment with leading zeros (3 digits)
    enrollmentNumber = Number(`${prefix}${increment.toString().padStart(3, '0')}`);

    // Check if this enrollment number already exists
    const exists = await Student.exists({ enrollment: enrollmentNumber });
    if (!exists) {
      break; // Exit loop if the number does not exist
    }
    increment++; // Increment and try again
  }

  return enrollmentNumber; // Return the unique enrollment number
};

// Helper function to generate CollegeEmail
const generateCollegeEmail = (firstName, lastName, branchCode, enroll) => {
  const currentYear = enroll.toString().slice(-2);
  return `${lastName.toLowerCase()}.${firstName.toLowerCase()}.${currentYear}${branchCode}@iitram.ac.in`;
};

// add student
export const addStudent = async (req, res) => {
  try {
    const {
      Email,
      tempPassword,
      Contact,
      image_url,
      FirstName,
      LastName,
      Gender,
      AadharNumber,
      GuardianNumber,
      GuardianEmail,
      Other,
      Academic_info,
      Address
    } = req.body;

    if (!tempPassword) {
      return res.status(400).send({ message: 'Temporary password is required.' });
    }

    const contactString = Contact.toString();
    if (contactString.length < 10) {
      return res.status(400).send({ message: 'Contact number must be exactly 10 digits or more.' });
    }

    const existingStudent = await Student.findOne({ AadharNumber });
    if (existingStudent) {
      return res.status(400).send({ message: 'A student with this Aadhar number already exists.' });
    }

    const branchCodeMapping_ENROLL = {
      "Computer Engineering": "400",
      "Electrical Engineering": "300",
      "Mechanical Engineering": "200",
      "Civil Engineering": "100"
    };
    const degreeCodeMapping = {
      "B.Tech": "300",
      "M.Tech": "200",
      "Ph.D": "100"
    };

    const branchCode = branchCodeMapping_ENROLL[Academic_info.Branch];
    if (!branchCode) {
      return res.status(400).send({ message: 'Invalid branch provided.' });
    }
    const degreeCode = degreeCodeMapping[Academic_info.Degree];
    if (!degreeCode) {
      return res.status(400).send({ message: 'Invalid degree provided.' });
    }

    const enrollment = await generateUniqueEnrollmentNumber(branchCode, degreeCode);

    const branchCodeMapping = {
      "Computer Engineering": "co",
      "Electrical Engineering": "e",
      "Mechanical Engineering": "m",
      "Civil Engineering": "c"
    };
    const branchCode_email = branchCodeMapping[Academic_info.Branch];

    const CollegeEmail = generateCollegeEmail(FirstName, LastName, branchCode_email, Academic_info.Enroll_Year);

    const hashedPassword = await hash(tempPassword, 10);

    const newStudent = await Student.create({
      enrollment,
      FirstName,
      LastName,
      Email,
      image_url,
      CollegeEmail,
      Contact: contactString,
      Gender,
      AadharNumber,
      GuardianNumber,
      GuardianEmail,
      Other: {
        isPhysicalHandicap: Other?.isPhysicalHandicap || false,
        birthPlace: Other?.birthPlace || '',
        AdmissionThrough: Other?.AdmissionThrough || '',
        CasteCategory: Other?.CasteCategory || ''
      },
      Academic_info: {
        Branch: Academic_info?.Branch || '',
        Semester: Academic_info?.Semester || '',
        Degree: Academic_info?.Degree || 'B. Tech',
        Enroll_Year: Academic_info?.Enroll_Year || ''
      },
      Address: {
        Addr: Address?.Addr || '',
        City: Address?.City || '',
        State: Address?.State || '',
        Country: Address?.Country || '',
        PinCode: Address?.PinCode || ''
      }
    });

    const newUser = await User.create({
      user_id: enrollment,
      password: hashedPassword,
      role: 'student',
      // email: Email,
      email: CollegeEmail,
    });

    const messageBody = `
      Welcome to our StudySync, ${FirstName} ${LastName}!
      Your enrollment number: ${enrollment}
      Email: ${Email}
      College Email: ${CollegeEmail}
      Temporary Password: ${tempPassword}
      Please log in and change your password at your earliest convenience.
    `;
    //     // Uncomment the below code to send SMS using Twilio
    //     // await twilioClient.messages
    //     //   .create({
    //     //     from: "+18446216868", // Replace with your Twilio phone number
    //     //     // to: Contact,
    //     //     to: +18777804236,     // Replace with correct phone number
    //     //     body: messageBody,
    //     //   })
    //     //   .then(() => console.log('Message sent successfully!'))
    //     //   .catch((err) => console.error('Error sending message:', err));
    // Return success response
    return res.status(201).json({
      student: {
        enrollment: newStudent.enrollment,
        email: newStudent.Email,
        collegeEmail: newStudent.CollegeEmail,
        name: `${newStudent.FirstName} ${newStudent.LastName}`,
        contactNumber: newStudent.Contact,
      },
      user: {
        user_id: newUser.user_id,
        role: newUser.role,
        email: newUser.email,
      },
      message: `Student added successfully! with EnrollmentNo: ${newStudent.enrollment}  CollegeEmail: ${newStudent.CollegeEmail}`,
    });
  } catch (error) {
    console.error('Error adding student:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    // Find all students and select specific fields
    const students = await Student.find({}, {
      enrollment: 1,            // Enrollment No
      FirstName: 1,             // First Name
      LastName: 1,              // Last Name
      CollegeEmail: 1,                 // Email Id
      Academic_info: 1,         // Academic info to get degree, branch, and semester
      Contact: 1,               // Phone No
    });

    // Map students to the required format
    const formattedStudents = students.map(student => ({
      enrollmentNo: student.enrollment,
      name: `${student.FirstName} ${student.LastName}`,
      CollegeEmail: student.CollegeEmail,
      degree: student.Academic_info.Degree,
      branch: student.Academic_info.Branch,
      semester: student.Academic_info.Semester,
      contactNumber: student.Contact,
    }));

    // Return the list of students
    return res.status(200).json({
      students: formattedStudents,
      message: 'Students retrieved successfully!',
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  const { enrollmentNo } = req.params; // Get enrollment number from request parameters

  try {
    // Delete the student record
    const student = await Student.findOneAndDelete({ enrollment: enrollmentNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Delete the corresponding user record
    const user = await User.findOneAndDelete({ user_id: enrollmentNo });
    if (!user) {
      console.warn(`User entry not found for enrollmentNo: ${enrollmentNo}`);
    }

    // Return success response
    return res.status(200).json({ message: 'Student and corresponding user deleted successfully!' });
  } catch (error) {
    console.error('Error deleting student and user:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Search student by enrollment number
export const searchStudents = async (req, res) => {
  try {
    const { enrollmentNo, search } = req.query; // Get the enrollment number or search query from the URL

    // Choose which parameter to use
    const enrollmentNumber = enrollmentNo ? Number(enrollmentNo) : (search ? Number(search) : null);

    // Check if enrollmentNumber is a valid number
    if (enrollmentNumber === null || isNaN(enrollmentNumber)) {
      return res.status(400).json({ message: 'Invalid enrollment number. Please provide a valid number.' });
    }

    // Find student based on the enrollment number
    const student = await Student.findOne({ enrollment: enrollmentNumber });

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Return the student details
    return res.status(200).json({
      student,
      message: 'Student retrieved successfully!',
    });
  } catch (error) {
    console.error('Error searching student by enrollment number:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Edit student
export const editStudent = async (req, res) => {
  try {
    const { enrollmentNo } = req.params; // Get the enrollment number from the URL
    const { tempPassword, ...otherDetails } = req.body; // Get new details and temp password
    console.log({ enrollmentNo })
    // Check if the student exists
    const student = await Student.findOne({ enrollment: enrollmentNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    console.log(student)


    // If a new tempPassword is provided, hash it
    if (tempPassword) {
      otherDetails.tempPassword = await hash(tempPassword, 10);
    }

    // Update the student details in the database
    const updatedStudent = await Student.findOneAndUpdate(
      { enrollment: enrollmentNo },
      { $set: otherDetails },
      { new: true, runValidators: true } // Return the updated document
    );

    // Return success response
    return res.status(200).json({
      student: {
        enrollment: updatedStudent.enrollment,
        Email: updatedStudent.Email,
        FirstName: updatedStudent.FirstName,
        LastName: updatedStudent.LastName,
        Contact: updatedStudent.Contact,
      },
      message: 'Student details updated successfully!',
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Helper function to generate CollegeEmail
const generateFacultyCollegeEmail = (firstName, lastName) => {
  return `${firstName.toLowerCase()}${lastName.toLowerCase()}@iitram.ac.in`;
};
// addFaculty
export const addFaculty = async (req, res) => {
  try {
    const { FirstName, LastName, facultyId, Email, tempPassword, contactNumber, AadharNumber, ...otherDetails } = req.body;

    // Check if FirstName and LastName are provided
    if (!FirstName || !LastName) {
      return res.status(400).json({ message: 'FirstName and LastName are required.' });
    }

    // Generate CollegeEmail based on FirstName and LastName
    const CollegeEmail = generateFacultyCollegeEmail(FirstName, LastName);

    // Check if faculty with the same facultyId, Email, CollegeEmail, or AadharNumber already exists
    const existingFaculty = await Faculty.findOne({
      $or: [{ facultyId }, { Email }, { CollegeEmail }, { AadharNumber }]
    });

    const existingUser = await User.findOne({ email: Email });

    if (existingFaculty || existingUser) {
      return res.status(400).json({ message: 'Faculty with this ID, Email, College Email, or Aadhar already exists.' });
    }

    // Hash the temporary password
    const hashedPassword = await hash(tempPassword, 10);

    // Create new faculty record with CollegeEmail and required fields
    const newFaculty = await Faculty.create({
      ...otherDetails,
      facultyId,
      Email,
      CollegeEmail,  // Include generated CollegeEmail here
      contactNumber,
      AadharNumber,
      FirstName,     // Ensure FirstName is included
      LastName       // Ensure LastName is included
    });

    // Create corresponding user entry
    const newUser = await User.create({
      user_id: facultyId,
      password: hashedPassword,
      role: 'faculty',
      email: CollegeEmail,  // Use CollegeEmail for user entry
    });

    // Send SMS to the faculty (optional)
    const messageBody = `
        Welcome to StudySync, ${otherDetails.FirstName || 'Faculty'}!
        Your faculty ID: ${facultyId}
        Email: ${Email}
        Temporary Password: ${tempPassword}
        Please log in and change your password at your earliest convenience.
      `;

    // Uncomment to send SMS via Twilio
    // await twilioClient.messages
    //   .create({
    //     from: "+18446216868", // Replace with your Twilio phone number
    //     to: contactNumber, 
    //     body: messageBody,
    //   })
    //   .then(() => console.log('Message sent successfully!'))
    //   .catch((err) => console.error('Error sending message:', err));

    // Return success response
    return res.status(201).json({
      faculty: {
        facultyId: newFaculty.facultyId,
        Email: newFaculty.Email,
        FirstName: newFaculty.FirstName,
        LastName: newFaculty.LastName,
        contactNumber: newFaculty.contactNumber,
      },
      user: {
        user_id: newUser.user_id,
        role: newUser.role,
        email: newUser.email,
      },
      message: 'Faculty added and message sent successfully!',
    });
  } catch (error) {
    console.error('Error adding faculty:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Retrieve all faculty
export const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({}, {
      facultyId: 1,
      FirstName: 1,
      LastName: 1,
      department: 1,
      Email: 1,
      CollegeEmail: 1,
      contactNumber: 1,
      designation: 1,
      salary: 1
    });

    return res.status(200).json({
      faculty,
      message: 'Faculty retrieved successfully!',
    });
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Delete faculty
export const deleteFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const faculty = await Faculty.findOneAndDelete({ facultyId });

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found.' });
    }

    const user = await User.findOneAndDelete({ user_id: facultyId });
    if (!user) {
      console.warn(`User entry not found for facultyId: ${facultyId}`);
    }
    return res.status(200).json({ message: 'Faculty deleted successfully!' });
  } catch (error) {
    console.error('Error deleting faculty and user:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// search faculty
export const searchFaculty = async (req, res) => {
  try {
    const { search } = req.query;

    // Create a query object to store conditions
    let query = {
      $or: [
        { facultyId: { $regex: search, $options: 'i' } },
        { FirstName: { $regex: search, $options: 'i' } },
        { LastName: { $regex: search, $options: 'i' } },
        { Email: { $regex: search, $options: 'i' } },
        { CollegeEmail: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ]
    };

    // If the search string is a valid number, add contactNumber to the query
    if (!isNaN(search)) {
      query.$or.push({ contactNumber: search });
    }

    const faculty = await Faculty.find(query);

    if (faculty.length === 0) {
      return res.status(404).json({ message: 'No faculty found matching the search criteria.' });
    }

    return res.status(200).json({
      faculty,
      message: 'Faculty retrieved successfully!',
    });
  } catch (error) {
    console.error('Error searching faculty:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Edit faculty
export const editFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { tempPassword, ...otherDetails } = req.body;
    const faculty = await Faculty.findOne({ facultyId });
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found.' });
    }

    if (tempPassword) {
      otherDetails.tempPassword = await hash(tempPassword, 10);
    }

    const updatedFaculty = await Faculty.findOneAndUpdate(
      { facultyId },
      { $set: otherDetails },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      faculty: {
        facultyId: updatedFaculty.facultyId,
        Email: updatedFaculty.Email,
        FirstName: updatedFaculty.FirstName,
        LastName: updatedFaculty.LastName,
        contactNumber: updatedFaculty.contactNumber,
      },
      message: 'Faculty details updated successfully!',
    });
  } catch (error) {
    console.error('Error updating faculty:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Add TA
export const addTA = async (req, res) => {
  try {
    const { enrollment, facultyId, teachingSemester, teachingCourses, startDate, stipendAmount, endDate } = req.body;

    // Check if the student exists
    const existingStudent = await Student.findOne({ enrollment: enrollment });
    if (!existingStudent) {
      return res.status(404).send({ message: 'Student not found.' });
    }
    // Check if the faculty exists
    const existingFaculty = await Faculty.findOne({ facultyId }); // Ensure facultyId is a string match
    if (!existingFaculty) {
      return res.status(404).send({ message: 'Faculty not found.' });
    }

    // Check if the teaching courses exist
    const existingCourses = await Course.find({ courseID: teachingCourses }); // Updated here

    // Check if all requested courses were found
    if (!existingCourses.length) {
      return res.status(404).send({ message: 'courses not found.' });
    }

    // Check if the student is already a TA
    if (existingStudent.Academic_info.isTA) {
      return res.status(400).send({ message: 'Student is already a TA.' });
    }

    // Create a new TA record
    const newTA = new TAModel({
      enrollment: existingStudent.enrollment,
      facultyId,
      teachingSemester,
      teachingCourses, // Assuming this is an array of course IDs
      startDate,
      endDate, // Set this null until TA ends
      stipendAmount
    });

    await newTA.save();

    // Update the student's isTA field to true
    existingStudent.Academic_info.isTA = true;
    await existingStudent.save();

    // Return success response
    return res.status(200).json({
      message: 'Student updated to TA successfully!',
      ta: {
        enrollmentNo: existingStudent.enrollment,
        emailId: existingStudent.Email,
        name: `${existingStudent.FirstName} ${existingStudent.LastName}`,
        contactNumber: existingStudent.Contact,
        isTA: existingStudent.Academic_info.isTA, // Ensuring isTA is true
      },
    });
  } catch (error) {
    console.error('Error adding TA:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Delete TA 
export const deleteTA = async (req, res) => {
  try {
    const { enrollment } = req.params;  // Correctly using enrollment

    if (!enrollment) {
      return res.status(400).send({ message: 'Enrollment number is required.' });
    }

    // Find the student by enrollment number with the isTA field
    const existingStudent = await Student.findOne({
      enrollment: Number(enrollment),  // Ensure enrollment is cast to a number if needed
      'Academic_info.isTA': true,
    });

    if (!existingStudent) {
      return res.status(404).send({ message: 'TA not found.' });
    }

    // Find the TA record using the student enrollment number
    const taRecord = await TAModel.findOne({ student: enrollment });

    if (!taRecord) {
      return res.status(404).send({ message: 'TA record not found.' });
    }

    // Remove the TA record
    await TAModel.findByIdAndDelete(taRecord._id);  // Use the TA's _id

    // Set isTA to false in the student record
    existingStudent.Academic_info.isTA = false;
    await existingStudent.save();

    // Optionally update the user's role back to 'student'
    // await User.findOneAndUpdate({ user_id: enrollment }, { role: 'student' });

    return res.status(200).json({
      message: 'TA role removed successfully!',
      ta: {
        enrollment: existingStudent.enrollment,
        emailId: existingStudent.Email,
        name: `${existingStudent.FirstName} ${existingStudent.LastName}`,
        contactNumber: existingStudent.Contact,
        isTA: existingStudent.Academic_info.isTA,  // Ensuring isTA is now false
      },
    });
  } catch (error) {
    console.error('Error removing TA role:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Search TAs
export const searchTAs = async (req, res) => {
  try {
    const { enrollmentNo, search } = req.query; // Get the enrollment number or search query from the URL
    const enrollmentNumber = enrollmentNo ? Number(enrollmentNo) : (search ? Number(search) : null);

    // Check if enrollmentNumber is a valid number
    if (enrollmentNumber === null || isNaN(enrollmentNumber)) {
      return res.status(400).json({ message: 'Invalid enrollment number. Please provide a valid number.' });
    }

    // Find student based on the enrollment number
    const student = await Student.findOne({ enrollment: enrollmentNumber });

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Create a query to search for TAs
    let query = {
      'Academic_info.isTA': true,

    };

    // Execute the query
    const students = await Student.find({
      'Academic_info.isTA': true,
      enrollment: enrollmentNumber
    }, {
      enrollment: 1,
      FirstName: 1,
      LastName: 1,
      'Academic_info.Branch': 1,
      'Academic_info.Semester': 1,
      Contact: 1,
      CollegeEmail: 1,
      'Academic_info.Degree': 1,
    });
    

    if (students.length === 0) {
      return res.status(404).json({ message: 'No TAs found matching the search criteria.' });
    }

    const taDetails = [];

    // Use a for...of loop for synchronous iteration
    for (const student of students) {
      try {
        const taModel = await TAModel.findOne({ enrollment: student.enrollment });
        if (!taModel) continue; // Skip if no TA record is found

        // Fetch faculty and course details in parallel
        const [faculty, course] = await Promise.all([
          Faculty.find({ facultyId: taModel.facultyId }),
          Course.find({ courseID: taModel.teachingCourses }),
        ]);
        // Push the TA details into the result array
        taDetails.push({
          enrollment: student.enrollment || '',
          studentName: `${student.FirstName || ''} ${student.LastName || ''}`.trim(),
          studentEmail: student.CollegeEmail || '',
          contactNumber: student.Contact || '',
          semester: student.Academic_info?.Semester || '',
          facultyId: taModel.facultyId || '',
          teachingSemester: taModel.teachingSemester || '',
          startDate: taModel.startDate || '',
          endDate: taModel.endDate || '',
          stipendAmount: taModel.stipendAmount || '',
          teachingCourses: taModel.teachingCourses || '',
        });
      } catch (innerError) {
        console.error(`Error fetching TA details for student: ${student.enrollment}`, innerError);
        // Continue to the next student on error
      }
    }

    // Return the list of TAs
    return res.status(200).json({
      tas: taDetails,
      message: 'TAs retrieved successfully!',
    });
  } catch (error) {
    console.error('Error searching TAs:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Get All TAs
export const getAllTAs = async (req, res) => {
  try {
    // Find all students who are TAs
    const students = await Student.find(
      { 'Academic_info.isTA': true },
      {
        enrollment: 1,
        FirstName: 1,
        LastName: 1,
        'Academic_info.Branch': 1,
        'Academic_info.Semester': 1,
        Contact: 1,
        CollegeEmail: 1,
        'Academic_info.Degree': 1,
      }
    );

    const taDetails = [];

    // Use a for...of loop for synchronous iteration
    for (const student of students) {
      try {
        const taModel = await TAModel.findOne({ enrollment: student.enrollment });
        if (!taModel) continue; // Skip if no TA record is found

        // Fetch faculty and course details in parallel
        const [faculty, course] = await Promise.all([
          Faculty.find({ facultyId: taModel.facultyId }),
          Course.find({ courseID: taModel.teachingCourses }),
        ]);
        // Push the TA details into the result array
        taDetails.push({
          enrollment: student.enrollment || '',
          studentName: `${student.FirstName || ''} ${student.LastName || ''}`.trim(),
          studentEmail: student.CollegeEmail || '',
          contactNumber: student.Contact || '',
          semester: student.Academic_info?.Semester || '',
          facultyId: taModel.facultyId || '',
          teachingSemester: taModel.teachingSemester || '',
          teachingCourses: taModel.teachingCourses || '',
        });
      } catch (innerError) {
        console.error(`Error fetching TA details for student: ${student.enrollment}`, innerError);
        // Continue to the next student on error
      }
    }

    // Return the list of TAs
    return res.status(200).json({
      tas: taDetails,
      message: 'TAs retrieved successfully!',
    });
  } catch (error) {
    console.error('Error fetching TAs:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Edit TA
export const editTA = async (req, res) => {
  try {
    const { enrollment, facultyId, teachingCourses, startDate, stipendAmount, endDate } = req.body;

    // Check if the student exists and is already a TA
    const existingStudent = await Student.findOne({ 
      enrollment: enrollment, 
      'Academic_info.isTA': true 
    });
    if (!existingStudent) {
      return res.status(404).send({ message: 'TA student not found.' });
    }

    // Check if the faculty exists
    const existingFaculty = await Faculty.findOne({ facultyId });
    if (!existingFaculty) {
      return res.status(404).send({ message: 'Faculty not found.' });
    }

    // Check if the teaching courses exist
    const existingCourses = await Course.find({ courseID: teachingCourses }); // Updated here

    // Check if all requested courses were found
    if (!existingCourses.length) {
      return res.status(404).send({ message: 'courses not found.' });
    }

    // Find the TA record
    const taRecord = await TAModel.findOne({ enrollment: enrollment });
    if (!taRecord) {
      return res.status(404).send({ message: 'TA record not found.' });
    }

    // Update the TA record
    taRecord.facultyId = facultyId;
    taRecord.teachingCourses = teachingCourses;
    taRecord.startDate = startDate;
    taRecord.endDate = endDate; // Set to null if not provided
    taRecord.stipendAmount = stipendAmount;

    await taRecord.save();

    return res.status(200).json({
      message: 'TA record updated successfully!',
      ta: {
        enrollmentNo: existingStudent.enrollment,
        emailId: existingStudent.CollegeEmail,
        name: `${existingStudent.FirstName} ${existingStudent.LastName}`,
        contactNumber: existingStudent.Contact,
        facultyId,
        teachingCourses,
        startDate,
        endDate: endDate || 'Not provided',
        stipendAmount,
      },
    });
  } catch (error) {
    console.error('Error updating TA:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Add a new course
export const addCourse = async (req, res) => {
  try {
    const { courseID, courseInstructorID, ...otherDetails } = req.body;

    // Check if the course already exists
    const existingCourse = await Course.findOne({ courseID });
    if (existingCourse) {
      return res.status(400).send({ message: 'Course with this Course ID already exists.' });
    }

    // Check if the instructor exists in the Faculty model
    const faculty = await Faculty.findOne({ facultyId: courseInstructorID });
    if (!faculty) {
      return res.status(404).send({ message: 'Instructor not found in the Faculty database.' });
    }

    // Create new course record with the instructor's name fetched from Faculty
    const newCourse = await Course.create({
      ...otherDetails,
      courseID,
      courseInstructorID,
      courseInstructorName: faculty.name, // Fetch the instructor's name from the Faculty model
    });

    // Return success response
    return res.status(201).json({
      course: {
        courseID: newCourse.courseID,
        courseName: newCourse.courseName,
        department: newCourse.department,
        branch: newCourse.branch,
        courseStartDate: newCourse.courseStartDate,
        semester: newCourse.semester,
        courseInstructorID: newCourse.courseInstructorID,
        courseInstructorName: newCourse.courseInstructorName,
      },
      message: 'Course added successfully!',
    });
  } catch (error) {
    console.error('Error adding course:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Retrieve all courses
export const getAllCourses = async (req, res) => {
  try {
    // Find all courses and select specific fields
    const courses = await Course.find({}, {
      courseID: 1,
      courseName: 1,
      department: 1,
      branch: 1,
      courseStartDate: 1,
      semester: 1,
      courseInstructorID: 1,
      courseInstructorName: 1,
      courseCredit: 1
    });

    // Return the list of courses
    return res.status(200).json({
      courses,
      message: 'Courses retrieved successfully!',
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const { courseID } = req.params;
    // Delete the course record
    const course = await Course.findOneAndDelete({ courseID });

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Return success response
    return res.status(200).json({ message: 'Course deleted successfully!' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Search courses
export const searchCourses = async (req, res) => {
  try {
    const { search } = req.query; // Get the search query from the URL

    // Create a base query object
    let query = {
      $or: [
        { courseID: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { branch: { $regex: search, $options: 'i' } },
        { courseInstructorName: { $regex: search, $options: 'i' } },
        { courseInstructorID: { $regex: search, $options: 'i' } }
      ]
    };

    // Find courses based on the query
    const courses = await Course.find(query);

    if (courses.length === 0) {
      return res.status(404).json({ message: 'No courses found matching the search criteria.' });
    }

    // Return the list of courses
    return res.status(200).json({
      courses,
      message: 'Courses retrieved successfully!',
    });
  } catch (error) {
    console.error('Error searching courses:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Edit course details
export const editCourse = async (req, res) => {
  try {
    const { courseID } = req.params; // Get the course ID from the URL
    const { courseInstructorID, ...otherDetails } = req.body; // Get new details excluding courseInstructorID at first

    // Check if the course exists
    const course = await Course.findOne({ courseID });
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // If the courseInstructorID is provided, fetch the instructor's name from the Faculty model
    if (courseInstructorID) {
      const faculty = await Faculty.findOne({ facultyId: courseInstructorID });
      if (!faculty) {
        return res.status(404).json({ message: 'Instructor not found in the Faculty database.' });
      }
      // Update both the instructor ID and name
      otherDetails.courseInstructorID = courseInstructorID;
      otherDetails.courseInstructorName = faculty.name; // Fetch instructor's name from Faculty model
    }

    // Update the course details in the database
    const updatedCourse = await Course.findOneAndUpdate(
      { courseID },
      { $set: otherDetails },
      { new: true, runValidators: true } // Return the updated document with validation
    );

    // Return success response with updated course details
    return res.status(200).json({
      course: {
        courseID: updatedCourse.courseID,
        courseName: updatedCourse.courseName,
        department: updatedCourse.department,
        branch: updatedCourse.branch,
        courseStartDate: updatedCourse.courseStartDate,
        semester: updatedCourse.semester,
        courseInstructorID: updatedCourse.courseInstructorID,
        courseInstructorName: updatedCourse.courseInstructorName,
        courseCredit: updatedCourse.courseCredit
      },
      message: 'Course details updated successfully!',
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Common validation function to check courseID and facultyID
const validateCourseAndFaculty = async (courseID, facultyID) => {
  // Check if courseID is valid and exists in the Course collection
  const courseExists = await Course.findOne({ courseID });
  if (!courseExists) {
    return { success: false, message: 'Invalid courseID. Course not found.' };
  }

  // Check if facultyID is valid and exists in the Faculty collection
  const facultyExists = await Faculty.findOne({ facultyId: facultyID });
  if (!facultyExists) {
    return { success: false, message: 'Invalid facultyID. Faculty not found.' };
  }

  // Return success along with course and faculty data
  return { success: true, course: courseExists, faculty: facultyExists };
};

// create a feedback form om
export const createFeedback = async (req, res) => {
  const { feedbackID, feedbackName, courseID, departmentID, branch, facultyID, startDateTime, endDateTime } = req.body;

  try {
    // Validate courseID and facultyID and fetch details from DB
    const validation = await validateCourseAndFaculty(courseID, facultyID);
    if (!validation.success) {
      return res.status(400).json({ message: validation.message });
    }

    // Check if endDateTime is after startDateTime
    if (new Date(endDateTime) <= new Date(startDateTime)) {
      return res.status(400).json({ message: 'endDateTime must be after startDateTime.' });
    }

    // Fetch all active default questions
    const defaultQuestions = await Question.find({ isActive: true });
    if (!defaultQuestions || defaultQuestions.length === 0) {
      return res.status(400).json({ message: 'No active questions found to add to feedback form.' });
    }

    // Prepare the questions for the feedback form
    const feedbackQuestions = defaultQuestions.map(question => ({
      questionID: question._id,
    }));

    // Create the feedback form with course and faculty names retrieved from the DB
    const newFeedback = new Feedback({
      feedbackID,
      feedbackName,
      courseID,
      courseName: validation.course.courseName,
      departmentID,
      branch,
      facultyID,
      facultyName: validation.faculty.name,
      startDateTime,
      endDateTime,
      questions: feedbackQuestions,
    });

    // Save the feedback entity to the database
    const savedFeedback = await newFeedback.save();

    res.status(201).json({
      message: 'Feedback form created successfully',
      feedback: savedFeedback,
    });
  } catch (error) {
    console.error("Error creating feedback form:", error); // Log the error
    res.status(500).json({ message: 'Error creating feedback form', error: error.message });
  }
};

// Retrieve all active feedback forms
export const getActiveFeedback = async (req, res) => {
  try {
    // Find all feedback forms where isActive is true
    const feedbacks = await Feedback.find({ isActive: true }, {
      feedbackID: 1,
      feedbackName: 1,  // Include feedbackName in the response
      courseID: 1,
      courseName: 1,
      departmentID: 1,
      branch: 1,        // Include branch
      facultyID: 1,
      facultyName: 1,
      startDateTime: 1,
      endDateTime: 1,
      isActive: 1       // Optionally include isActive field
    });

    // Return the list of active feedback forms
    return res.status(200).json({
      feedbacks,
      message: 'Active feedback forms retrieved successfully!',
    });
  } catch (error) {
    console.error('Error fetching active feedback forms:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Retrieve feedback responses by feedback ID
export const getFeedbackResponses = async (req, res) => {
  const { feedbackID } = req.params;  // Get the feedbackID from the request parameters

  try {
    // Find the feedback by feedbackID and populate the responses and associated question data
    const feedback = await Feedback.findOne({ feedbackID })
      .populate('responses.answers.questionID', 'questionText') // Populate the questionText from the Question model
      .lean(); // Use lean() for better performance since we are only reading data

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    // Return the feedback with its responses
    return res.status(200).json({
      feedbackID: feedback.feedbackID,
      feedbackName: feedback.feedbackName,
      responses: feedback.responses,
      message: 'Feedback responses retrieved successfully!',
    });
  } catch (error) {
    console.error('Error fetching feedback responses:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};


// Retrieve feedback responses by feedback ID
// export const getFeedbackResponses = async (req, res) => {
//   const { feedbackID } = req.params; // Get the feedbackID from the request parameters

//   try {
//     // Find the feedback by feedbackID and populate the responses and associated question data
//     const feedback = await Feedback.findOne({ feedbackID })
//       .lean(); // Use lean() for better performance since we are only reading data

//     // Log the feedback object to inspect its structure
//     console.log("Fetched Feedback:", JSON.stringify(feedback, null, 2));

//     if (!feedback) {
//       return res.status(404).json({ message: 'Feedback not found.' });
//     }

//     // Check if responses exist and is an array
//     // const responses = Array.isArray(feedback.responses) ? feedback.responses : [];

//     // Log the responses to check their structure
//     console.log("Responses Array:", responses);

//     // Prepare an array to hold transformed responses
//     const transformedResponses = [];

//     // Iterate through each response
//     for (const response of feedback.responses) {
//       // Check if answers exist and is an array
//       const answers = Array.isArray(response.answers) ? response.answers : [];

//       // Prepare to hold answer data
//       const answerData = [];

//       // Iterate through each answer
//       for (const answer of answers) {
//         // Fetch the question text from the Question model using questionID
//         const question = await Question.findById(answer.questionID).select('questionText');

//         // If the question is found, extract the question text
//         const questionText = question ? question.questionText : 'Unknown';

//         // Push the structured answer into answerData
//         answerData.push({
//           questionID: answer.questionID, // Keep the questionID as is
//           questionText, // Set the retrieved question text
//           response: answer.response // Keep the response value
//         });
//       }

//       // Push the transformed response into transformedResponses
//       transformedResponses.push({
//         enrollment: response.enrollment,
//         answers: answerData,
//       });
//     }

//     // Log the transformed responses for verification
//     console.log("Transformed Responses:", transformedResponses);

//     // Return the feedback with its responses in the desired format
//     return res.status(200).json({
//       feedbackID: feedback.feedbackID,
//       feedbackName: feedback.feedbackName,
//       responses: transformedResponses, // Use the transformed responses
//       message: 'Feedback responses retrieved successfully!',
//     });
//   } catch (error) {
//     console.error('Error fetching feedback responses:', error);
//     return res.status(500).send({ message: 'Internal Server Error', error });
//   }
// };

// Retrieve all inactive feedback forms
export const getInactiveFeedback = async (req, res) => {
  try {
    // Find all feedback forms where isActive is false
    const feedbacks = await Feedback.find({ isActive: false }, {
      feedbackID: 1,
      feedbackName: 1,  // Include feedbackName in the response
      courseID: 1,
      courseName: 1,
      departmentID: 1,
      branch: 1,        // Include branch
      facultyID: 1,
      facultyName: 1,
      startDateTime: 1,
      endDateTime: 1,
      isActive: 1       // Optionally include isActive field
    });

    // Return the list of inactive feedback forms
    return res.status(200).json({
      feedbacks,
      message: 'Inactive feedback forms retrieved successfully!',
    });
  } catch (error) {
    console.error('Error fetching inactive feedback forms:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Delete a feedback form
export const deleteFeedback = async (req, res) => {
  try {
    const { feedbackID } = req.params;

    // Delete the feedback form
    const feedback = await Feedback.findOneAndDelete({ feedbackID });

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    // Return success response
    return res.status(200).json({ message: 'Feedback form deleted successfully!' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Search feedback forms
export const searchFeedback = async (req, res) => {
  try {
    const { search } = req.query; // Get the search query from the URL

    // Create a base query object for searching across multiple fields
    let query = {
      $or: [
        { feedbackID: { $regex: search, $options: 'i' } },
        { feedbackName: { $regex: search, $options: 'i' } }, // Added feedbackName to search
        { courseID: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } },
        { facultyName: { $regex: search, $options: 'i' } },
        { facultyID: { $regex: search, $options: 'i' } },
      ]
    };

    // Find feedback forms based on the query
    const feedbacks = await Feedback.find(query);

    if (feedbacks.length === 0) {
      return res.status(404).json({ message: 'No feedback forms found matching the search criteria.' });
    }

    // Return the list of feedback forms
    return res.status(200).json({
      feedbacks,
      message: 'Feedback forms retrieved successfully!',
    });
  } catch (error) {
    console.error('Error searching feedback forms:', error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// edit feedback forms
export const editFeedback = async (req, res) => {
  const { feedbackID } = req.params;
  const { facultyID, branch, feedbackName, startDateTime, endDateTime, ...otherDetails } = req.body;

  try {
    // Check if the feedback form exists
    const feedback = await Feedback.findOne({ feedbackID });
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback form not found.' });
    }

    // Determine if isActive should be set to true
    let isActive = feedback.isActive; // Start with current isActive value

    // If the facultyID is provided, fetch the new faculty details from the database
    if (facultyID) {
      const validation = await validateCourseAndFaculty(feedback.courseID, facultyID);
      if (!validation.success) {
        return res.status(400).json({ message: validation.message });
      }

      otherDetails.facultyID = facultyID;
      otherDetails.facultyName = validation.faculty.name; // Update facultyName
    }

    // If branch is provided, include it in the update
    if (branch) {
      otherDetails.branch = branch;
    }

    // If feedbackName is provided, include it in the update
    if (feedbackName) {
      otherDetails.feedbackName = feedbackName;
    }

    // Update startDateTime and endDateTime
    let currentDateTime = new Date();

    // Check and update startDateTime
    if (startDateTime) {
      if (new Date(startDateTime) > currentDateTime) {
        isActive = true; // Set isActive to true if startDateTime is in the future
      }
      otherDetails.startDateTime = startDateTime;
    }

    // Check and update endDateTime
    if (endDateTime) {
      if (new Date(endDateTime) > currentDateTime) {
        isActive = true; // Set isActive to true if endDateTime is in the future
      }
      // Validate endDateTime must be after startDateTime
      if (startDateTime && new Date(endDateTime) <= new Date(startDateTime)) {
        return res.status(400).json({ message: 'endDateTime must be after startDateTime.' });
      }
      otherDetails.endDateTime = endDateTime;
    }
    // Fetch all active default questions
    const defaultQuestions = await Question.find({ isActive: true });

    // Prepare the questions for the feedback form
    const feedbackQuestions = defaultQuestions.map(question => ({
      questionID: question._id,
    }));

    // Update the feedback details in the database
    const updatedFeedback = await Feedback.findOneAndUpdate(
      { feedbackID },
      {
        $set: {
          ...otherDetails,
          isActive, // Update isActive status
          lastModified: Date.now(), // Update lastModified to current time
          questions: feedbackQuestions,
        }
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      feedback: {
        feedbackID: updatedFeedback.feedbackID,
        feedbackName: updatedFeedback.feedbackName, // Include updated feedbackName
        courseID: updatedFeedback.courseID,
        courseName: updatedFeedback.courseName, // Keep existing courseName
        departmentID: updatedFeedback.departmentID,
        branch: updatedFeedback.branch, // Include updated branch
        facultyID: updatedFeedback.facultyID,
        facultyName: updatedFeedback.facultyName, // Updated facultyName
        startDateTime: updatedFeedback.startDateTime,
        endDateTime: updatedFeedback.endDateTime,
        questions: updatedFeedback.questions,
        submittedOn: updatedFeedback.submittedOn,
        lastModified: updatedFeedback.lastModified, // Include lastModified
      },
      message: 'Feedback form updated successfully!',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating feedback form', error: error.message });
  }
};

// Function to create a new question
export const createQuestion = async (req, res) => {
  const { questionID, questionText, isActive, responseType } = req.body; // Destructure all necessary fields
  try {
    const newQuestion = new Question({
      questionID,
      questionText,
      isActive,
      responseType // Include responseType in the model
    });
    const savedQuestion = await newQuestion.save();

    res.status(201).json({ message: 'Question created successfully', question: savedQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Error creating question', error: error.message });
  }
};

// Function to get all active questions
export const getActiveQuestions = async (req, res) => {
  try {
    const activeQuestions = await Question.find({ isActive: true });
    res.status(200).json(activeQuestions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active questions', error: error.message });
  }
};

// Function to get all inactive questions
export const getInactiveQuestions = async (req, res) => {
  try {
    const inactiveQuestions = await Question.find({ isActive: false });
    res.status(200).json(inactiveQuestions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inactive questions', error: error.message });
  }
};

// Function to edit a question by ID
export const editQuestion = async (req, res) => {
  const { questionID } = req.params; // Get the question ID from the request parameters
  const updateData = req.body; // Get the data to update from the request body

  try {
    // Validate that updateData has necessary fields if needed (optional)
    // Example: if (!updateData.questionText) { return res.status(400).json({ message: 'Question text is required' }); }

    // Find the question by ID and update it
    const updatedQuestion = await Question.findOneAndUpdate(
      { questionID }, // Match by questionID field
      updateData, // Data to update
      { new: true, runValidators: true } // Options
    );

    // Check if the question was found and updated
    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Respond with the updated question
    res.status(200).json({ message: 'Question updated successfully', question: updatedQuestion });
  } catch (error) {
    // Handle any potential errors
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: 'Error updating question', error: error.message });
  }
};

// Function to delete a question by ID
export const deleteQuestion = async (req, res) => {
  const { questionID } = req.params;

  try {
    // Use findOneAndDelete to delete by questionID
    const deletedQuestion = await Question.findOneAndDelete({ questionID: questionID }); // Adjusted to use the field name

    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error deleting question', error: error.message });
  }
};

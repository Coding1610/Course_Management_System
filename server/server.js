import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/AuthRoutes.js";

import StudentRoutes from "./routes/AdminStudentRoutes.js";
import FacultyRoutes from "./routes/FacultyRoutes.js";
import TaRoutes from "./routes/TaRoutes.js";
import CourseRoutes from "./routes/CourseRoutes.js";
import FeedbackRoutes from "./routes/FeedbackRoutes.js"
import cron from 'node-cron';
import Feedback from './model/feedbackModel.js';
import questionRoutes from './routes/QuestionRoutes.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use("/api/auth", authRoutes);
app.use('/api/student', StudentRoutes);
app.use('/api/faculty', FacultyRoutes);
app.use('/api/ta', TaRoutes);
app.use('/api/course', CourseRoutes);
app.use('/api/feedback', FeedbackRoutes);
app.use('/api/questions', questionRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(MONGO_URI)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => {
        console.error("Database connection error:", err.message);
    });

// Schedule a task to run Once per day at midnight.
cron.schedule('0 0 * * *', async () => {
// cron.schedule('*/5 * * * *', async () => {

    try {
        const now = new Date();

        // Find feedbacks that are past their end date and are still active
        const feedbacksToUpdate = await Feedback.find({ endDateTime: { $lt: now }, isActive: true });

        if (feedbacksToUpdate.length > 0) {
            // Extract feedback IDs
            const feedbackIDs = feedbacksToUpdate.map(feedback => feedback.feedbackID);

            // Update isActive status for those feedbacks
            await Feedback.updateMany(
                { feedbackID: { $in: feedbackIDs } },
                { isActive: false }
            );

            // Log the updated feedback IDs
            console.log(`Updated the following feedback forms to inactive status: ${feedbackIDs.join(', ')}`);
        } else {
            console.log("No feedback forms to update.");
        }
    } catch (error) {
        console.error('Error updating feedback forms:', error);
    }
}, {
    timezone: "Asia/Kolkata" // IST Timezone
});

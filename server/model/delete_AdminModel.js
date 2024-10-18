import mongoose from "mongoose";

// Admin Schema
const adminSchema = new mongoose.Schema({
  admin_id: { type: String, required: true },
  email: { type: String, required: true },
  contact: [{ type: String, required: true }],
  adminSecurityCode: { type: String, required: true },
});

// Feedback Answer Schema
const feedbackAnswerSchema = new mongoose.Schema({
  feedbackID: { type: String, required: true },
  studentID: { type: String, required: true },
  feedbackAnswer: [{ type: String, required: true }],
});

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  feedbackID: { type: String, required: true },
  courseID: { type: String, required: true },
  departmentID: { type: String, required: true },
  facultyID: { type: String, required: true },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  questions: [{ type: String, required: true }],
});

// Student Schema
const studentSchema = new mongoose.Schema({
  enrollment_no: { type: String, required: true },
  name: { type: String, required: true },
  departmentID: { type: String, required: true },
  joiningDate: { type: String, required: true },
  branch: { type: String, required: true },
  feesGrade: { type: String, required: true },
  emailID: { type: String, required: true },
  contactNo: { type: Number, required: true },
  password: { type: String, required: true },
});

// Faculty Schema
const facultySchema = new mongoose.Schema({
  facultyID: { type: String, required: true },
  name: { type: String, required: true },
  department: [{ type: String, required: true }],
  designation: { type: String, required: true },
  coursesAssigned: [{ type: String, required: true }],
  joiningDate: { type: Date, required: true },
  experience: { type: Number, required: true },
  emailID: { type: String, required: true },
  contactNumber: [{ type: String, required: true }],
  salary: { type: String, required: true },
});

// Courses Schema
const coursesSchema = new mongoose.Schema({
  courseID: { type: String, required: true },
  courseName: { type: String, required: true },
  department: [{ type: String, required: true }],
  courseStartDate: { type: Date, required: true },
  lastModified: { type: Date, required: true },
  semester: { type: String, required: true },
  courseInstructorID: { type: String, required: true },
  courseCreditStructure: [{ type: String, required: true }],
});

// Fees Schema
const feesSchema = new mongoose.Schema({
  studentID: { type: String, required: true },
  transactionID: { type: String, required: true },
  transactionDateTime: { type: Date , required: true },
  remainingAmount: { type: Number, required: true },
  transactionAmount: [{ type: Number, required: true }],
  isPaid: { type: Boolean, required: true },
});

// Models
const Admin = mongoose.model('Admin', adminSchema);
const FeedbackAnswer = mongoose.model('FeedbackAnswer', feedbackAnswerSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const Student = mongoose.model('Student', studentSchema);
const Faculty = mongoose.model('Faculty', facultySchema);
const Courses = mongoose.model('Courses', coursesSchema);
const Fees = mongoose.model('Fees', feesSchema);

// Export as a default object
export default {
  Admin,
  FeedbackAnswer,
  Feedback,
  Student,
  Faculty,
  Courses,
  Fees,
};
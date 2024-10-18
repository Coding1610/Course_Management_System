import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  image_url: {
    type: String,
    required: true,
  },
  enrollment: {
    type: Number,
    required: true,
    unique: true,
  },
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  CollegeEmail: {
    type: String,
    required: true,
    unique: true,
  },
  Contact: {
    type: Number,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  AadharNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  GuardianNumber: {
    type: Number,
    required: true,
  },
  GuardianEmail: {
    type: String,
    required: true,
  },
  Other: {
    isPhysicalHandicap: { type: Boolean, required: true },
    birthPlace: { type: String },
    AdmissionThrough: { type: String },
    CasteCategory: { type: String },
  },
  Academic_info: {
    Degree:{type: String, required: true},
    Branch: { type: String, required: true },
    Semester: { type: Number },
    Total_Courses: { type: Number, default: 0 },
    Enroll_Year: { type: Number },
    isTA: { type: Boolean, default: false }
  },
  Address: {
    Addr: { type: String },
    City: { type: String },
    State: { type: String },
    Country: { type: String },
    PinCode: { type: Number }
  },
  CourseCompleted: {
    type: [
      {
        Course_Id: Number,
        Course_Name: String,
        faculty_Id: Number,
        faculty_Name: String,
      }
    ],
    default: []
  },
  UpcomingDeadlines: {
    type: [
      {
        heading: String,
        description: String,
        date: Date
      }
    ],
    default: []
  },
  Courses: {
    type: [
      {
        Course_Id: Number,
        Course_Name: String,
        faculty_Id: Number,
        faculty_Name: String,
        lectures: Number,
        lectures_attended: Number,
        enroll_req_accepted: Boolean,
      }
    ],
    default: []
  },
});

const Student = new mongoose.model("students", StudentSchema);

export default Student;
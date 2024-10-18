import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
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
  Contact: {
    type: Number,
    required: true,
    unique: true,
    max: 10,
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
  Branch: {
    type: String,
  },
  Address:{
    Addr:{type:String},
    City:{type:String},
    State:{type:String},
    Country:{type:String},
    PinCode:{type:Number}
  },
  CourseCompleted:{
    type:Object,    
  },
  ClassAttended:{
    type:Number,
  },
  UpcomingDeadlines:{
    type:Object,
  },
  Courses:{
    faculty_Id,
    Course_Id
  }
  
});

const Student = new mongoose.model("StudentSchema",StudentSchema)

export default Student
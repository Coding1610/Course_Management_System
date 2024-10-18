import mongoose from 'mongoose';

const coursesSchema = new mongoose.Schema({
  courseID: { type: String, required: true },
  courseName: { type: String, required: true },
  department: { type: String, required: true },
  branch: { type: String, required: true },
  courseStartDate: { type: Date, required: true },
  lastModified: { 
    type: Date, 
    default: Date.now, // Automatically set to the current date
  },
  semester: { type: String, required: true },
  courseInstructorID: { type: String, required: true },
  courseInstructorName: { type: String, required: true },
  courseCredit: { type: String, required: true },
});

// Pre-save hook to update the lastModified field
coursesSchema.pre('save', function(next) {
  this.lastModified = Date.now();
  next();
});

// Create and export the Mongoose model
const Course = mongoose.model('Course', coursesSchema);

export default Course;
import mongoose from 'mongoose';

const TASchema = new mongoose.Schema({
  enrollment: { 
    type: String, 
    ref: 'students',  // Reference to the Student model
    required: true 
  },
  facultyId: {
    type: String, 
    ref: 'faculties',  // Reference to Faculty model
    required: true
  },
  teachingSemester: { 
    type: Number, 
    required: true 
  },
  teachingCourses: {  // Array of ObjectId references to courses
    type: String, 
    ref: 'courses',  
    required: true
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date 
  },
  stipendAmount: { 
    type: String 
  },
});

const TAModel = mongoose.model("TA", TASchema);

export default TAModel;

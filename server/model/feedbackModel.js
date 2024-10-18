import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  feedbackID: { type: String, required: true },
  feedbackName: { type: String, required: true },
  courseID: { type: String, required: true },
  courseName: { type: String, required: true },
  departmentID: { type: String, required: true },
  branch: { type: String, required: true },
  facultyID: { type: String, required: true },
  facultyName: { type: String, required: true },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  questions: [{
    questionID: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }, // Reference to Question model
  }],
  responses: [{
    studentID: { type: String, required: true }, // Identifier for the student giving feedback
    answers: [{
      questionID: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }, // Relates back to a question
      response: { type: mongoose.Schema.Types.Mixed, required: true } // Answer (text or numeric for ratings)
    }]
  }],
  submittedOn: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now },
});

// Pre-save hook to update the lastModified field and check isActive status
feedbackSchema.pre('save', function(next) {
  this.lastModified = Date.now();

  // Check if the endDateTime has passed
  if (this.endDateTime && this.endDateTime < new Date()) {
    this.isActive = false; // Set isActive to false if the endDateTime is in the past
  }

  next();
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;

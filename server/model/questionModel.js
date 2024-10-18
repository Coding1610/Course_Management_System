import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionID: { type: String, required: true, unique: true }, // Unique identifier for the question
  questionText: { type: String, required: true }, // The actual question
  responseType: { type: String, enum: ['rating', 'text'], required: true }, // Type of response expected: rating (e.g., scale 1-5) or text
  isActive: { type: Boolean, default: true }, // Whether the question is active for feedback
  createdOn: { type: Date, default: Date.now }, // Creation timestamp
});

// Create and export the Mongoose model
const Question = mongoose.model('Question', questionSchema);

export default Question;

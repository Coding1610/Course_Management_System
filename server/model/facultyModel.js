import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  image_url: {
    type: String,
    required: true,
  },
  facultyId: { type: Number, required: true },
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
  Gender: {
    type: String,
    required: true,
  },
  AadharNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  Address: {
    Addr: { type: String },
    City: { type: String },
    State: { type: String },
    Country: { type: String },
    PinCode: { type: Number }
  },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  contactNumber: { type: Number, required: true },
  salary: { type: String, required: true },
});

// Create and export the Mongoose model
const Faculty = mongoose.model('Faculty', facultySchema);

export default Faculty;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // user_id: { type: String, required: true, unique: true },
  user_id: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["master-admin","academic-admin","finance-admin", "faculty", "student"], required: true },
  securityCode: { type: String, default: false },
  mustChangePassword: { type: Boolean, default: true },  
  email: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model("users", userSchema);
export default User;

import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true }, 
  value: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } }, 
}, { timestamps: true });

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: { type: String, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, trim: true },
  title: { type: String, trim: true },
  bio: { type: String },
  password: { type: String, required: true },
  profilePicture: { type: String },
  role: { type: String, enum: ['user', 'admin', 'superAdmin'], default: 'user' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;

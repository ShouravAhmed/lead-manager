import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);
export default Team;

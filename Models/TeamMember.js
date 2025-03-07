import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, trim: true },
}, { timestamps: { createdAt: 'joinedAt' } });

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
export default TeamMember;

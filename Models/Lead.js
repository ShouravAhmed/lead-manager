import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  currentOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subOwners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['Processing', 'Followup', 'CallbackRequested', 'SaleMade', 'DeclinedSale'], default: 'Processing' },
  followupAt: { type: Date },
  closingNote: { type: String },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;

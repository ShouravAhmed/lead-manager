import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  businessName: { type: String, trim: true },
  merchantHistory: { type: String },
  deposit: { type: Number },
  lookingFor: { type: Number },
  creditScore: { type: mongoose.Schema.Types.Decimal128 },
  existingLoan: { type: Number },
  note: { type: String },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

clientSchema.index({ team: 1, phone: 1 }, { unique: true });

const Client = mongoose.model('Client', clientSchema);
export default Client;

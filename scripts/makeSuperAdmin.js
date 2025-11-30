import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.js';
import connectDB from '../db.js';

dotenv.config();

const makeSuperAdmin = async () => {
  try {
    await connectDB();
    
    const email = 'aa.shourav23@gmail.com';
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found.`);
      process.exit(1);
    }
    
    user.role = 'superAdmin';
    await user.save();
    
    console.log(`Successfully made ${email} a super admin.`);
    process.exit(0);
  } catch (error) {
    console.error('Error making super admin:', error);
    process.exit(1);
  }
};

makeSuperAdmin();


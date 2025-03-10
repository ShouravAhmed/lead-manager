import OTP from "../models/otp.js";

class OtpRepository {
  async createOrUpdateOtp(key, value, expiresInMinutes = 5) {
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    return await OTP.findOneAndUpdate(
      { key }, 
      { value, expiresAt }, 
      { upsert: true, new: true } 
    );
  }

  async findOtp(key) {
    return await OTP.findOne({ key });
  }

  async deleteOtp(key) {
    return await OTP.deleteOne({ key });
  }
}

export default new OtpRepository();

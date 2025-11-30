import OtpRepository from "../repositories/otpRepository.js";
import crypto from "crypto";
import { emailOtp } from "../helper/emailOtp.js";

class OtpService {
  generateOtp(length = 6) {
    return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  }

  async sendOtp(email, expiresInMinutes=5) {
    const otp = this.generateOtp();
    await OtpRepository.createOrUpdateOtp(email, otp, expiresInMinutes);
    await emailOtp(email, otp);
  }

  async verifyOtp(email, otp) {
    const otpRecord = await OtpRepository.findOtp(email);
    if (!otpRecord || otpRecord.value != otp.toString()) return false;
    OtpRepository.deleteOtp(email);
    return true;
  }

  async saveToken(key, value, expiresInMinutes=5) {
    return await OtpRepository.createOrUpdateOtp(key, value, expiresInMinutes);
  }

  async findToken(key) {
    const token = await OtpRepository.findOtp(key);
    return token ? token.value : null;
  }

  async deleteToken(key) {
    return await OtpRepository.deleteOtp(key);
  }
}

export default new OtpService();

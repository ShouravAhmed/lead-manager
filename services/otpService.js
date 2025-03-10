import OtpRepository from "../repositories/otpRepository.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

class OtpService {
  generateOtp(length = 6) {
    return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  }

  async emailOtp(email, otp) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    const mailOptions = {
      from: "MS_y0AJsN@trial-vywj2lp859mg7oqz.mlsender.net",
      to: email,
      subject: "OTP for EdgeLead email verification",
      text: `Your OTP is ${otp}`
    };
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent: ${info.response}`);
    } 
    catch (error) {
      console.log(error);
    }    
  }

  async sendOtp(email, expiresInMinutes=5) {
    const otp = this.generateOtp();
    await OtpRepository.createOrUpdateOtp(email, otp, expiresInMinutes);
    await this.emailOtp(email, otp);
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

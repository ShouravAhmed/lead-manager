import transporter from "./emailTransporter.js";
import nodemailer from "nodemailer";

export async function emailOtp(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || "MS_y0AJsN@trial-vywj2lp859mg7oqz.mlsender.net",
    to: email,
    subject: "OTP for SagaciousLyfe email verification",
    text: `Your OTP is ${otp}`
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } 
  catch (error) {
    console.error(`Email sending error: ${error}`);
  }    
}


import transporter from "./emailTransporter.js";
import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject,
        text
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } 
    catch (error) {
        console.error('Email sending failed:', error);
        throw error; // Re-throw to handle in calling function
    }   
}
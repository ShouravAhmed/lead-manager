import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text) => {
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
        subject,
        text
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } 
    catch (error) {
        console.log(error);
    }   
}
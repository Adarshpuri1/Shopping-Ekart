import nodemailer from 'nodemailer';
import 'dotenv/config';

export const sendOTPMail = async (otp, email) => {
    try {
        // console.log(process.env.MAIL_USER, process.env.MAIL_PASS)

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS, // App password ONLY
            }
        });

        // Verify connection first
        await transporter.verify();

        const mailConfigurations = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`,
        };

        await transporter.sendMail(mailConfigurations);
        console.log("Email sent successfully");
    } catch (err) {
        console.error("Email error:", err.message);
        throw new Error("Failed to send email");
    }
};

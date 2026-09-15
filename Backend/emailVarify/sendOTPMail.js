import nodemailer from 'nodemailer'
import 'dotenv/config'

export const sendOTPMail = async (otp, email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailConfigurations = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for password reset is: ${otp}`
    };

    try {
        const info = await transporter.sendMail(mailConfigurations);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (err) {
        console.error('sendOTPMail error:', err.message);
        throw err;
    }
}

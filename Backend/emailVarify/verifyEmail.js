import nodemailer from 'nodemailer'
import 'dotenv/config'

export const verifyEmail = async (token, email) => {
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
        subject: 'Email Verification',
        text: `HI! There, You have recently visited 
         our website and entered your email.
         Please follow the given link to verify your email
         https://shopping-ekart-frontend.onrender.com/verify/${token}
         Thanks`
    };

    try {
        const info = await transporter.sendMail(mailConfigurations);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (err) {
        console.error('verifyEmail error:', err.message);
        throw err;
    }
}

import nodemailer from 'nodemailer'
import 'dotenv/config'
export const SendOTPMail = (otp, email) => {
    const transporter =
        nodemailer.createTransport(
            {
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            }
        );
    const mailConfigurations = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for password reset is: ${otp}`
    };
    transporter.sendMail(mailConfigurations,function (err, data) {
            if (err) {
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully');
            }
        });
}

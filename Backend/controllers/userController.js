import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyEmail } from "../emailVarify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailVarify/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";

// --- REGISTER USER ---
export const register = async (req, resp) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return resp.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return resp.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: newUser._id },
            process.env.SECRET_KEY,
            { expiresIn: "10m" }
        );

        // IMPORTANT: Await the email sending
        await verifyEmail(token, email);

        newUser.token = token;
        await newUser.save();

        return resp.status(201).json({
            success: true,
            message: "User registered successfully. Please verify your email.",
            user: { id: newUser._id, email: newUser.email }
        });

    } catch (error) {
        return resp.status(500).json({ success: false, message: error.message });
    }
}

// --- VERIFY EMAIL (Clicked from Email Link) ---
export const verify = async (req, resp) => {
    try {
        // Most email links pass token in URL: /api/user/verify/:token
        const token = req.params.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return resp.status(400).json({ success: false, message: "Token is missing" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            return resp.status(400).json({ success: false, message: "Token expired or invalid" });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return resp.status(404).json({ success: false, message: "User not found" });
        }

        user.token = null;
        user.isVerified = true;
        await user.save();

        return resp.status(200).json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        return resp.status(500).json({ success: false, message: error.message });
    }
}

// --- REGENERATE VERIFICATION TOKEN ---
export const reTokenGenrate = async (req, resp) => {
    try {
        const { email } = req.body;
        if (!email) {
            return resp.status(400).json({ success: false, message: "Please provide email" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return resp.status(404).json({ success: false, message: "User not found" });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10m' });
        
        // IMPORTANT: Await the email sending
        await verifyEmail(token, email);
        
        user.token = token;
        await user.save();

        return resp.status(200).json({ success: true, message: "Verification email resent successfully" });

    } catch (error) {
        return resp.status(500).json({ success: false, message: error.message });
    }
}

// --- LOGIN ---
export const login = async (req, resp) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return resp.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return resp.status(404).json({ success: false, message: "User does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return resp.status(400).json({ success: false, message: "Incorrect password" });
        }

        if (!user.isVerified) {
            return resp.status(403).json({ success: false, message: "Please verify your email first" });
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10d' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '30d' });
        
        user.isLoggedIn = true;
        await user.save();

        await Session.findOneAndDelete({ userId: user._id });
        await Session.create({ userId: user._id });

        return resp.status(200).json({
            success: true,
            message: `Welcome back, ${user.firstName}`,
            user,
            accessToken,
            refreshToken
        });

    } catch (error) {
        return resp.status(500).json({ success: false, message: error.message });
    }
}

// --- LOGOUT ---
export const logout = async (req, resp) => {
    try {
        const userId = req.id; // Assumes your auth middleware sets req.id
        await Session.deleteMany({ userId });
        await User.findByIdAndUpdate(userId, { isLoggedIn: false });

        return resp.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return resp.status(500).json({ success: false, message: error.message });
    }
}

// --- FORGOT PASSWORD (SEND OTP) ---
export const forgetPassword = async (req, resp) => {
    try {
        const { email } = req.body;
        if (!email) {
            return resp.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return resp.status(404).json({ success: false, message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // IMPORTANT: Await the OTP mail
        await sendOTPMail(otp, email);

        return resp.status(200).json({ success: true, message: "OTP sent to email successfully" });

    } catch (error) {
        return resp.status(500).json({ success: false, message: error.message });
    }
}

// --- VERIFY OTP ---
export const verifyOtp = async (req, resp) => {
    try {
        const { otp } = req.body;
        const { email } = req.params; // Ensure your route is /verify-otp/:email

        if (!otp) {
            return resp.status(400).json({ success: false, message: "OTP is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return resp.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.otp || !user.otpExpiry) {
            return resp.status(400).json({ success: false, message: "OTP not generated" });
        }

        if (user.otpExpiry < new Date()) {
            return resp.status(400).json({ success: false, message: "OTP has expired" });
        }

        if (otp !== user.otp) {
            return resp.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // Keep OTP for one more step (password change) or clear it here
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return resp.status(200).json({ success: true, message: "OTP verified successfully" });

    } catch (error) {
        return resp.status(500).json({ success: false, message: error.message });
    }
}

// --- CHANGE PASSWORD ---
export const changePassword = async (req, resp) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const { email } = req.params;

        if (newPassword !== confirmPassword) {
            return resp.status(400).json({ success: false, message: "Passwords do not match" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return resp.status(404).json({ success: false, message: "User not found" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return resp.status(200).json({ success: true, message: "Password changed successfully" });

    } catch (error) {
        return resp.status(500).json({ success: false, message: error.message });
    }
}

// --- GET ALL USERS ---
export const allUser = async (req, resp) => {
    try {
        const users = await User.find().select("-password");
        return resp.status(200).json({ success: true, users });
    } catch (error) {
        return resp.status(500).json({ success: false, message: error.message });
    }
}

// --- GET USER BY ID ---
export const getUserById = async (req, resp) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("-password -otp -otpExpiry -token");
        if (!user) {
            return resp.status(404).json({ success: false, message: "User not found" });
        }
        return resp.status(200).json({ success: true, user });
    } catch (error) {
        return resp.status(500).json({ success: false, message: error.message });
    }
}

// --- UPDATE USER ---
export const updateUser = async (req, resp) => {
    try {
        const { id: userIdToUpdate } = req.params;
        const { firstName, lastName, address, city, zipCode, phoneNo, role } = req.body;
        const loggedInUser = req.user; // Set by your auth middleware

        if (loggedInUser._id.toString() !== userIdToUpdate && loggedInUser.role !== 'admin') {
            return resp.status(403).json({ success: false, message: "Unauthorized to update this profile" });
        }

        let user = await User.findById(userIdToUpdate);
        if (!user) {
            return resp.status(404).json({ success: false, message: "User not found" });
        }

        let profilePicUrl = user.profilepic;
        let profilePicPublicId = user.profilePublicId;

        if (req.file) {
            if (profilePicPublicId) {
                await cloudinary.uploader.destroy(profilePicPublicId);
            }
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "ProfilePic" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });
            profilePicUrl = uploadResult.secure_url;
            profilePicPublicId = uploadResult.public_id;
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.address = address || user.address;
        user.city = city || user.city;
        user.zipCode = zipCode || user.zipCode;
        user.phoneNo = phoneNo || user.phoneNo;
        user.role = role || user.role;
        user.profilepic = profilePicUrl;
        user.profilePublicId = profilePicPublicId;

        const updatedUser = await user.save();
        return resp.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        return resp.status(500).json({ success: false, message: error.message });
    }
}

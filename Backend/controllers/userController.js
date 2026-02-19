import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verifyEmail } from "../emailVarify/verifyEmail.js";

import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailVarify/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";

//Register new User
export const register = async (req, resp) => {
    try {

        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return resp.status(400).json({
                success: false,
                message: "All field are required"
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return resp.status(400).json({
                success: false,
                message: "User already exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        const token = jwt.sign(
            { id: newUser._id },
            process.env.SECRET_KEY,
            { expiresIn: "10m" }
        )

        await verifyEmail(token, email);

        newUser.token = token;
        await newUser.save();

        return resp.status(200).json({
            success: true,
            message: "User register successfully",
            user: newUser
        })


    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//Verify User with Email
export const verify = async (req, resp) => {
    try {
        const authheader = req.headers.authorization;

        if (!authheader || !authheader.startsWith("Bearer ")) {
            return resp.status(400).json({
                success: false,
                message: "Token is missing or Invailed"
            })
        }

        const token = authheader.split(" ")[1];
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            return resp.status(400).json({
                success: false,
                message: error.message
            })
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return resp.status(400).json({
                success: false,
                message: "User not exit"
            })
        }

        user.token = null;
        user.isVerified = true;
        await user.save();

        return resp.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//Regenrate Token
export const reTokenGenrate = async (req, resp) => {
    try {
        const { email } = req.body;

        if (!email) {
            return resp.status(400).json({
                success: false,
                message: "Please provide valid email"
            })
        }
        const user = await User.findOne({ email })

        if (!user) {
            return resp.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10m' })
        verifyEmail(token, email);
        user.token = token;
        await user.save();
        return resp.status(200).json({
            success: true,
            message: "Verification email sent to user successfully",
            token: user.token
        })
    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// Login user
export const login = async (req, resp) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return resp.status(400).json({
                success: false,
                message: "All feild are required"
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return resp.status(400).json({
                success: false,
                message: "User not exits"
            })
        }

        const isPassswordValid = await bcrypt.compare(password, user.password);
        if (!isPassswordValid) {
            return resp.status(400).json({
                success: false,
                message: "password is incorrect"
            })
        }

        if (user.isVerified == false) {
            return resp.status(400).json({
                success: false,
                message: "verify first "
            })
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10d' })
        const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '30d' })
        user.isLoggedIn = true
        await user.save()

        const existingSession = await Session.findOne({ userId: user._id });
        if (existingSession) {
            await Session.deleteOne({ userId: user._id })
        }
        await Session.create({ userId: user._id })
        return resp.status(200).json({
            success: true,
            message: `Welcome back ${user.firstName}`,
            user,
            accessToken,
            refreshToken
        })

    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//Logout User
export const logout = async (req, resp) => {
    try {
        
        const userId = req.id
        await Session.deleteMany({ userId: userId })
        await User.findByIdAndUpdate(userId, { isLoggedIn: false })
        return resp.status(200).json({
            success: true,
            message: "User logout successfully"
        })

    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message
        })
    }
}


//forget Password
export const forgetPassword = async (req, resp) => {
    try {
        const { email } = req.body
        if (!email) {
            return resp.status(400).json({
                success: false,
                message: "Please write email"
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return resp.status(400).json({
                success: false,
                message: "User not exits"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);


        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        sendOTPMail(otp, email);

        return resp.status(200).json({
            success: true,
            message: "OTP sent to email successfully"
        })

    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//Verify Otp
export const verifyOtp = async (req, resp) => {
    try {
        const { otp } = req.body;
        const email = req.params.email;

        if (!otp) {
            return resp.status(400).json({
                success: false,
                message: "Otp is required"
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return resp.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        if (!user.otp || !user.otpExpiry) {
            return resp.status(400).json({
                success: false,
                message: "Otp is not generted or already verified"
            })
        }
        if (user.otpExpiry < new Date()) {
            return resp.status(400).json({
                success: false,
                message: "Otp has expired please request new otp"
            })
        }
        if (otp !== user.otp) {
            return resp.status(400).json({
                success: false,
                message: "OTP Invailed"
            })
        }
        user.otp = null;
        user.otpExpiry = null;
        await user.save();


        return resp.status(200).json({
            success: true,
            message: "OTP verified successfully"
        })


    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//change Password
export const changePassword = async (req, resp) => {
    try {
        const { newPassword, confirmPassword } = req.body
        const { email } = req.params
        const user = await User.findOne({ email })
        if (!user) {
            return resp.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        if (!newPassword || !confirmPassword) {
            return resp.status(400).json({
                success: false,
                message: "All field not match"
            })
        }
        if (newPassword !== confirmPassword) {
            return resp.status(400).json({
                success: false,
                message: "Password do not match"
            })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword
        await user.save()
        return resp.status(200).json({
            success: true,
            message: "password change successfully"
        })

    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//All user
export const allUser = async (req, resp) => {
    try {
        const Users = await User.find();
        return resp.status(200).json({
            success: true,
            Users
        })
    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//User profile
export const getUserById = async (req, resp) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId).select("-password -otp -otpExpiry -token");
        if (!user) {
            return resp.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        return resp.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const updateUser = async (req, resp) => {
    try {
        const { id: userIdToUpdate } = req.params
        const { firstName, lastName, address, city, zipCode, phoneNo, role } = req.body;
        const loggedInUser = req.user
        if (loggedInUser._id.toString() !== userIdToUpdate &&
            loggedInUser.role !== 'admin') {
            return resp.status(403).json({
                success: false,
                message: "You are not allow to update this profile"
            })
        }
        let user = await User.findById(userIdToUpdate);
        if (!user) {
            return resp.status(400).json({
                success: false,
                message: "user not exits"
            })
        }
        let profilePicUrl = user.profilepic;
        let profilePicPublicId = user.profilePublicId;
        if (req.file) {
            if (profilePicUrl) {
                await cloudinary.uploader.destroy(profilePicPublicId)
            }
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "ProfilePic" },
                    (error, result) => {
                        if (error) { reject(error) }
                        else { resolve(result) }
                    }
                )
                stream.end(req.file.buffer);
            })
            profilePicUrl=uploadResult.secure_url;
            profilePicPublicId=uploadResult.public_id;
        }

        //update fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.address = address || user.address;
        user.city = city || user.city;
        user.zipCode = zipCode || user.zipCode;
        user.phoneNo = phoneNo || user.phoneNo;
        user.role = role;
        user.profilepic = profilePicUrl;
        user.profilePublicId = profilePicPublicId;
        const updateUser = await user.save();
        return resp.status(200).json({
            success: true,
            message: "profile Update successsfully",
            user: updateUser
        })        
    } catch (error) {
        return resp.status(400).json({
            success: false,
            message: error.message
        })
    }
}

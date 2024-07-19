import { User } from "../models/users.js";
import Verification from '../models/Verification.js';
import { sendToken } from "../utils/sendToken.js";
import { sendMail } from "../utils/sendmail.js";
import { LeadAssignment } from '../models/leadAssignment.js';
import twilio from 'twilio';
import nodemailer from 'nodemailer';

const accountSid = "ACf6a5a1ef74e132f3eb1932fd5eabf6fc";
const authToken = "24cf75fb4a9ad3142adee0151111bf1a";
const serviceSid = "VAa12dfc7c77f0e8ee8d09abc22f8de1ca";
const client = twilio(accountSid, authToken);

const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
});

export const register = async (req, res) => {
    try {

        const {fullName, middleName, lastName, password, email, mobile, img, city, area, pin, firmName, rera, gst} = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // const verification = await Verification.findOne({ phoneNumber: mobile, email: email });

        // if (!verification || !verification.phoneVerified || !verification.emailVerified) {
        //     return res.status(400).send('Phone or Email not verified');
        // }

        user = await User.create({
            fullName,
            middleName,
            lastName,
            password,
            email,
            mobile,
            img,
            city,
            area,
            pin,
            firmName,
            rera,
            gst,
            role: "admin",
        });

        sendToken(res, user, 200, "🤩You have created account successfully🤩");
        
    } catch (error) {
        res.status(500).send({ success: false, message: `server error: ${error.message}` });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        res.status(200).send({ success: true, message: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching post" });
    }
};

export const sendVerification = async (req, res) => {
    const { email, phoneNumber } = req.body;

    try {
        let verification = await Verification.findOne({ $or: [{ email }, { phoneNumber }] });

        if (verification) {
        if (email && !verification.emailVerified) {
            // Send email verification
            const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
            await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            text: `Your verification code is ${emailCode}`,
            });
            verification.emailCode = emailCode;
        }

        if (phoneNumber && !verification.phoneVerified) {
            // Send SMS verification
            const phoneCode = await sendSmsVerificationCode(phoneNumber);
            verification.phoneCode = phoneCode;
        }

        await verification.save();
        } else {
        // Create new verification document
        const newVerification = new Verification({
            email,
            phoneNumber,
        });

        if (email) {
            // Send email verification
            const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
            await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            text: `Your verification code is ${emailCode}`,
            });
            newVerification.emailCode = emailCode;
        }

        if (phoneNumber) {
            // Send SMS verification
            const phoneCode = await sendSmsVerificationCode(phoneNumber);
            newVerification.phoneCode = phoneCode;
        }

        await newVerification.save();
        }

        res.status(200).send('Verification sent');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

export const verifyCode = async (req, res) => {
    const { email, phoneNumber, emailCode, phoneCode } = req.body;

    try {
        const verification = await Verification.findOne({ $or: [{ email }, { phoneNumber }] });

        if (!verification) {
            return res.status(404).send('Verification not found');
        }

        let emailVerified = false;
        let phoneVerified = false;

        if (verification.email === email && verification.emailCode === emailCode) {
            emailVerified = true;
        }

        if (verification.phoneNumber === phoneNumber && verification.phoneCode === phoneCode) {
            phoneVerified = true;
        }

        await Verification.findOneAndUpdate(
            { $or: [{ email }, { phoneNumber }] },
            { emailVerified, phoneVerified }
        );

        res.status(200).send('Verification successful');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

const sendSmsVerificationCode = async (phoneNumber) => {
    try {
        const verification = await client.verify.v2.services(serviceSid)
        .verifications
        .create({ to: phoneNumber, channel: 'sms' });

        return verification.sid;
    } catch (error) {
        console.error(error);
        throw new Error('Error sending SMS verification');
    }
};

export const checkEmailMobileExist = async (req, res) => {
    try {
        const { email } = req.body;
    
        const user = await User.findOne({ email });
    
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please enter all fields" });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email or Password" });
        }

        if (user.verified === true) {
            const isMatch = await user.comparePassword(password);
    
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Invalid Email or Password" });
            }
    
            sendToken(res, user, 200, "🤩login successfully🤩");
        } else {
            return res.status(400).json({ success: false, message: "Your Profile is not verified yet. We will verified withing 48 hours" });
        }

        
    } catch (error) {
        res.status(500).send({ success: false, message: `server error: ${error.message}` });
    }
}

export const logout = async (req, res) => {
    try {
        res
            .status(200)
            .cookie("token", null, {
                expires: new Date(Date.now()),
            })
            .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        sendToken(res, user, 200, `welcome back ${user.fullName}`);

    } catch (error) {
        res.status(500).send({ success: false, message: `server error: ${error.message}` });
    }
}

export const forgetPassword = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Please enter all fields" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email" });
        }

        const otp = Math.floor(Math.random() * 1000000);

        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        const message = `Your email verification code for resetting password is ${otp}. If you did not request for resetting password, please ignore or report.🙏 `;
        
        await sendMail(email, "Verify your account", message);
        
        res.status(200).send({ success: true, message: `OTP sent to your ${email}`, OTP: otp });
        
    } catch (error) {
        res.status(500).send({ success: false, message: `server error: ${error.message}` });
    }
}

export const verifyOTP = async (req, res) => {
    try {

        const { otp } = req.body;

        const user = await User.findOne({
            resetPasswordOtp: otp,
            resetPasswordOtpExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "OTP Invalid or has been Expired" });
        }

        user.resetPasswordOtp = null;
        user.resetPasswordOtpExpiry = null;
        await user.save();

        res.status(200).send({ success: true, message: user });
        
    } catch (error) {
        res.status(500).send({ success: false, message: `server error: ${error.message}` });
    }
}

export const resetPassword = async (req, res) => {
    try {

        const { id, newPassword, ConfirmPassword } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({ success: false, message: "OTP Invalid or has been Expired" });
        }

        user.password = ConfirmPassword;
        await user.save();

        res.status(200).send({ success: true, message: `Password changed successfully` });
        
    } catch (error) {
        res.status(500).send({ success: false, message: `server error: ${error.message}` });
    }
}

export const addTeamMember = async (req, res) => {
    try {

        const {bossID, fullName, email, mobile, role} = req.body;

        let user = await User.find({ fullName });

        // if (user) {
        //     return res.status(400).json({ success: false, message: "User already exists" });
        // }

        const pass = Math.floor(Math.random() * 1000000);

        user = User({
            bossID,
            fullName,
            email,
            mobile,
            role,
            password: pass,
            verified: true,
        });
        await user.save();

        const message = `Successfully added team member your login credentials for sales executive is email:- ${email} & password:- ${pass}`;
        
        await sendMail(email, "Verify your account", message);


        res.status(200).send({ success: false, message: user });
        
    } catch (error) {
        res.status(500).send({ success: false, message: `server error: ${error.message}` });
    }
}

export const getTeamMember = async (req, res) => {
    try {
        const { bossID } = req.params;
        const message = await User.find({ bossID })
        res.json(message);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching post' });
    }
}

export const excelData = async (req, res) => {
    try {
        
        console.log(req.body);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching post' });
    }
}

export const getUsersWithRules = async () => {

    try {
        // Fetch user IDs from LeadAssignment model
        const usersWithRules = await LeadAssignment.distinct('userID');
    
        // Fetch user details for users with rules
        const users = await User.find({ _id: { $in: usersWithRules } });

        // console.log(users);

        return users;

    } catch (error) {
        
        console.error('Error fetching users with rules:', error);
        throw error;
    }
};
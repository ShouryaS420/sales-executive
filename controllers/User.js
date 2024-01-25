import { User } from "../models/users.js";
import { sendToken } from "../utils/sendToken.js";
import { sendMail } from "../utils/sendmail.js";

export const register = async (req, res) => {
    try {

        const {fullName, middleName, lastName, password, email, mobile, city, area, pin, rera, gst} = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        user = await User.create({
            fullName,
            middleName,
            lastName,
            password,
            email,
            mobile,
            city,
            area,
            pin,
            rera,
            gst,
        });

        sendToken(res, user, 200, "🤩You have created account successfully🤩");
        
    } catch (error) {
        res.status(500).send({ success: false, message: `server error: ${error.message}` });
    }
}

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
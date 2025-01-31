import express from "express";
import {
    register,
    checkEmailMobileExist,
    login,
    logout,
    getMyProfile,
    forgetPassword,
    verifyOTP,
    resetPassword,
    addTeamMember,
    getTeamMember,
    excelData,
    sendVerification,
    verifyCode,
    getUserById,
} from "../controllers/User.js";
import { isAuthenticated } from "../middleware/auth.js";

const router= express.Router();

router.route("/register").post(register);
router.route("/checkEmailMobileExist").post(checkEmailMobileExist);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getMyProfile);
router.route("/forgetPassword").post(forgetPassword);
router.route("/verifyOTP").put(verifyOTP);
router.route("/resetPassword").put(resetPassword);
router.route("/addTeamMember").post(addTeamMember); 
router.route("/getTeamMember/:bossID").get(getTeamMember);
router.route("/excelData").post(excelData);

router.route("/sendVerification").post(sendVerification);  // added
router.route("/verifyCode").post(verifyCode);  // added
router.route("/getUserById/:id").get(getUserById);  // added

export default router;
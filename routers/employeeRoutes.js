import express from "express";
import {
    addEmployee,
    getTeamMember,
    checkEmailExists,
    getTeamMemberById,
} from "../controllers/employeeController.js";

const router = express.Router();

router.post('/addEmployee', addEmployee);
router.get('/getTeamMember/:team', getTeamMember);
router.get('/getTeamMemberById/:id', getTeamMemberById);
router.get('/checkEmailExists', checkEmailExists);

export default router;

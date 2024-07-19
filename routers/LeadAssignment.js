import express from "express";
import {
    setRule,
    checkRuleNameExists,
    getActiveRulesByUserID,
    deleteActiveRuleByID,
    updateActiveRuleStatusByID,
} from "../controllers/LeadAssignment.js";

const router= express.Router();

router.route("/setRule").post(setRule);
// router.route('/leads/:employeeID').get(getLeadsByEmployeeID);
router.get('/checkRuleNameExists', checkRuleNameExists);
router.get('/getActiveRulesByUserID/:userID', getActiveRulesByUserID);
router.delete('/deleteActiveRuleByID/:id', deleteActiveRuleByID);
router.put('/updateActiveRuleStatusByID/:id', updateActiveRuleStatusByID);

export default router;
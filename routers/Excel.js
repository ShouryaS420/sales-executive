import express from "express";
import {
    excelData,
    uploadSingleLeadData,
    getExcelData,
    getLeadsByTodayUploaded,
    getLeadsByYesterdayUploaded,
    deleteData,
    getExcelDataByID,
    getUnassignedLeads,
    getRealAssignedLead,
    assignLeads,
    logActivityOfLead,
    getLeadsByEmployeeWithNoResponseController,
    getLeadsByEmployeeWithNoResponseWithAttempt2Controller,
    fetchLeadsYesterday,
    fetchLeadsDayBeforeYesterday,
    fetchLeadsMoreThanTwoDays,
} from "../controllers/Excel.js";
import { isAuthenticated } from "../middleware/auth.js";

const router= express.Router();

router.route("/excelData").post(excelData);
router.route("/uploadSingleLeadData").post(uploadSingleLeadData);
router.route("/getExcelData/:userID").get(getExcelData);
router.route("/getLeadsByTodayUploaded/:userID").get(getLeadsByTodayUploaded);
router.route("/getLeadsByYesterdayUploaded/:userID").get(getLeadsByYesterdayUploaded);
router.route("/getExcelDataByID/:id").get(getExcelDataByID);
router.route("/deleteData").delete(deleteData);
router.route("/getUnassignedLeads").get(getUnassignedLeads);
router.route("/getRealAssignedLead/:employeeID").get(getRealAssignedLead);
router.route("/assign").post(assignLeads);
router.route("/logActivityOfLead").post(logActivityOfLead);
router.get('/getLeadsByEmployeeWithNoResponseController/:employeeID/rescheduled', getLeadsByEmployeeWithNoResponseController);
router.get('/getLeadsByEmployeeWithNoResponseWithAttempt2Controller/:employeeID/rescheduled', getLeadsByEmployeeWithNoResponseWithAttempt2Controller);
router.get('/fetch-leads-yesterday', fetchLeadsYesterday);
router.get('/fetch-leads-day-before-yesterday', fetchLeadsDayBeforeYesterday);
router.get('/fetch-leads-more-than-two-days', fetchLeadsMoreThanTwoDays);

export default router;
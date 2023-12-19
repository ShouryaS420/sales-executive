import express from "express";
import {
    excelData,
    uploadSingleLeadData,
    getExcelData,
    getLeadsByTodayUploaded,
    getLeadsByYesterdayUploaded,
} from "../controllers/Excel.js";
import { isAuthenticated } from "../middleware/auth.js";

const router= express.Router();

router.route("/excelData").post(excelData);
router.route("/uploadSingleLeadData").post(uploadSingleLeadData);
router.route("/getExcelData/:userID").get(getExcelData);
router.route("/getLeadsByTodayUploaded/:userID").get(getLeadsByTodayUploaded);
router.route("/getLeadsByYesterdayUploaded/:userID").get(getLeadsByYesterdayUploaded);

export default router;
import express from "express";
import {
    siteVisitForm,
} from "../controllers/SiteVisit.js";
import { isAuthenticated } from "../middleware/auth.js";

const router= express.Router();

router.route("/siteVisitForm").post(siteVisitForm);

export default router;
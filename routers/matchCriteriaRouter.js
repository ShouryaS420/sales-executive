import express from "express";
import {
    matchCriteria,
} from "../controllers/matchCriteriaController.js";

const router= express.Router();

router.route("/matchCriteria").post(matchCriteria);

export default router;
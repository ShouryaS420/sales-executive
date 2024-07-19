import express from "express";
import {
    getProjectsDeveloperById,
} from "../controllers/Developer.js";
import { isAuthenticated } from "../middleware/auth.js";

const router= express.Router();

router.route("/getProjectsDeveloperById/:builderID").get(getProjectsDeveloperById);

export default router;
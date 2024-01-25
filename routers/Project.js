import express from "express";
import {
    getProjects,
    getProjectsById,
    getProjectsDetailsInWakad,
    getProjectsDetailsByUpcoming,
    getProjectsDetailsByFeatured,
} from "../controllers/Project.js";
import { isAuthenticated } from "../middleware/auth.js";

const router= express.Router();

router.route("/getProjects").get(getProjects);
router.route("/getProjectsById/:id").get(getProjectsById);
router.route("/getProjectsDetailsInWakad").get(getProjectsDetailsInWakad);
router.route("/getProjectsDetailsByUpcoming").get(getProjectsDetailsByUpcoming);
router.route("/getProjectsDetailsByFeatured").get(getProjectsDetailsByFeatured);

export default router;
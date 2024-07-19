import express from "express";
import {
    createTeam,
    getTeams,
} from "../controllers/teamController.js";

const router = express.Router();

router.post("/createTeam", createTeam);
router.get("/getTeams/:boss", getTeams);

export default router;

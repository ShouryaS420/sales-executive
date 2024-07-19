import { app } from "./app.js";
import { config } from "dotenv";
import { connectDatabase } from "./config/database.js";
import { startScheduledJob, scheduleResetLeadLimitsJob } from './triggerLogic.js';
import scheduleCronJobs from './cronJobs.js';
import assignLead from "./ReAssignLeadAdmin.js";

config({
    path: "./config/config.env",
})

startScheduledJob();
scheduleResetLeadLimitsJob();
assignLead();
scheduleCronJobs();
connectDatabase();

app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT);
});
import cron from "node-cron";
import { Excel } from "./models/excel.js"; // Adjust the path as necessary

const assignLead = async () => {
    // Schedule the cron job to run every minute for testing purposes
    cron.schedule("*/2 * * * 4", async () => {
        console.log("Running Cron Job: Assign Leads on Thursday");
        const today = new Date();
        const dayOfWeek = today.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 4 = Thursday, ..., 6 = Saturday
        
        if (dayOfWeek !== 4) { // Check if today is not Thursday
            console.log("Today is not Thursday. Skipping lead assignment.");
            return;
        }
      
        try {
          // Find leads with exactly 2 attempts
            const leads = await Excel.find({ attempts: 2 });
            console.log(`Found ${leads.length} leads with 2 attempts`);
      
            // Loop through the leads and assign them
            for (const lead of leads) {
                const id = lead.userID;
                const currentTime = new Date();
                lead.assigned = true;
                lead.assignedTo = id; // Set this to the ID of the user you want to assign the lead to
                lead.assignedDate = new Date();
                lead.attempts = 0;
                const newLog = {
                    dateTime: currentTime,
                    logName: "Reassign Leads TO admin",
                    userName: "Reassign",
                    tag: "reAssign lead", 
                };
                // Append the new log entry to the activityLogs array
                lead.activityLogs = lead.activityLogs || []; // Initialize if not present
                lead.activityLogs.push(newLog); // Append the new log
                
                await lead.save();
                console.log(`Lead ${lead._id} assigned to Admin ${id}`);
            }
        } catch (error) {
          console.error("Error assigning leads: ", error);
        }
    });
};


// Export the cron job if you want to start it from another file
export default assignLead;

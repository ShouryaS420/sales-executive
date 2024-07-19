// cronJobs.js
import cron from 'node-cron';
import { Excel } from './models/excel.js'; // Adjust the import path according to your project structure

const scheduleCronJobs = () => {
    // Schedule a job to run every 1 minutes
    cron.schedule('*/1 * * * *', async () => {
        console.log('Cron job started: Checking for leads to reschedule');
        
        const now = new Date();
        try {
            const leadsToReschedule = await Excel.find({
                'activityLogs.status': 'busy-waiting',
                'activityLogs.dateTime': { $lte: now }
            });

            console.log(`Found ${leadsToReschedule.length} leads to reschedule`);

            for (const lead of leadsToReschedule) {
                const latestLog = lead.activityLogs[lead.activityLogs.length - 1];
                latestLog.status = 'rescheduled';
                // lead.assignedDate = now; // Optional: Update the assigned date if needed
                await lead.save();
                console.log(`Lead with ID ${lead._id} rescheduled`);
            }
        } catch (error) {
            console.error('Error during cron job execution:', error);
        }

        console.log('Cron job completed');
    });
    // Schedule a job to run every 1 minutes
    cron.schedule('*/1 * * * *', async () => {
        console.log('Cron job started: Checking for leads to reschedule');
        
        const now = new Date();
        try {
            const leadsToReschedule = await Excel.find({
                'activityLogs.status': 'no-response',
                'activityLogs.dateTime': { $lte: now }
            });

            console.log(`Found ${leadsToReschedule.length} leads to reschedule`);

            for (const lead of leadsToReschedule) {
                const latestLog = lead.activityLogs[lead.activityLogs.length - 1];
                latestLog.status = 'rescheduled';
                // lead.assignedDate = now; // Optional: Update the assigned date if needed
                await lead.save();
                console.log(`Lead with ID ${lead._id} rescheduled`);
            }
        } catch (error) {
            console.error('Error during cron job execution:', error);
        }

        console.log('Cron job completed');
    });

    console.log('Cron job scheduled: Check and reschedule leads every 1 minutes');
};

export default scheduleCronJobs;

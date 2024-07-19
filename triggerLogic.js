import cron from 'node-cron';
import { getUnassignedLeads } from './controllers/Excel.js';
import { getUsersWithRules } from './controllers/User.js';
import { matchCriteria, assignLeadsWithLimits } from './matchCriteriaController.js';
import { getActiveRules } from './controllers/LeadAssignment.js';
import { LeadAssignment } from './models/leadAssignment.js';

let interval = 5; // initial interval in minutes
const maxInterval = 60; // maximum interval in minutes
let isJobRunning = false;

const logLeadAssignment = (lead, teamMemberID) => {
  console.log(`Assigned lead ${lead._id} to ${teamMemberID} at ${new Date().toISOString()}`);
};

const logJobStart = () => {
  console.log(`Job started at ${new Date().toISOString()}`);
};

const logJobEnd = () => {
  console.log(`Job ended at ${new Date().toISOString()}`);
};

const calculateLeadsPerEmployeePerDay = (activeRules) => {
  const leadsPerEmployeePerDay = {};

  for (const rule of activeRules) {
    // Combine teamLeaders and salesExecutives
    const teamMembers = [...rule.teamLeaders];

    for (const member of teamMembers) {
      if (!leadsPerEmployeePerDay[member.userID]) {
        leadsPerEmployeePerDay[member.userID] = {
          limit: 0,
          remainingLimit: 0,
          lastAssigned: null
        };
      }
      // Sum the leadsPerDay from all applicable rules
      leadsPerEmployeePerDay[member.userID].limit += member.leadsPerDay;
      leadsPerEmployeePerDay[member.userID].remainingLimit += member.leadsPerDay;
    }
  }

  console.log('Calculated leads per employee per day:', leadsPerEmployeePerDay);
  return leadsPerEmployeePerDay;
};

// Function to reset lead limits at 7:00 AM every day
const resetLeadLimits = async () => {
  console.log("Resetting lead limits...");
  const rules = await LeadAssignment.find({ isActive: true });
  for (const rule of rules) {
    rule.teamLeaders.forEach(teamMember => {
      teamMember.leadsPerDay = teamMember.originalLeadsPerDay;
    });
    rule.lastReset = new Date(); // Update the last reset time
    await rule.save();
  }
  console.log("Lead limits reset completed.");
};

// Schedule reset lead limits job at 7:00 AM every day
export const scheduleResetLeadLimitsJob = () => {
  cron.schedule('0 7 * * *', async () => {
    await resetLeadLimits();
  });
};

export const  startScheduledJob = () => {
  const scheduleJob = () => {
    cron.schedule(`*/${interval} * * * *`, async () => {
      if (isJobRunning) {
        console.log('Previous job still running. Skipping this run.');
        return;
      }

      isJobRunning = true;
      logJobStart();

      try {
        const adminUsers = await getUsersWithRules();

        if (adminUsers.length === 0) {
          interval = Math.min(interval * 2, maxInterval); // backoff
          console.log(`No admin users found. Increasing interval to ${interval} minutes.`);
          isJobRunning = false;
          return;
        }

        let leadsFound = false;

        for (const admin of adminUsers) {
          const activeRules = await getActiveRules(admin._id);
          const unassignedLeads = await getUnassignedLeads(admin._id);
          const matchedLeads = await matchCriteria(activeRules, unassignedLeads);

          console.log(`Total matched leads available: ${matchedLeads.length}`);

          if (matchedLeads.length > 0) {
            leadsFound = true;
            const leadsPerEmployeePerDay = calculateLeadsPerEmployeePerDay(activeRules);
            await assignLeadsWithLimits(admin, matchedLeads, leadsPerEmployeePerDay);
          }
        }

        if (leadsFound) {
          interval = 5; // reset interval if leads are found
          console.log('Leads found and processed. Resetting interval to 5 minutes.');
        } else {
          interval = Math.min(interval * 2, maxInterval); // backoff
          console.log(`No leads found. Increasing interval to ${interval} minutes.`);
        }

        console.log('Trigger logic executed successfully.');
      } catch (error) {
        console.error('Error executing trigger logic:', error);
      }

      logJobEnd();
      isJobRunning = false;
    });
  };

  scheduleJob();
};

// Call this function to start the scheduled jobs
startScheduledJob();
scheduleResetLeadLimitsJob();

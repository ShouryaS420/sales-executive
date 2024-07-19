// leadUtils.js

// Import Lead model
import { Excel } from './models/excel.js';

// Function to get the count of matched leads
export const getMatchedLeadsCount = async () => {
    try {
        // Query the database for matched leads
        const matchedLeadsCount = await Excel.countDocuments();

        // Log the number of matched leads
        console.log('Number of matched leads:', matchedLeadsCount);

        return matchedLeadsCount;

    } catch (error) {
        console.error('Error fetching matched leads count:', error);
        throw error;
    }
};

// Function to check daily quotas for team leaders and sales executives
export const checkDailyQuotas = async (activeRules) => {
    try {
        for (const rule of activeRules) {
            console.log('Checking quotas for rule:', rule._id);

            // Check quotas for team leaders
            console.log('Team leader quotas:');
            for (const teamLeader of rule.teamLeaders) {
                const assignedCount = await Excel.countDocuments({ assignedTo: teamLeader.userID, date: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) } });
                console.log(`Team leader ${teamLeader.userID} has ${assignedCount} leads assigned out of ${teamLeader.leadsPerDay} quota.`);
            }

            // Check quotas for sales executives
            console.log('Sales executive quotas:');
            for (const salesExecutive of rule.salesExecutives) {
                const assignedCount = await Excel.countDocuments({ assignedTo: salesExecutive.userID, date: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) } });
                console.log(`Sales executive ${salesExecutive.userID} has ${assignedCount} leads assigned out of ${salesExecutive.leadsPerDay} quota.`);
            }
        }
    } catch (error) {
        console.error('Error checking daily quotas:', error);
    }
};
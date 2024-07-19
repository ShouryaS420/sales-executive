import { getUnassignedLeads } from './controllers/Excel.js'; // Function to query unassigned leads from the database
import { getActiveRules } from './controllers/LeadAssignment.js'; // Function to fetch active rules from the database
import { LeadAssignment } from './models/leadAssignment.js';
import { Excel } from './models/excel.js';

// Function to check if a lead matches the criteria defined in a rule
const leadMatchesCriteria = (lead, rule) => {
  // Mandatory fields
  if (rule.leadProject && lead.leadProject !== rule.leadProject) {
    return false;
  }
  if (rule.leadSource && lead.leadSource !== rule.leadSource) {
    return false;
  }

  // If all mandatory fields match and optional fields do not conflict, return true
  return true;
};

export const assignLeadsWithLimits = async (admin, matchedLeads, leadsPerEmployeePerDay) => {
  try {
    const eligibleTeamMembers = [...new Set(matchedLeads.flatMap(({ rule }) => [...rule.teamLeaders]))];
    const numEligibleTeamMembers = eligibleTeamMembers.length;

    if (numEligibleTeamMembers === 0) {
      console.log("No eligible team members found for any lead");
      return;
    }

    const assignedLeadsCount = {};
    const leadsAssigned = new Set();
    const currentTime = new Date();

    // Initialize assigned leads count
    for (const teamMember of eligibleTeamMembers) {
      assignedLeadsCount[teamMember.userID] = 0;
    }

    // Shuffle eligible team members for random assignment
    const shuffledTeamMembers = eligibleTeamMembers.sort(() => Math.random() - 0.5);
    let teamMemberIndex = 0; // Start with the first team member

    for (const { lead, rule } of matchedLeads) {
      if (leadsAssigned.has(lead._id.toString())) {
        continue;
      }

      let assigned = false;
      let attempts = 0; // To prevent infinite loop in case all limits are reached

      while (!assigned && attempts < numEligibleTeamMembers) {
        const teamMember = shuffledTeamMembers[teamMemberIndex];
        const teamMemberID = teamMember.userID;

        // Check if the team member's daily limit is reached
        if (leadsPerEmployeePerDay[teamMemberID].remainingLimit > 0 && assignedLeadsCount[teamMemberID] < leadsPerEmployeePerDay[teamMemberID].limit) {
          const leadDoc = await Excel.findById(lead._id);
          if (!leadDoc) {
            console.error(`Lead with ID ${lead._id} not found`);
            attempts++;
            teamMemberIndex = (teamMemberIndex + 1) % numEligibleTeamMembers;
            continue;
          }

          // Assign the lead to the team member
          leadDoc.assignedTo = teamMemberID;
          leadDoc.assigned = true;
          leadDoc.assignedDate = currentTime; // Update the assignedDate field
          const newLog = {
            dateTime: currentTime,
            logName: teamMemberID,
            userName: `by ${admin.fullName}`,
            tag: "automatically assign lead",
          };
          // Append the new log entry to the activityLogs array
          leadDoc.activityLogs = leadDoc.activityLogs || []; // Initialize if not present
          leadDoc.activityLogs.push(newLog); // Append the new log
          await leadDoc.save();

          // console.log('admin', admin);
          console.log(`Assigned lead ${leadDoc._id} to ${teamMemberID}`);

          // Update the assigned leads count
          leadsPerEmployeePerDay[teamMemberID].remainingLimit--;
          assignedLeadsCount[teamMemberID]++;
          leadsAssigned.add(lead._id.toString());

          // Update the rule's leadsPerDay for the team member
          const ruleDoc = await LeadAssignment.findById(rule._id);
          if (ruleDoc) {
            const teamMemberRule = ruleDoc.teamLeaders.concat(ruleDoc.salesExecutives).find(member => member.userID === teamMemberID);
            if (teamMemberRule) {
              teamMemberRule.leadsPerDay--;
              await ruleDoc.save();
              console.log(`Updated rule ${ruleDoc._id} for team member ${teamMemberID}`);
            }
          }

          assigned = true;
        } else {
          attempts++;
        }

        // Move to the next team member in round-robin fashion
        teamMemberIndex = (teamMemberIndex + 1) % numEligibleTeamMembers;
      }

      if (!assigned) {
        console.log(`Lead ${lead._id} could not be assigned to any team member`);
      }
    }
  } catch (error) {
    console.error("Error assigning leads with limits:", error);
  }
};

// Function to check if a lead matches the criteria defined in a rule
export const matchCriteria = async (activeRules, unassignedLeads) => {
    try {
      const matchedLeads = [];
      
      // Iterate over each unassigned lead
      for (const lead of unassignedLeads) {
        // Check if the lead matches any of the active rules
        for (const rule of activeRules) {
          if (leadMatchesCriteria(lead, rule)) {
            // Console log the lead
            // console.log('Matched lead:', lead);
            matchedLeads.push({ lead, rule });
            break; // Break out of loop once a lead is matched
          }
        }
      }
    
      return matchedLeads;
    } catch (error) {
      console.error("Error matching criteria:", error);
    }
};
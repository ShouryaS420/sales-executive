import { Excel } from "../models/excel.js";
import { Employee } from "../models/employee.js";
import { sendToken } from "../utils/sendToken.js";
import { sendMail } from "../utils/sendMail.js";
import mongoose from "mongoose";

export const excelData = async (req, res) => {
  try {
    const { userID, userName, name, email, mobile, leadProject, leadSource, leadType, activityLogs } = req.body;

    // Check if required fields are provided
    if (!userID || !userName || !name || !email || !mobile || !leadProject || !leadSource || !leadType || !activityLogs) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Initialize an array to hold the document objects
    const excelDocuments = [];

    if (Array.isArray(name) && Array.isArray(email) && Array.isArray(mobile)) {
      for (let i = 0; i < name.length; i++) {
        // Ensure that the arrays are of the same length
        if (!email[i] || !mobile[i]) {
          return res.status(400).json({ success: false, message: "Email and mobile arrays must match the length of the name array" });
        }

        excelDocuments.push({
          userID,
          userName,
          name: name[i],
          email: email[i],
          mobile: mobile[i],
          leadProject,
          leadSource,
          leadType,
          activityLogs: [
            {
              logName: activityLogs.logName,
              dateTime: new Date(activityLogs.dateTime),
              userName: activityLogs.userName,
              tag: activityLogs.tag,
            }
          ],
        });
      }
    } else {
      return res.status(400).json({ success: false, message: "Name, email, and mobile should be arrays" });
    }

    // Insert the documents into the database
    await Excel.insertMany(excelDocuments);

    // Send success response
    res.status(201).json({ success: true, message: "Excel data saved successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const uploadSingleLeadData = async (req, res) => {
  try {
      const {
        userID,
        userName,
        name,
        email,
        mobile,
        leadProject,
        leadSource,
        configuration,
        leadType,
        activityLogs
      } = req.body;
      await Excel.create({
        userID,
        userName,
        name,
        email,
        mobile,
        leadProject,
        leadSource,
        configuration,
        leadType,
        activityLogs: [
          {
            logName: activityLogs.logName,
            dateTime: new Date(activityLogs.dateTime),
            userName: activityLogs.userName,
            tag: activityLogs.tag,
          }
        ],
      });

      res.status(201).json({ success: true, message: "Excel data saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Function to fetch leads assigned to a specific employee by assignedTo with pagination
const getLeadsAssignedToEmployee = async (employeeID, status, page, limit) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const query = {
      assignedTo: employeeID,
      assigned: true,
      assignedDate: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
      attempts: 0,  // Filter leads where attempts is 0
      followUp: "false",  // Filter leads where attempts is 0
      siteVisit: "false",  // Filter leads where attempts is 0
    };

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { assignedDate: -1 }, // Adjust sorting field if needed
    };

    const assignedLeads = await Excel.paginate(query, options);

    return assignedLeads;

  } catch (error) {
    console.error(`Error fetching assigned leads for employee ${employeeID}:`, error.message);
  }
};
export const getRealAssignedLead = async (req, res) => {
  const { employeeID } = req.params;
  const { status, page = 1, limit = 20 } = req.query;

  try {
    const leads = await getLeadsAssignedToEmployee(employeeID, status, page, limit);
    res.status(200).json({
      success: true,
      data: leads.docs,
      totalDocs: leads.totalDocs,
      totalPages: leads.totalPages,
      page: leads.page,
      limit: leads.limit,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logActivityOfLead = async (req, res) => {
  const { leadId, logName, leadResponse, area, project, employeeNotes, dateTime, setdateTime, userName, tag, status, lastAttempted } = req.body;

  // Determine the sorting order (ascending or descending)
  const sortOrder = 'ascending'; // Change to 'descending' for descending order

  try {
    const lead = await Excel.findById(leadId);
    if (!lead) {
      return res.status(404).send('Lead not found');
    }

    // Find if there is any log with attempts === 1
    let existingLog = lead.activityLogs.find(log => log.attempts === 1);
    let setToFollowUp = lead.activityLogs.find(log => leadResponse === 'interested' || leadResponse === 'call-back-later');
    let setToSiteVisit = lead.activityLogs.find(log => leadResponse === 'Site Visit');
    // console.log('setToFollowUp', setToFollowUp);
    if (setToFollowUp) {
      lead.followUp = "true";
      console.log(lead.followUp);
      lead.activityLogs.push({
        area,
        project,
        logName,
        leadResponse,
        employeeNotes,
        dateTime,
        setdateTime,
        userName,
        tag,
        status,
        attempts: 0,
        lastAttempted
      });
    }
    if (setToSiteVisit) {
      lead.siteVisit = "true";
      console.log(lead.followUp);
      lead.activityLogs.push({
        area,
        project,
        logName,
        leadResponse,
        employeeNotes,
        dateTime,
        setdateTime,
        userName,
        tag,
        status,
        attempts: 0,
        lastAttempted
      });
    }

    if (leadResponse === 'not-reachable' || leadResponse === 'invalid-number' || leadResponse === 'not-interested' || leadResponse === 'already-purchased' || leadResponse === 'plan-postponed') {
      lead.attempts = 2;
      lead.activityLogs.push({
        area,
        project,
        logName,
        leadResponse,
        employeeNotes,
        dateTime,
        setdateTime,
        userName,
        tag,
        status,
        attempts: 2,
        lastAttempted
      });
    }
    if (leadResponse === 'no-response' || leadResponse === 'busy-waiting') {
      lead.attempts = 1;
      lead.activityLogs.push({
        area,
        project,
        logName,
        leadResponse,
        employeeNotes,
        dateTime,
        setdateTime,
        userName,
        tag,
        status,
        attempts: 1,
        lastAttempted
      });
    }
    if (existingLog) {
    //   // Update the attempts value to 2
      // lead.attempts = 2;
      if (leadResponse === 'no-response' || leadResponse === 'busy-waiting') {
        lead.attempts = 2;
        lead.activityLogs.push({
          area,
          project,
          logName,
          leadResponse,
          employeeNotes,
          dateTime,
          setdateTime,
          userName,
          tag,
          status,
          attempts: 2,
          lastAttempted
        });
      }
    }
    // else {
      // Add the new activity log with attempts set to 1
    // }

    // Sort the activity logs by dateTime
    lead.activityLogs.sort((a, b) => {
      if (sortOrder === 'ascending') {
        return new Date(a.dateTime) - new Date(b.dateTime);
      } else {
        return new Date(b.dateTime) - new Date(a.dateTime);
      }
    });

    // Save the updated lead
    await lead.save();

    res.status(200).send('Activity logged successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
};

export const getExcelData = async (req, res) => {
  try {
    const { userID } = req.params;
    const { startDate, endDate, projectName, leadSource, page = 1, limit = 20 } = req.query;

    const query = { userID };
    if (startDate && endDate) {
      query.uploadedDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (projectName) {
      query.leadProject = projectName;
    }
    if (leadSource) {
      query.leadSource = leadSource;
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { uploadedDate: -1 },
    };

    const result = await Excel.paginate(query, options);

    res.status(200).json({
      success: true,
      data: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getExcelDataByID = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Proceed with the query if the ID is valid
    const excelData = await Excel.findById(id);

    if (!excelData) {
      return res.status(404).json({ error: 'Data not found' });
    }

    res.json(excelData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getLeadsByTodayUploaded = async (req, res) => {
  try {
    const { userID } = req.params;
    // Get the current date and time
    const now = new Date();

    // Calculate the date and time 24 hours ago
    // const yesterday = new Date(now);
    // yesterday.setHours(now.getHours() - 24);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Query leads created in the last 24 hours
    const todaysLeads = await Excel.find({
      userID: userID,
      uploadedDate: { $gte: today },
    });

    if (!todaysLeads) {
      res
        .status(500)
        .json({ success: true, message: "today added leads not found" });
    }

    res.json(todaysLeads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLeadsByYesterdayUploaded = async (req, res) => {
  try {
    const { userID } = req.params;
    // Get the current date and time
    const now = new Date();

    // Calculate the date and time for yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // Calculate the date and time for today
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Query leads created between yesterday and today
    const yesterdayLeads = await Excel.find({
      userID: userID,
      uploadedDate: { $gte: yesterday, $lt: today },
    });

    res.json(yesterdayLeads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteData = async (req, res) => {
  try {
    // Delete all documents from the collection
    await Excel.deleteMany({});
    res.status(200).json({ message: "All data deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

export const getUnassignedLeads = async (userId) => {
  try {
    // Query unassigned leads from the database
    const unassignedLeads = await Excel.find({ assigned: "false", userID: userId });

    // console.log('Unassigned leads:', unassignedLeads); // For debugging
    return unassignedLeads;
  } catch (error) {
    console.error('Error fetching unassigned leads:', error);
    throw error;
  }
};

export const assignLeads = async (req, res) => {
  const { leadIds, teamMemberId, userName } = req.body;

  try {
    const leads = await Excel.find({ _id: { $in: leadIds } });

    if (leads.length !== leadIds.length) {
      return res.status(404).json({ error: 'One or more leads not found' });
    }
    const currentTime = new Date();
    const newLog = {
      dateTime: currentTime,
      logName: teamMemberId,
      userName: `by ${userName}`,
      tag: "manually assign lead",
    };

    for (let lead of leads) {
      lead.assignedTo = teamMemberId;
      lead.assigned = true;
      // lead.activityLogs = activityLogs;
      lead.activityLogs = lead.activityLogs || []; // Initialize if not present
      lead.activityLogs.push(newLog);
      lead.assignedDate = currentTime;
      await lead.save();
    }

    res.status(200).json({ success: true, message: 'Leads assigned successfully', leadIds, teamMemberId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Function to fetch leads by employee ID with the status "rescheduled" and pagination
const getLeadsByEmployeeWithNoResponse = async (employeeID, page, limit) => {
  try {
    const query = {
      assignedTo: employeeID,
      'activityLogs.status': 'rescheduled',
      attempts: 1,
    };

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { assignedDate: -1 } // Adjust sorting field if needed
    };

    const leads = await Excel.paginate(query, options);

    return leads;

  } catch (error) {
    console.error(`Error fetching leads with status "rescheduled" for employee ${employeeID}:`, error.message);
  }
};
export const getLeadsByEmployeeWithNoResponseController = async (req, res) => {
  const { employeeID } = req.params; // Get employeeID from URL parameters
  const { page = 1, limit = 20 } = req.query;

  try {
    const leads = await getLeadsByEmployeeWithNoResponse(employeeID, page, limit);
    res.status(200).json({
      success: true,
      data: leads.docs,
      totalDocs: leads.totalDocs,
      totalPages: leads.totalPages,
      page: leads.page,
      limit: leads.limit,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Function to fetch leads by employee ID with the status "rescheduled" and pagination
const getLeadsByEmployeeWithNoResponseWithAttempt2 = async (employeeID, page, limit) => {
  try {
    const query = {
      assignedTo: employeeID,
      'activityLogs.status': 'rescheduled',
      attempts: 2,
    };

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { assignedDate: -1 } // Adjust sorting field if needed
    };

    const leads = await Excel.paginate(query, options);

    // Update attempts value to 2 for fetched leads
    const leadIds = leads.docs.map(lead => lead._id);
    await Excel.updateMany(
      { _id: { $in: leadIds }, 'activityLogs.attempts': 2 },
      { $set: { 'activityLogs.$.attempts': 2 } }
    );

    return leads;

  } catch (error) {
    console.error(`Error fetching leads with status "rescheduled" for employee ${employeeID}:`, error.message);
    throw error; // Rethrow the error to handle it in the controller
  }
};
export const getLeadsByEmployeeWithNoResponseWithAttempt2Controller = async (req, res) => {
  const { employeeID } = req.params; // Get employeeID from URL parameters
  const { page = 1, limit = 20 } = req.query;

  try {
    const leads = await getLeadsByEmployeeWithNoResponseWithAttempt2(employeeID, page, limit);
    res.status(200).json({
      success: true,
      data: leads.docs,
      totalDocs: leads.totalDocs,
      totalPages: leads.totalPages,
      page: leads.page,
      limit: leads.limit,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateDateRanges = () => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);
  const startOfDayBeforeYesterday = new Date(startOfYesterday);
  startOfDayBeforeYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfThreeDaysAgo = new Date(startOfDayBeforeYesterday);
  startOfThreeDaysAgo.setDate(startOfDayBeforeYesterday.getDate() - 1);

  return {
    startOfToday,
    startOfYesterday,
    startOfDayBeforeYesterday,
    startOfThreeDaysAgo
  };
};
export const fetchLeadsYesterday = async (req, res) => {
  const { assignedTo } = req.query;
  const { startOfYesterday, startOfToday } = calculateDateRanges();

  try {
    const leads = await Excel.find({
      activityLogs: { $size: 2 },
      assignedTo,
      assignedDate: {
        $gte: startOfYesterday,
        $lt: startOfToday
      }
    });
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads", error });
  }
};
export const fetchLeadsDayBeforeYesterday = async (req, res) => {
  const { assignedTo } = req.query;
  const { startOfDayBeforeYesterday, startOfYesterday } = calculateDateRanges();

  try {
    const leads = await Excel.find({
      activityLogs: { $size: 2 },
      assignedTo,
      assignedDate: {
        $gte: startOfDayBeforeYesterday,
        $lt: startOfYesterday
      }
    });
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads", error });
  }
};
export const fetchLeadsMoreThanTwoDays = async (req, res) => {
  const { assignedTo } = req.query;
  const { startOfDayBeforeYesterday } = calculateDateRanges();

  try {
    const leads = await Excel.find({
      activityLogs: { $size: 2 },
      assignedTo,
      assignedDate: {
        $lt: startOfDayBeforeYesterday
      }
    });
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads", error });
  }
};
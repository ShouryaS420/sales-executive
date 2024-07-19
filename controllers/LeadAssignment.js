import { LeadAssignment } from "../models/leadAssignment.js";
import { User } from "../models/users.js";
import { Excel } from "../models/excel.js";
import { Lead } from "../models/lead.js";
import mongoose from "mongoose";

export const setRule = async (req, res) => {
  const {
    userID,
    ruleName,
    teamLeaders,
    leadProject,
    leadSource,
    configuration,
    locality,
    city,
    leadStatus,
    startDate,
    endDate,
    isActive,
  } = req.body;

  try {
    const leadAssignment = new LeadAssignment({
      userID,
      ruleName,
      teamLeaders: teamLeaders.map((tl) => ({
        userID: tl.userID,
        leadsPerDay: tl.leadsPerDay,
        originalLeadsPerDay: tl.originalLeadsPerDay,
      })),
      // salesExecutives: salesExecutives.map(se => ({
      //   userID: se.userID,
      //   leadsPerDay: se.leadsPerDay,
      //   originalLeadsPerDay: se.originalLeadsPerDay
      // })),
      leadProject,
      leadSource,
      configuration,
      locality,
      city,
      leadStatus,
      startDate,
      endDate,
      isActive,
    });

    await leadAssignment.save();
    res.status(201).send({ success: true, message: leadAssignment });
  } catch (error) {
    console.error("Error saving lead assignment:", error);
    res
      .status(500)
      .send({
        error: "Failed to save lead assignment",
        details: error.message,
      });
  }
};

export const checkRuleNameExists = async (req, res) => {
  const { ruleName } = req.query;

  if (!ruleName) {
    return res.status(400).json({ message: "ruleName is required" });
  }

  try {
    const rule = await LeadAssignment.findOne({ ruleName });

    if (rule) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getActiveRulesByUserID = async (req, res) => {
  try {
    const { userID } = req.params;

    // Query leads created in the last 24 hours
    const activeRules = await LeadAssignment.find({
      userID: userID,
      // isActive: true,
    });

    if (!activeRules) {
      res.status(500).json({ success: false, message: "Set Rule Not Found." });
    }

    res.json({ success: true, message: activeRules });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteActiveRuleByID = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await LeadAssignment.findByIdAndDelete(id);

    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }

    res.status(200).json({ message: "Rule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateActiveRuleStatusByID = async (req, res) => {
  try {

    const { id } = req.params;
    const { isActive } = req.body;

    const item = await LeadAssignment.findById(id);

    if (!item) {
      return res.status(404).send({ message: 'Item not found' });
    }

    item.isActive = isActive;
    await item.save();

    res.send({ message: 'Item updated successfully' });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Function to query active rules from the database for a specific user
export const getActiveRules = async (userId) => {
  try {
    // Query active rules from the database based on current date and user ID
    const currentDate = new Date();
    const activeRules = await LeadAssignment.find({
      userID: userId, // Filter by user ID
      startDate: { $lte: currentDate }, // Rule starts before or on the current date
      endDate: { $gte: currentDate }, // Rule ends after or on the current date
      isActive: true, // Rule is active
    });

    return activeRules;
  } catch (error) {
    console.error("Error fetching active rules:", error);
    throw error;
  }
};

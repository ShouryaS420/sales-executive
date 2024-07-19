import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const leadAssignmentSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  ruleName: {
    type: String,
    required: true,
  },
  teamLeaders: [{
    userID: {
      type: String,
      // required: true,
    },
    leadsPerDay: {
      type: Number,
      // required: true,
    },
    originalLeadsPerDay: {
      type: Number,
      // required: true,
    }
  }],
  // salesExecutives: [{
  //   userID: {
  //     type: String,
  //     // required: true,
  //   },
  //   leadsPerDay: {
  //     type: Number,
  //     // required: true,
  //   },
  //   originalLeadsPerDay: {
  //     type: Number,
  //     // required: true,
  //   }
  // }],
  leadProject: String,
  leadSource: String,
  configuration: String,
  locality: String,
  city: String,
  leadStatus: String,
  startDate: { type: Date, },
  endDate: { type: Date, },
  lastReset: { type: Date, },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

export const LeadAssignment = mongoose.model("assign-leads", leadAssignmentSchema);
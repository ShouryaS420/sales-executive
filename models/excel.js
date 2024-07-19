import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const activityLogSchema = new mongoose.Schema({
  area: Array,
  project: String,
  logName: String,
  leadResponse: String,
  employeeNotes: String,
  dateTime: Date,
  setdateTime: Date,
  userName: String,
  tag: String,
  status: { type: String, default: 'new' },
  attempts: { type: Number, default: 0 },
  lastAttempted: Date,
});

const excelSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  leadProject: {
    type: String,
  },
  leadSource: {
    type: String,
  },
  configuration: {
    type: String,
  },
  leadType: {
    type: String,
    default: "aaa",
  },
  assigned: {
    type: String,
    default: false,
  },
  followUp: {
    type: String,
    default: false,
  },
  followUpDate: { type: Date, default: Date.now },
  siteVisit: {
    type: String,
    default: false,
  },
  siteVisitDate: { type: Date, default: Date.now },
  assignedTo: {
    type: String,
    default: "assignedTo",
  },
  assignedDate: {
    type: Date,
    required: false
  },
  attempts: { type: Number, default: 0 },
  uploadedDate: { type: Date, default: Date.now },
  activityLogs: [activityLogSchema],
});

excelSchema.plugin(mongoosePaginate);

export const Excel = mongoose.model("Excel Data", excelSchema);

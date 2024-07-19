import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      clientName: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
      },
      leadProject: String,
      leadStatus: String,
      configuration: String,
      lookingFor: String,
      leadSource: String,
      leadType: String,
      assigned: {
        type: Boolean,
        default: false,
      },
      assignedTo: {
        type: String,
        default: null,
      },
      assignedDate: {
        type: Date,
        default: null,
      }
}, { timestamps: true });

export const Lead = mongoose.model('Lead', leadSchema);
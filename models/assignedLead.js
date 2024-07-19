// assignedLead.js
import mongoose from 'mongoose';

const assignedLeadSchema = new mongoose.Schema({
    leadID: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
    employeeID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    leadDetails: { type: Object }
});

export const AssignedLead = mongoose.model('lead-assign-employee', assignedLeadSchema);
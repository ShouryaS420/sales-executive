import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    mobile: { type: String, required: true },
    role: { type: String, enum: ['Sales Executive', 'Team Leader'], required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
}, { timestamps: true });

export const Employee = mongoose.model('Employee', employeeSchema);
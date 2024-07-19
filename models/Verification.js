// models/Verification.js
import mongoose from 'mongoose';

const VerificationSchema = new mongoose.Schema({
    email: { type: String },
    phoneNumber: { type: String },
    emailCode: { type: String },
    phoneCode: { type: String },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
});

export default mongoose.model('Verification', VerificationSchema);
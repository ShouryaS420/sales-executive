// models/checkIn.js
import mongoose from 'mongoose';

const checkInCheckOutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    records: [{
        date: { type: Date, required: true },
        checkIns: [{
            time: { type: Date },
            location: {
                latitude: { type: Number },
                longitude: { type: Number }
            },
            selfie: { type: String },
            address: { type: String }
        }],
        checkOuts: [{
            time: { type: Date },
            location: {
                latitude: { type: Number },
                longitude: { type: Number }
            },
            address: { type: String }
        }],
        status: {
            type: String,
            enum: ['checked-in', 'checked-out', 'missing-check-out'],
            default: 'checked-in'
        }
    }]
});

const CheckInCheckOut = mongoose.model('CheckInCheckOut', checkInCheckOutSchema);

export default CheckInCheckOut;

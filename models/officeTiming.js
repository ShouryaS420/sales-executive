import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  startTime: String,
  endTime: String,
});
const daySchema = new mongoose.Schema({
  dayIndex: { type: Number, required: true },
  timeSlots: [timeSlotSchema],
  off: { type: Boolean, default: true },
});
const officeTimingSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  timings: [daySchema],
});

const OfficeTimings = mongoose.model('OfficeTimings', officeTimingSchema);

export default OfficeTimings;



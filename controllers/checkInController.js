// controllers/checkInCheckOutController.js
import OfficeTimings from '../models/officeTiming.js';
import CheckInCheckOut from '../models/checkIn.js';

// Helper function to convert time to minutes since midnight
const timeToMinutes = (time) => {
  const [hours, minutes, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
  const totalMinutes = (parseInt(hours, 10) % 12) * 60 + parseInt(minutes, 10);
  return period === 'PM' ? totalMinutes + 12 * 60 : totalMinutes;
};

// Helper function to format time difference in hours and minutes
const formatTimeDifference = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ` : ''}${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
};

// Validate Check-In Time
export const validateCheckInTime = async (req, res) => {
  const { time, id } = req.body;
  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay();
  const currentTime = new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  try {
    const officeTiming = await OfficeTimings.findOne({ adminId: id });
    const dayTiming = officeTiming.timings.find(day => day.dayIndex === currentDayIndex);

    if (!dayTiming || dayTiming.off) {
      return res.status(400).json({ message: 'Office is closed today.' });
    }

    const startTime = dayTiming.timeSlots[0].startTime;
    const endTime = dayTiming.timeSlots[0].endTime;

    const checkInMinutes = timeToMinutes(currentTime);
    const officeStartMinutes = timeToMinutes(startTime);
    const officeEndMinutes = timeToMinutes(endTime);

    let status;
    let message = '';

    if (checkInMinutes < officeStartMinutes) {
      status = 'early';
      const difference = officeStartMinutes - checkInMinutes;
      message = `Checked in early by ${formatTimeDifference(difference)}.`;
    } else if (checkInMinutes === officeStartMinutes) {
      status = 'on time';
      message = 'Checked in on time.';
    } else if (checkInMinutes <= officeEndMinutes) {
      status = 'late';
      const difference = checkInMinutes - officeStartMinutes;
      message = `Checked in late by ${formatTimeDifference(difference)}.`;
    } else if (checkInMinutes === officeEndMinutes) {
      status = 'end time';
      message = 'Please check out.';
    } else {
      status = 'not valid';
      message = 'Check-in time is outside of office hours.';
    }

    res.status(200).json({ status, message });
  } catch (error) {
    console.error('Error validating check-in time:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Validate Check-Out Time
export const validateCheckoutTime = async (req, res) => {
  const { time, id } = req.body;
  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay();
  const currentTime = new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  try {
    const officeTiming = await OfficeTimings.findOne({ adminId: id });
    const dayTiming = officeTiming.timings.find(day => day.dayIndex === currentDayIndex);

    if (!dayTiming || dayTiming.off) {
      return res.status(400).json({ message: 'Office is closed today.' });
    }

    const endTime = dayTiming.timeSlots[0].endTime;

    const checkoutMinutes = timeToMinutes(currentTime);
    const officeEndMinutes = timeToMinutes(endTime);

    let status;
    let message = '';

    if (checkoutMinutes < officeEndMinutes) {
      status = 'early';
      const difference = officeEndMinutes - checkoutMinutes;
      message = `Checked out early by ${formatTimeDifference(difference)}.`;
    } else if (checkoutMinutes === officeEndMinutes) {
      status = 'on time';
      message = 'Checked out on time.';
    } else {
      status = 'late';
      const difference = checkoutMinutes - officeEndMinutes;
      message = `Checked out late by ${formatTimeDifference(difference)}.`;
    }

    res.status(200).json({ status, message });
  } catch (error) {
    console.error('Error validating checkout time:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Handle Check-In
export const checkIn = async (req, res) => {
  const { userId, time, location, selfie, address } = req.body;
  const currentDate = new Date();
  const currentDay = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

  try {
    let existingRecord = await CheckInCheckOut.findOne({ userId });

    if (existingRecord) {
      // Record exists, update check-in
      const record = existingRecord.records.find(record => record.date.toISOString().split('T')[0] === currentDay);

      if (record) {
        record.checkIns.push({ time, location, selfie, address });
        record.status = 'checked-in';
      } else {
        existingRecord.records.push({
          date: currentDate,
          checkIns: [{ time, location, selfie, address }],
          status: 'checked-in'
        });
      }

      await existingRecord.save();
    } else {
      // No record found, create new one
      const newRecord = new CheckInCheckOut({
        userId,
        records: [{
          date: currentDate,
          checkIns: [{ time, location, selfie, address }],
          status: 'checked-in'
        }]
      });
      await newRecord.save();
    }

    res.status(200).json({ message: 'Check-in successful' });
  } catch (error) {
    console.error('Error checking in:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Handle Check-Out
export const checkOut = async (req, res) => {
  const { userId, time, location, address } = req.body;
  const currentDate = new Date();
  const currentDay = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

  try {
    let existingRecord = await CheckInCheckOut.findOne({ userId });

    if (existingRecord) {
      // Record exists, update check-out
      const record = existingRecord.records.find(record => record.date.toISOString().split('T')[0] === currentDay);

      if (record) {
        record.checkOuts.push({ time, location, address });
        record.status = 'checked-out';
      } else {
        return res.status(400).json({ message: 'No check-in record found for today.' });
      }

      await existingRecord.save();
    } else {
      return res.status(400).json({ message: 'No check-in record found for today.' });
    }

    res.status(200).json({ message: 'Check-out successful' });
  } catch (error) {
      console.error('Error checking out:', error);
      res.status(500).json({ message: 'Server error', error });
  }
};

export const getCheckInOutDetailsById = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await CheckInCheckOut.findOne({ userId });

    res.status(200).send({ success: true, message: result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching post" });
  }
};
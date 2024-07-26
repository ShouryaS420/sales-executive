import OfficeTiming from '../models/officeTiming.js'

export const setOfficeTimings = async (req, res) => {
  const { adminId, timeSlots, dayIndex } = req.body;

  try {
    let officeTiming = await OfficeTiming.findOne({ adminId });

    if (officeTiming) {
      // Ensure dayIndex is within bounds of the array
      if (dayIndex >= 0 && dayIndex < officeTiming.timings.length) {
        // Update existing dayIndex
        officeTiming.timings[dayIndex] = { dayIndex, timeSlots };
      } else {
        // Add new days if the dayIndex is out of bounds
        while (officeTiming.timings.length <= dayIndex) {
          officeTiming.timings.push({ dayIndex: officeTiming.timings.length, timeSlots: [] });
        }
        officeTiming.timings[dayIndex] = { dayIndex, timeSlots };
      }
    } else {
      // Create a new OfficeTiming document with the given dayIndex
      const initialTimings = Array(7).fill(null).map((_, i) => ({ dayIndex: i, timeSlots: [] }));
      initialTimings[dayIndex] = { dayIndex, timeSlots };
      officeTiming = new OfficeTiming({ adminId, timings: initialTimings });
    }

    await officeTiming.save();
    res.status(200).json({ success: true, officeTiming });
  } catch (error) {
    console.error('Error setting office timings:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch office timings for an admin
export const getOfficeTimings = async (req, res) => {
  const { adminId } = req.params;

  try {
    const officeTiming = await OfficeTiming.findOne({ adminId });

    if (officeTiming) {
      res.status(200).json({ success: true, officeTiming });
    } else {
      res.status(404).json({ message: 'Office timings not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteTimeSlot = async (req, res) => {
  const { adminId, dayIndex } = req.body;

  try {
    // Find the document for the given adminId
    const officeTiming = await OfficeTiming.findOne({ adminId });

    if (!officeTiming) {
      return res.status(404).json({ message: 'Office timings not found for this admin.' });
    }

    // Find the day entry and filter out the time slots
    const updatedTimings = officeTiming.timings.map(day => {
      if (day.dayIndex === dayIndex) {
        // If matching dayIndex, clear the time slots
        return { ...day, timeSlots: [] };
      }
      return day;
    });

    // Update the document
    officeTiming.timings = updatedTimings;
    await officeTiming.save();

    res.status(200).json({ message: 'Time slots deleted successfully.' });
  } catch (error) {
    console.error('Error deleting time slots:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update the switch state for a specific day
export const updateSwitchState = async (req, res) => {
  const { adminId, dayIndex, off } = req.body;

  console.log('dayIndex', dayIndex);
  console.log('off', off);

  try {
    const officeTiming = await OfficeTiming.findOne({ adminId });

    if (!officeTiming) {
      return res.status(404).json({ message: 'Office timings not found' });
    }
    console.log(officeTiming.timings.length);

    if (dayIndex >= 0 && dayIndex < officeTiming.timings.length) {
      officeTiming.timings[dayIndex].off = off;
      await officeTiming.save();
      res.status(200).json({ success: true, officeTiming });
    } else {
      res.status(400).json({ message: 'Invalid day index' });
      console.log('Invalid day index');
    }
  } catch (error) {
    console.error('Error updating switch state:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
import express from 'express';
import { User } from '../models/users.js';

const router = express.Router();

router.delete('/deleteUsers/:id', async (req, res) => {
  try {
    // find the note to be delete and delete it
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('Not Found');
    }

    user = await User.findByIdAndDelete(req.params.id);
    res.json({ Success: 'Note has been deleted', user: user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/updateProjectsPublish/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    // Update the user's password
    const updatedProject = await User.findByIdAndUpdate(
      id,
      {
        verified: verified,
      },
      { new: true },
    );

    res.status(200).json({ success: true, message: `Project Details updated successfully`, result: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/fetchUnVerifiedUsersDetails', async (req, res) => {
  try {
    const user = await User.find({ verified: false });

    res.status(200).json({ success: true, message: user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/fetchUnVerifiedUsersCount', async (req, res) => {
  try {
    // Count comments that belong to the specified video
    const newlyAddedUserCount = await User.countDocuments({ verified: false });

    res.status(200).json({ newlyAddedUserCount });
  } catch (error) {
    res.status(500).json({ error: 'Error counting comments', details: error.message });
  }
});

router.get('/fetchVerifiedUsersDetails', async (req, res) => {
  try {
    const user = await User.find({ verified: true });

    res.status(200).json({ success: true, message: user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/fetchVerifiedUsersCount', async (req, res) => {
  try {
    // Count comments that belong to the specified video
    const newlyAddedUserCount = await User.countDocuments({ verified: true });

    res.status(200).json({ newlyAddedUserCount });
  } catch (error) {
    res.status(500).json({ error: 'Error counting comments', details: error.message });
  }
});

export default router;

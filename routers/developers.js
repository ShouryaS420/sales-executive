import express from 'express';
import { body, validationResult } from 'express-validator';
import Developer from '../models/Developer.js';

const router = express.Router();

router.get('/fetchAllDeveloperDetails', async (req, res) => {
  try {
    const developer = await Developer.find({ Developer: req.id });
    res.status(200).json({ success: true, message: developer });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.post(
  '/addDeveloperDetails',
  [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('pic', 'Please Select an Image'),
    body('desc', 'Enter a valid Description must be at least 5 character').isLength({ min: 5 }),
    body('estIn', 'Enter a valid estIn must be at least 5 character').isLength({ min: 5 }),
    body('totalProject', 'Enter a valid totalProject must be at least 5 character').isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, pic, desc, estIn, totalProject } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const developer = new Developer({
        title,
        pic,
        desc,
        estIn,
        totalProject,
      });

      const saveDeveloperDetails = await developer.save();
      res.json(saveDeveloperDetails);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

router.delete('/deleteDeveloper/:id', async (req, res) => {
  try {
    // find the note to be delete and delete it
    let project = await Developer.findById(req.params.id);
    if (!project) {
      return res.status(404).send('Not Found');
    }

    project = await Developer.findByIdAndDelete(req.params.id);
    res.json({ Success: 'Note has been deleted', project: project });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

export default router;

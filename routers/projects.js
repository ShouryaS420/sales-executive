import express from 'express';
import { body, validationResult } from 'express-validator';
import { Project } from "../models/projects.js";

const router = express.Router();

router.post(
  '/addProjectsDetails',
  [
    body('city', 'Enter a valid city'),
    body('locality', 'Enter a valid locality'),
    body('builderName', 'Please Select a builderName'),
    body('projectName', 'Enter a valid Project Name'),
    body('startingPrice', 'Please Select a location Embed'),
    body('EndingPrice', 'Please Select an Image'),
    body('bhk', 'Please Select an Image'),
    body('projectCardImage', 'select developerID'),
    body('projectDetailImage', 'select developerID'),
    body('landParcel', 'Enter a valid Land Parcel'),
    body('sizes', 'Enter a valid sizes'),
    body('noOfTowers', 'Enter a valid No.Of Tower'),
    body('totalUnits', 'Enter a valid No.Of Total Units'),
    body('rera', 'Enter a valid rera ID'),
    body('launchDate', 'Please Select a Launch Date'),
    body('possessionDate', 'Please Select a Possession Date'),
    body('floorPlan', 'select developerID'),
    body('amenities', 'select developerID'),
    body('soldOut', 'select developerID'),
    body('publish', 'select developerID'),
  ],
  async (req, res) => {
    try {
      const { builderID, city, locality, builderName, projectName, startingPrice, EndingPrice, bhk, projectCardImage, projectDetailImage, landParcel, sizes, noOfTowers, totalUnits, rera, launchDate, possessionDate, floorPlan, amenities, soldOut, publish, newlyAdded } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: 'field must be required' });
      }

      const project = new Project({
        builderID,
        city,
        locality,
        builderName,
        projectName,
        startingPrice,
        EndingPrice,
        bhk,
        projectCardImage,
        projectDetailImage,
        landParcel,
        sizes,
        noOfTowers,
        totalUnits,
        rera,
        launchDate,
        possessionDate,
        floorPlan,
        amenities,
        soldOut: false,
        publish: false,
        newlyAdded: true,
      });

      const saveProjectsDetails = await project.save();
      res.json(saveProjectsDetails);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }
);

router.delete('/deleteProjects/:id', async (req, res) => {
  try {
    // find the note to be delete and delete it
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).send('Not Found');
    }

    project = await Project.findByIdAndDelete(req.params.id);
    res.json({ Success: 'Note has been deleted', project: project });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/editProjects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { builderID, city, locality, builderName, projectName, rera, landParcel, noOfTowers, totalUnits, possessionDate, launchDate, startingPrice, EndingPrice, bhk, projectCardImage, projectDetailImage, soldOut } = req.body;

    // Update the user's password
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        builderID: builderID,
        city: city,
        locality: locality,
        builderName: builderName,
        projectName: projectName,
        rera: rera,
        landParcel: landParcel,
        noOfTowers: noOfTowers,
        totalUnits: totalUnits,
        possessionDate: possessionDate,
        launchDate: launchDate,
        startingPrice: startingPrice,
        EndingPrice: EndingPrice,
        bhk: bhk,
        projectCardImage: projectCardImage,
        projectDetailImage: projectDetailImage,
        soldOut: soldOut,
      },
      { new: true },
    );

    res.status(200).json({ success: true, message: `Project Details updated successfully`, result: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/updateProjectsPublish/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { publish, newlyAdded } = req.body;

    // Update the user's password
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        publish: publish,
        newlyAdded: newlyAdded,
      },
      { new: true },
    );

    res.status(200).json({ success: true, message: `Project Details updated successfully`, result: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/getProjectsDetails/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Project.findById(id);
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching post' });
  }
});

router.get('/fetchAllProjectDetails', async (req, res) => {
  try {
    const projects = await Project.find({ newlyAdded: true });
    res.status(200).json({ success: true, message: projects });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/fetchAllProjectCount/:newlyAdded', async (req, res) => {
  try {
    const { newlyAdded } = req.params;

    // Count comments that belong to the specified video
    const newlyAddedProjectCount = await Project.countDocuments({ newlyAdded: newlyAdded });

    res.status(200).json({ newlyAddedProjectCount });
  } catch (error) {
    res.status(500).json({ error: 'Error counting comments', details: error.message });
  }
});

router.get('/fetchUnPublishedProjectDetails', async (req, res) => {
  try {
    const projects = await Project.find({ publish: false });
    res.status(200).json({ success: true, message: projects });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/fetchUnPublishedProjectCount', async (req, res) => {
  try {
    // Count comments that belong to the specified video
    const newlyAddedProjectCount = await Project.countDocuments({ publish: false });

    res.status(200).json({ newlyAddedProjectCount });
  } catch (error) {
    res.status(500).json({ error: 'Error counting comments', details: error.message });
  }
});

router.get('/fetchPublishedProjectDetails', async (req, res) => {
  try {
    const projects = await Project.find({ publish: true });
    res.status(200).json({ success: true, message: projects });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/fetchPublishedProjectCount', async (req, res) => {
  try {
    // Count comments that belong to the specified video
    const newlyAddedProjectCount = await Project.countDocuments({ publish: true });

    res.status(200).json({ newlyAddedProjectCount });
  } catch (error) {
    res.status(500).json({ error: 'Error counting comments', details: error.message });
  }
});

router.put('/updateProjectsUpcoming/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { upcoming } = req.body;

    // Update the user's password
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        upcoming: upcoming,
      },
      { new: true },
    );

    res.status(200).json({ success: true, message: `Project Details updated successfully`, result: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/updateProjectsFeatured/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    // Update the user's password
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        featured: featured,
      },
      { new: true },
    );

    res.status(200).json({ success: true, message: `Project Details updated successfully`, result: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

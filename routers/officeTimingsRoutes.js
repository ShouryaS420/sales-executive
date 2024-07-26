import express from 'express';
import { setOfficeTimings, getOfficeTimings, deleteTimeSlot, updateSwitchState } from '../controllers/officeTimingsController.js';

const router = express.Router();

router.post('/setOfficeTimings', setOfficeTimings);
router.get('/getOfficeTimings/:adminId', getOfficeTimings);
router.post('/deleteTimeSlot', deleteTimeSlot);
router.post('/updateSwitchState', updateSwitchState);

export default router;

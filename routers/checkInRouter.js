// routes/checkInCheckOutRouter.js
import express from 'express';
import { checkIn, checkOut, validateCheckInTime, validateCheckoutTime, getCheckInOutDetailsById } from '../controllers/checkInController.js';

const router = express.Router();

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.post('/validateCheckInTime', validateCheckInTime);
router.post('/validateCheckoutTime', validateCheckoutTime);
router.get('/getCheckInOutDetailsById/:userId', getCheckInOutDetailsById);

export default router;

import express from 'express';
import { allSeatsBookingStatus, bookSeatsFn, initializeSeatsFn, resetAllBookings } from './Controller/booking.controller.js';
import { authenticateToken } from './Middleware/auth.js';
const router = express.Router();

router.post('/initializeSeats', initializeSeatsFn);
router.get('/allSeatsBookingStatus', allSeatsBookingStatus);
router.post('/bookSeats', authenticateToken, bookSeatsFn);
router.post('/resetAllBookings', resetAllBookings);

export default router;
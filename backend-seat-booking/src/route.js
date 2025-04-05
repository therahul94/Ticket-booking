import express from 'express';
import user from './user.js';
import booking from './booking.js';
const router = express.Router();

router.use('/user', user)
router.use('/booking', booking)

export default router;
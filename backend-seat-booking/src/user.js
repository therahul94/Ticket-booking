import express from 'express';
import { loginUser, registerUser } from './Controller/user.controller.js';
const router = express.Router();

router.post('/registeruser', registerUser);
router.post('/loginUser', loginUser);

export default router;
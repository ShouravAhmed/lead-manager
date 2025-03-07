import { Router } from 'express';
import { sendOTP, register, login } from '../controllers/authControllers.js';

const router = Router();

router.post('/send-otp', sendOTP);
router.post('/register', register);
router.post('/login', login);

export default router;    
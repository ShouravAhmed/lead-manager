import { Router } from 'express';
import { sendOTP, register, login, resetPassword, logout, refreshToken, getUser } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/send-otp', sendOTP);
router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/logout', verifyToken, logout);
router.post('/refresh-token', refreshToken);
router.get('/user', verifyToken, getUser);


export default router;    
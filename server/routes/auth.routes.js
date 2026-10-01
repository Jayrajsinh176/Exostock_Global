import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  logoutUser,
  refreshAccessToken,
  sendVerificationEmail,
  verifyEmail,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshAccessToken);
router.post('/send-verification-email', sendVerificationEmail);
router.get('/verify-email', verifyEmail);
router.post('/verify-email', verifyEmail);
router.post('/change-password', protect, changePassword);
router.post('/logout', protect, logoutUser);

export default router;

import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateStyleProfile,
  uploadProfilePhoto,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getUserProfile);
router.put('/profile', protect, updateStyleProfile);
router.post('/profile-photo', protect, upload.single('profilePhoto'), uploadProfilePhoto);

export default router;

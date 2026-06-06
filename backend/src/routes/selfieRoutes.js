import express from 'express';
import { uploadAndAnalyzeSelfie } from '../controllers/selfieController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/analyze', protect, upload.single('selfie'), uploadAndAnalyzeSelfie);

export default router;

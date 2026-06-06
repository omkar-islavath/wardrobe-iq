import express from 'express';
import { getWardrobeGapAnalysis, getShoppingRecommendations } from '../controllers/shoppingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/gap-analysis', protect, getWardrobeGapAnalysis);
router.post('/suggest', protect, getShoppingRecommendations);

export default router;

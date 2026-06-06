import express from 'express';
import {
  generateOutfits,
  saveOutfit,
  markOutfitAsWorn,
  getOutfitHistory,
  getOutfitCalendar,
  toggleFavoriteOutfit,
  deleteOutfit,
} from '../controllers/outfitController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, generateOutfits);
router.post('/save', protect, saveOutfit);
router.post('/:id/wear', protect, markOutfitAsWorn);
router.get('/history', protect, getOutfitHistory);
router.get('/calendar', protect, getOutfitCalendar);
router.put('/:id/favorite', protect, toggleFavoriteOutfit);
router.delete('/:id', protect, deleteOutfit);

export default router;

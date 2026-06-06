import express from 'express';
import {
  uploadClothingItem,
  getClothingItems,
  getSingleItem,
  updateClothingItem,
  deleteClothingItem,
} from '../controllers/wardrobeController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', protect, upload.single('image'), uploadClothingItem);
router.get('/', protect, getClothingItems);
router.get('/:id', protect, getSingleItem);
router.put('/:id', protect, updateClothingItem);
router.delete('/:id', protect, deleteClothingItem);

export default router;

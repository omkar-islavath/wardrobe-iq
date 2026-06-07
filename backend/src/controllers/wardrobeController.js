import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { Op } from 'sequelize';
import { sequelize } from '../config/db.js';
import WardrobeItem from '../models/WardrobeItem.js';
import { analyzeClothingImage } from '../services/aiService.js';

/**
 * @desc    Upload new clothing item & analyze with AI
 * @route   POST /api/wardrobe/upload
 * @access  Private
 */
export const uploadClothingItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a clothing image' });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    // 1. Upload to Cloudinary if available
    let imageUrl = '';
    if (process.env.CLOUDINARY_URL) {
      try {
        const url = process.env.CLOUDINARY_URL;
        const matches = url.match(/cloudinary:\/\/([^:]+):([^@]+)@([^?#]+)/);
        if (matches) {
          cloudinary.config({
            api_key: matches[1],
            api_secret: matches[2],
            cloud_name: matches[3],
            secure: true
          });
        }
        
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: 'wardrobe_iq',
        });
        imageUrl = uploadResult.secure_url;
      } catch (cloudinaryErr) {
        console.error("Cloudinary upload failed, falling back to local storage:", cloudinaryErr.message);
        imageUrl = `/uploads/${req.file.filename}`;
      }
    } else {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // 2. Perform AI Analysis (Gemini Vision or mock fallback)
    let analysisResult;
    try {
      analysisResult = await analyzeClothingImage(filePath, mimeType, req.user.gender);
    } catch (aiErr) {
      console.error("AI Analysis failed:", aiErr.message);
      analysisResult = {
        category: 'shirt',
        color: 'grey',
        secondaryColor: '',
        pattern: 'solid',
        style: 'casual',
        season: 'all',
        brand: '',
        tags: ['uploaded']
      };
    }

    // Ensure local temp file is removed
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 3. Create wardrobe item in database
    const wardrobeItem = await WardrobeItem.create({
      userId: req.user.id,
      category: analysisResult.category || 'shirt',
      color: analysisResult.color || 'black',
      secondaryColor: analysisResult.secondaryColor || '',
      pattern: analysisResult.pattern || 'solid',
      style: analysisResult.style || 'casual',
      season: analysisResult.season || 'all',
      imageUrl: imageUrl,
      brand: analysisResult.brand || '',
      tags: analysisResult.tags || [],
    });

    res.status(201).json({
      success: true,
      message: 'Item uploaded and analyzed successfully',
      item: {
        ...wardrobeItem.toJSON(),
        _id: wardrobeItem.id // preserve _id for frontend compatibility
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get all clothing items for user (with filtering and search)
 * @route   GET /api/wardrobe
 * @access  Private
 */
export const getClothingItems = async (req, res) => {
  try {
    const where = { userId: req.user.id };

    // Filtering by Category
    if (req.query.category) {
      where.category = req.query.category.toLowerCase();
    }

    // Filtering by Color
    if (req.query.color) {
      where.color = req.query.color.toLowerCase();
    }

    // Filtering by Style
    if (req.query.style) {
      where.style = req.query.style.toLowerCase();
    }

    // Filtering by Season
    if (req.query.season) {
      where.season = req.query.season.toLowerCase();
    }

    // Filtering by Brand
    if (req.query.brand) {
      where.brand = { [Op.iLike]: req.query.brand };
    }

    // Search query (matches tags or brand or pattern in Postgres)
    if (req.query.search) {
      const search = req.query.search;
      
      // We search via brand, pattern, or tags array (casting JSONB tags array to text search)
      where[Op.or] = [
        { brand: { [Op.iLike]: `%${search}%` } },
        { pattern: { [Op.iLike]: `%${search}%` } },
        sequelize.literal(`"tags"::text ILIKE '%${search}%'`)
      ];
    }

    const items = await WardrobeItem.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    // Map output to preserve MongoDB _id field name for frontend compatibility
    const mappedItems = items.map(item => ({
      ...item.toJSON(),
      _id: item.id
    }));

    res.json({
      success: true,
      count: mappedItems.length,
      items: mappedItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get single clothing item
 * @route   GET /api/wardrobe/:id
 * @access  Private
 */
export const getSingleItem = async (req, res) => {
  try {
    const item = await WardrobeItem.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Clothing item not found' });
    }

    res.json({
      success: true,
      item: {
        ...item.toJSON(),
        _id: item.id
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update clothing item details (AI Prediction correction)
 * @route   PUT /api/wardrobe/:id
 * @access  Private
 */
export const updateClothingItem = async (req, res) => {
  try {
    let item = await WardrobeItem.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Clothing item not found' });
    }

    // Update fields
    const fieldsToUpdate = [
      'category',
      'color',
      'secondaryColor',
      'pattern',
      'style',
      'season',
      'brand',
      'tags',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    const updatedItem = await item.save();

    res.json({
      success: true,
      message: 'Garment updated successfully',
      item: {
        ...updatedItem.toJSON(),
        _id: updatedItem.id
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete clothing item
 * @route   DELETE /api/wardrobe/:id
 * @access  Private
 */
export const deleteClothingItem = async (req, res) => {
  try {
    const item = await WardrobeItem.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!item) {
      return res.status(404).json({ success: false, error: 'Clothing item not found' });
    }

    // Delete item image if it's local
    if (item.imageUrl.startsWith('/uploads/')) {
      const filePath = `.${item.imageUrl}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await item.destroy();

    res.json({
      success: true,
      message: 'Clothing item removed from wardrobe',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

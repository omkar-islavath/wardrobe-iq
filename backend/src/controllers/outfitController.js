import { Op } from 'sequelize';
import OutfitHistory from '../models/OutfitHistory.js';
import WardrobeItem from '../models/WardrobeItem.js';
import { getWeather } from '../services/weatherService.js';
import { generateOutfitRecommendations } from '../services/RecommendationEngine.js';

const simulatedEssentials = {
  'simulated-top': {
    id: 'simulated-top',
    _id: 'simulated-top',
    category: 'shirt',
    color: 'white',
    style: 'casual',
    season: 'all',
    pattern: 'solid',
    brand: 'Stylist Essential',
    tags: ['essential', 'simulated'],
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
    isSimulated: true
  },
  'simulated-bottom': {
    id: 'simulated-bottom',
    _id: 'simulated-bottom',
    category: 'jeans',
    color: 'black',
    style: 'casual',
    season: 'all',
    pattern: 'solid',
    brand: 'Stylist Essential',
    tags: ['essential', 'simulated'],
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80',
    isSimulated: true
  },
  'simulated-shoes': {
    id: 'simulated-shoes',
    _id: 'simulated-shoes',
    category: 'shoes',
    color: 'white',
    style: 'casual',
    season: 'all',
    pattern: 'solid',
    brand: 'Stylist Essential',
    tags: ['essential', 'simulated'],
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80',
    isSimulated: true
  }
};

const populateOutfitItems = async (outfit) => {
  const outfitItems = outfit.outfitItems || [];
  const actualIds = [];
  const simulatedIds = [];

  outfitItems.forEach(id => {
    const parsed = parseInt(id);
    if (!isNaN(parsed) && String(parsed) === String(id)) {
      actualIds.push(parsed);
    } else {
      simulatedIds.push(String(id));
    }
  });

  let dbItems = [];
  if (actualIds.length > 0) {
    dbItems = await WardrobeItem.findAll({
      where: { id: actualIds }
    });
  }

  const dbItemsMap = {};
  dbItems.forEach(item => {
    dbItemsMap[String(item.id)] = {
      ...item.toJSON(),
      _id: item.id
    };
  });

  const populated = outfitItems.map(id => {
    const idStr = String(id);
    if (simulatedEssentials[idStr]) {
      return simulatedEssentials[idStr];
    }
    return dbItemsMap[idStr] || {
      _id: idStr,
      id: idStr,
      category: 'garment',
      color: 'neutral',
      style: 'casual',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&q=80',
      brand: 'Generic',
      tags: ['essential']
    };
  });

  return {
    ...outfit.toJSON(),
    _id: outfit.id,
    outfitItems: populated
  };
};

/**
 * @desc    Generate outfit recommendations based on occasion, weather, history, style profile
 * @route   POST /api/outfits/generate
 * @access  Private
 */
export const generateOutfits = async (req, res) => {
  const { occasion, lat, lon, city } = req.body;

  if (!occasion) {
    return res.status(400).json({ success: false, error: 'Please specify an occasion' });
  }

  try {
    // 1. Fetch user's weather conditions
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
    const weather = await getWeather(lat, lon, city, clientIp);

    // 2. Fetch all user wardrobe items using Sequelize ordered by ID
    const wardrobeItems = await WardrobeItem.findAll({
      where: { userId: req.user.id },
      order: [['id', 'ASC']]
    });

    if (wardrobeItems.length === 0) {
      return res.status(200).json({
        success: true,
        weather,
        message: 'Your wardrobe is empty. Upload some clothes first!',
        recommendations: []
      });
    }

    // 3. Generate recommendations
    const recommendations = await generateOutfitRecommendations(req.user, wardrobeItems, occasion, weather);

    res.json({
      success: true,
      weather,
      recommendations,
    });
  } catch (error) {
    console.error("Error generating outfits:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Save a generated outfit combination
 * @route   POST /api/outfits/save
 * @access  Private
 */
export const saveOutfit = async (req, res) => {
  const { outfitItems, occasion, score, scoreBreakdown } = req.body;

  if (!outfitItems || outfitItems.length === 0 || !occasion || score === undefined) {
    return res.status(400).json({ success: false, error: 'Please provide outfit items, occasion, and score' });
  }

  try {
    const outfit = await OutfitHistory.create({
      userId: req.user.id,
      outfitItems, // saves array of integer/string IDs into JSONB
      occasion,
      score,
      scoreBreakdown,
      dateGenerated: new Date(),
    });

    // Manually populate wardrobe items details using robust population helper
    const populatedOutfit = await populateOutfitItems(outfit);

    res.status(201).json({
      success: true,
      message: 'Outfit saved successfully',
      outfit: populatedOutfit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Mark outfit as worn today or on a specific date
 * @route   POST /api/outfits/:id/wear
 * @access  Private
 */
export const markOutfitAsWorn = async (req, res) => {
  const { dateWorn } = req.body;

  try {
    let outfit = await OutfitHistory.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!outfit) {
      return res.status(404).json({ success: false, error: 'Outfit not found in history' });
    }

    outfit.dateWorn = dateWorn ? new Date(dateWorn) : new Date();
    await outfit.save();

    // Populate items using robust population helper
    const populatedOutfit = await populateOutfitItems(outfit);

    res.json({
      success: true,
      message: 'Outfit logged as worn',
      outfit: populatedOutfit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get outfit logs and history (saved or worn)
 * @route   GET /api/outfits/history
 * @access  Private
 */
export const getOutfitHistory = async (req, res) => {
  try {
    const history = await OutfitHistory.findAll({
      where: { userId: req.user.id },
      order: [['dateGenerated', 'DESC']]
    });

    // Populate each history item manually using robust population helper
    const populatedHistory = await Promise.all(
      history.map(outfit => populateOutfitItems(outfit))
    );

    res.json({
      success: true,
      count: populatedHistory.length,
      history: populatedHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get worn outfit calendar events
 * @route   GET /api/outfits/calendar
 * @access  Private
 */
export const getOutfitCalendar = async (req, res) => {
  try {
    const calendarOutfits = await OutfitHistory.findAll({
      where: {
        userId: req.user.id,
        dateWorn: { [Op.ne]: null }
      },
      order: [['dateWorn', 'DESC']]
    });

    // Populate items using robust population helper
    const populatedCalendar = await Promise.all(
      calendarOutfits.map(outfit => populateOutfitItems(outfit))
    );

    res.json({
      success: true,
      count: populatedCalendar.length,
      calendar: populatedCalendar,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Toggle favorite status on saved outfit
 * @route   PUT /api/outfits/:id/favorite
 * @access  Private
 */
export const toggleFavoriteOutfit = async (req, res) => {
  try {
    let outfit = await OutfitHistory.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!outfit) {
      return res.status(404).json({ success: false, error: 'Outfit not found' });
    }

    outfit.isFavorite = !outfit.isFavorite;
    await outfit.save();

    res.json({
      success: true,
      message: `Outfit ${outfit.isFavorite ? 'added to' : 'removed from'} favorites`,
      isFavorite: outfit.isFavorite,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete outfit from history
 * @route   DELETE /api/outfits/:id
 * @access  Private
 */
export const deleteOutfit = async (req, res) => {
  try {
    const outfit = await OutfitHistory.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!outfit) {
      return res.status(404).json({ success: false, error: 'Outfit not found' });
    }

    await outfit.destroy();

    res.json({
      success: true,
      message: 'Outfit removed from history',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

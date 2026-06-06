import WardrobeItem from '../models/WardrobeItem.js';
import { runWardrobeGapAnalysis, getShoppingSuggestions } from '../services/aiService.js';

/**
 * @desc    Analyze wardrobe gaps and missing essentials
 * @route   GET /api/shopping/gap-analysis
 * @access  Private
 */
export const getWardrobeGapAnalysis = async (req, res) => {
  try {
    const wardrobeItems = await WardrobeItem.findAll({ where: { userId: req.user.id } });
    
    // Format simplified wardrobe item details for Gemini prompt context
    const simplifiedItems = wardrobeItems.map(item => ({
      category: item.category,
      color: item.color,
      style: item.style,
      pattern: item.pattern,
      season: item.season,
      brand: item.brand
    }));

    const analysis = await runWardrobeGapAnalysis(simplifiedItems);

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Error in gap analysis controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get shopping suggestions matching the wardrobe & query
 * @route   POST /api/shopping/suggest
 * @access  Private
 */
export const getShoppingRecommendations = async (req, res) => {
  const { query, budget, brand, category, occasion } = req.body;

  if (!query) {
    return res.status(400).json({ success: false, error: 'Please specify a shopping search query' });
  }

  try {
    const wardrobeItems = await WardrobeItem.findAll({ where: { userId: req.user.id } });
    
    const filters = {
      budget: budget || 1500,
      brand: brand || '',
      category: category || '',
      occasion: occasion || '',
    };

    const suggestions = await getShoppingSuggestions(wardrobeItems, query, filters);

    res.json({
      success: true,
      query,
      filters,
      suggestions,
    });
  } catch (error) {
    console.error("Error in shopping suggestions controller:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

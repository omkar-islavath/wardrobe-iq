import OutfitHistory from '../models/OutfitHistory.js';

// Color Harmony rules
const getColorCompatibilityScore = (topColor, bottomColor, shoeColor, jacketColor = null) => {
  const primaryColors = [topColor, bottomColor, shoeColor];
  if (jacketColor) primaryColors.push(jacketColor);

  const colors = primaryColors.map(c => c.toLowerCase().trim());
  const neutrals = ['white', 'black', 'grey', 'gray', 'beige', 'brown', 'khaki', 'cream', 'navy', 'navy blue'];

  const neutralCount = colors.filter(c => neutrals.includes(c)).length;
  const totalItems = colors.length;

  if (neutralCount === totalItems) {
    const uniqueColors = new Set(colors);
    if (uniqueColors.size === 1) {
      if (colors[0] === 'black') return 40;
      return 32;
    }
    return 40;
  }

  if (neutralCount >= totalItems - 1) {
    return 38;
  }

  const hasColor = (c) => colors.includes(c);

  if (hasColor('olive') && (hasColor('brown') || hasColor('beige') || hasColor('rust'))) return 38;
  if ((hasColor('navy') || hasColor('navy blue')) && (hasColor('yellow') || hasColor('mustard'))) return 36;
  if (hasColor('pink') && (hasColor('grey') || hasColor('gray'))) return 35;
  if ((hasColor('blue') || hasColor('navy blue')) && (hasColor('brown') || hasColor('tan'))) return 37;

  const clashPairs = [
    ['red', 'green'],
    ['purple', 'yellow'],
    ['orange', 'pink'],
    ['green', 'pink'],
    ['red', 'pink']
  ];

  for (const pair of clashPairs) {
    if (colors.includes(pair[0]) && colors.includes(pair[1])) {
      return 15;
    }
  }

  return 28;
};

// Occasion Matching logic
const getOccasionScore = (occasion, itemCategories, itemStyles) => {
  const styles = itemStyles.map(s => s.toLowerCase().trim());
  const categories = itemCategories.map(c => c.toLowerCase().trim());

  switch (occasion) {
    case 'placement interview':
      // Heavy penalties for completely inappropriate styles or categories
      if (styles.includes('party') || styles.includes('traditional') || styles.includes('travel')) {
        return 1;
      }
      if (categories.includes('t-shirt') || categories.includes('shorts') || categories.includes('crop top')) {
        return 2;
      }
      
      const isAllFormal = styles.every(s => s === 'formal');
      if (isAllFormal) return 25;
      
      const formalItemCount = styles.filter(s => s === 'formal').length;
      if (formalItemCount >= 2) return 18;
      if (formalItemCount >= 1) return 12;
      return 6;

    case 'office':
      if (styles.includes('party') || styles.includes('traditional')) {
        return 3;
      }
      if (categories.includes('shorts') || categories.includes('crop top')) {
        return 2;
      }
      
      const officeStyles = styles.filter(s => s === 'formal' || s === 'casual');
      if (officeStyles.length === totalItemsCount(categories)) {
        const formalCount = styles.filter(s => s === 'formal').length;
        if (formalCount >= 1) return 25;
        return 20;
      }
      return 8;

    case 'college':
      if (styles.includes('formal')) {
        return 8; // Too dressed up/stiff for college
      }
      if (styles.includes('party')) {
        return 12; // Too flashy for daily lectures
      }
      
      const isCasualOrTravel = styles.every(s => s === 'casual' || s === 'travel');
      if (isCasualOrTravel) return 25;
      return 18;

    case 'date':
      if (styles.includes('traditional')) {
        return 12;
      }
      if (styles.includes('formal') && styles.includes('party')) {
        return 22;
      }
      if (styles.includes('party') || styles.includes('casual')) {
        return 25;
      }
      return 15;

    case 'wedding':
    case 'festival':
      if (styles.includes('traditional')) return 25;
      if (styles.includes('party')) return 20;
      if (styles.includes('formal')) return 16;
      if (categories.includes('shorts') || styles.includes('travel')) return 2;
      return 8;

    case 'party':
      if (styles.includes('party')) return 25;
      if (styles.includes('casual')) return 18;
      if (styles.includes('formal')) return 12;
      return 10;

    case 'travel':
      if (styles.includes('formal')) return 4; // Impractical for travel
      const travelComfort = styles.every(s => s === 'casual' || s === 'travel');
      if (travelComfort) return 25;
      return 16;

    case 'casual outing':
    default:
      if (styles.includes('formal')) return 8; // Too formal for casual hangout
      if (styles.every(s => s === 'casual' || s === 'travel')) return 25;
      return 18;
  }
};

const totalItemsCount = (arr) => arr.length;

// Weather Matching logic
const getWeatherScore = (weather, items) => {
  if (!weather) return 10;

  const temp = weather.temp;
  const isRainy = weather.rainProbability > 50 || weather.condition.includes('rain');
  
  let score = 15;

  const categories = items.map(i => i.category);
  const seasons = items.map(i => i.season);

  if (temp > 28) {
    if (categories.includes('jacket')) {
      score -= 8;
    }
    if (categories.includes('shorts')) {
      score += 2;
    }
    if (seasons.includes('winter')) {
      score -= 5;
    }
    score = Math.max(2, score);
  }

  if (temp < 16) {
    if (categories.includes('jacket')) {
      score += 2;
    } else {
      score -= 8;
    }
    if (categories.includes('shorts')) {
      score -= 7;
    }
    if (seasons.includes('winter')) {
      score += 2;
    }
    score = Math.max(2, score);
  }

  if (isRainy) {
    const hasSuedeShoes = items.some(item => 
      item.category === 'shoes' && 
      (item.tags?.includes('suede') || item.color === 'white' || item.tags?.includes('mesh'))
    );
    if (hasSuedeShoes) {
      score -= 6;
    }
    const hasLightBottom = items.some(item => 
      ['pants', 'jeans'].includes(item.category) && 
      ['white', 'beige', 'light grey', 'cream'].includes(item.color)
    );
    if (hasLightBottom) {
      score -= 4;
    }
    score = Math.max(1, score);
  }

  return Math.min(15, Math.max(0, score));
};

// User Style Preference Matching
const getUserPreferenceScore = (styleProfile, items) => {
  if (!styleProfile) return 5;

  const preferredColors = (styleProfile.preferredColors || []).map(c => c.toLowerCase());
  const preferredStyle = styleProfile.preferredStyle ? styleProfile.preferredStyle.toLowerCase() : '';

  let score = 0;

  items.forEach(item => {
    if (preferredColors.includes(item.color.toLowerCase())) {
      score += 2;
    }
    if (item.style.toLowerCase() === preferredStyle) {
      score += 2;
    }
  });

  return Math.min(10, score);
};

// Freshness Matching
const getFreshnessScore = (recentWornItemIds, items) => {
  let score = 10;
  
  items.forEach(item => {
    // items.id is numeric or string in Postgres
    const itemIdStr = String(item.id);
    const lastWornIndex = recentWornItemIds.indexOf(itemIdStr);
    
    if (lastWornIndex !== -1) {
      if (lastWornIndex === 0) score -= 7;
      else if (lastWornIndex === 1) score -= 5;
      else if (lastWornIndex === 2) score -= 3;
      else score -= 1;
    }
  });

  return Math.max(0, score);
};

/**
 * GENERATE OUTFITS
 */
export const generateOutfitRecommendations = async (user, wardrobeItems, occasion, weather, historyLimit = 10) => {
  // 1. Fetch outfit history for freshness using Sequelize queries
  const recentOutfits = await OutfitHistory.findAll({
    where: { userId: user.id },
    order: [['dateWorn', 'DESC']],
    limit: historyLimit
  });

  // Collect item IDs worn recently
  const recentWornItemIds = [];
  recentOutfits.forEach(outfit => {
    if (outfit.outfitItems) {
      outfit.outfitItems.forEach(itemId => {
        const idStr = String(itemId);
        if (!recentWornItemIds.includes(idStr)) {
          recentWornItemIds.push(idStr);
        }
      });
    }
  });

  // Filter wardrobeItems based on user gender to ensure partitioned recommendations
  let filteredWardrobeItems = wardrobeItems;
  if (user && user.gender === 'male') {
    const maleCategories = ['shirt', 't-shirt', 'pants', 'jeans', 'shorts', 'jacket', 'shoes', 'accessories'];
    filteredWardrobeItems = wardrobeItems.filter(item => 
      maleCategories.includes(item.category.toLowerCase()) && 
      item.gender !== 'women'
    );
  } else if (user && user.gender === 'female') {
    const femaleCategories = ['top', 'crop top', 'kurti', 'skirt', 'leggings', 'dress', 'saree', 'shirt', 't-shirt', 'pants', 'jeans', 'shorts', 'jacket', 'shoes', 'accessories'];
    filteredWardrobeItems = wardrobeItems.filter(item => 
      femaleCategories.includes(item.category.toLowerCase()) && 
      item.gender !== 'men'
    );
  }

  // 2. Separate wardrobe items by category
  const tops = filteredWardrobeItems.filter(item => ['shirt', 't-shirt', 'top', 'crop top', 'kurti'].includes(item.category));
  const bottoms = filteredWardrobeItems.filter(item => ['pants', 'jeans', 'shorts', 'skirt', 'leggings'].includes(item.category));
  const shoes = filteredWardrobeItems.filter(item => item.category === 'shoes');
  const jackets = filteredWardrobeItems.filter(item => item.category === 'jacket');
  const onePieces = filteredWardrobeItems.filter(item => ['dress', 'saree'].includes(item.category));

  // Hybrid fallback: Seed simulated essentials if categories are missing,
  // enabling immediate styling layouts even with sparse wardrobes.
  if (tops.length === 0 && onePieces.length === 0) {
    tops.push({
      id: 'simulated-top',
      category: 'shirt',
      color: 'white',
      style: 'casual',
      season: 'all',
      pattern: 'solid',
      brand: 'Stylist Essential',
      tags: ['essential', 'simulated'],
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
      isSimulated: true
    });
  }

  if (bottoms.length === 0 && onePieces.length === 0) {
    bottoms.push({
      id: 'simulated-bottom',
      category: 'jeans',
      color: 'black',
      style: 'casual',
      season: 'all',
      pattern: 'solid',
      brand: 'Stylist Essential',
      tags: ['essential', 'simulated'],
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80',
      isSimulated: true
    });
  }

  if (shoes.length === 0) {
    shoes.push({
      id: 'simulated-shoes',
      category: 'shoes',
      color: 'white',
      style: 'casual',
      season: 'all',
      pattern: 'solid',
      brand: 'Stylist Essential',
      tags: ['essential', 'simulated'],
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80',
      isSimulated: true
    });
  }

  const combinations = [];

  // Helper to push standard combinations (Top + Bottom + Shoe + Jacket)
  const addCombination = (top, bottom, shoe, jacket = null) => {
    const items = [top, bottom, shoe];
    if (jacket) items.push(jacket);

    // Calculate sub-scores
    const colorScore = getColorCompatibilityScore(top.color, bottom.color, shoe.color, jacket?.color);
    
    const categories = items.map(i => i.category);
    const styles = items.map(i => i.style);
    const occasionScore = getOccasionScore(occasion, categories, styles);
    
    const weatherScore = getWeatherScore(weather, items);
    const preferenceScore = getUserPreferenceScore(user.styleProfile, items);
    const freshnessScore = getFreshnessScore(recentWornItemIds, items);

    const totalScore = colorScore + occasionScore + weatherScore + preferenceScore + freshnessScore;

    const mappedItems = items.map(i => {
      return (typeof i.toJSON === 'function') ? i.toJSON() : i;
    });

    combinations.push({
      outfitItems: mappedItems,
      score: Math.round(totalScore),
      scoreBreakdown: {
        colorCompatibility: Math.round(colorScore),
        occasionMatch: Math.round(occasionScore),
        weatherMatch: Math.round(weatherScore),
        userPreferenceMatch: Math.round(preferenceScore),
        freshness: Math.round(freshnessScore)
      }
    });
  };

  // Helper to push one-piece combinations (Dress/Saree + Shoe + Jacket)
  const addOnePieceCombination = (onePiece, shoe, jacket = null) => {
    const items = [onePiece, shoe];
    if (jacket) items.push(jacket);

    // One-piece color compatibility: match its own color with itself (top/bottom same color)
    const colorScore = getColorCompatibilityScore(onePiece.color, onePiece.color, shoe.color, jacket?.color);
    
    const categories = items.map(i => i.category);
    const styles = items.map(i => i.style);
    const occasionScore = getOccasionScore(occasion, categories, styles);
    
    const weatherScore = getWeatherScore(weather, items);
    const preferenceScore = getUserPreferenceScore(user.styleProfile, items);
    const freshnessScore = getFreshnessScore(recentWornItemIds, items);

    const totalScore = colorScore + occasionScore + weatherScore + preferenceScore + freshnessScore;

    const mappedItems = items.map(i => {
      return (typeof i.toJSON === 'function') ? i.toJSON() : i;
    });

    combinations.push({
      outfitItems: mappedItems,
      score: Math.round(totalScore),
      scoreBreakdown: {
        colorCompatibility: Math.round(colorScore),
        occasionMatch: Math.round(occasionScore),
        weatherMatch: Math.round(weatherScore),
        userPreferenceMatch: Math.round(preferenceScore),
        freshness: Math.round(freshnessScore)
      }
    });
  };

  // Generate combos: Top + Bottom + Shoe
  if (tops.length > 0 && bottoms.length > 0) {
    for (const top of tops) {
      for (const bottom of bottoms) {
        for (const shoe of shoes) {
          addCombination(top, bottom, shoe);

          if (jackets.length > 0 && (!weather || weather.temp <= 28)) {
            for (const jacket of jackets) {
              addCombination(top, bottom, shoe, jacket);
            }
          }
        }
      }
    }
  }

  // Generate combos: One-Piece + Shoe
  if (onePieces.length > 0) {
    for (const onePiece of onePieces) {
      for (const shoe of shoes) {
        addOnePieceCombination(onePiece, shoe);

        if (jackets.length > 0 && (!weather || weather.temp <= 28)) {
          for (const jacket of jackets) {
            addOnePieceCombination(onePiece, shoe, jacket);
          }
        }
      }
    }
  }

  // Sort by score descending, with deterministic secondary sort when scores are equal
  combinations.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Stable secondary sort using stringified sorted item IDs
    const aIds = a.outfitItems.map(i => String(i.id || '')).sort().join(',');
    const bIds = b.outfitItems.map(i => String(i.id || '')).sort().join(',');
    return aIds.localeCompare(bIds);
  });

  // Return top 15 combinations
  return combinations.slice(0, 15);
};

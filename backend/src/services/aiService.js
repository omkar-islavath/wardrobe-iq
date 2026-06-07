import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import { clothingDataset } from './clothingDataset.js';

// Initialize Gemini API client if API key is provided
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

/**
 * Convert local file to Generative AI inline data structure
 */
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

/**
 * 1. Analyze Clothing Image
 */
export const analyzeClothingImage = async (imagePath, mimeType) => {
  if (!genAI) {
    console.log("GEMINI_API_KEY not found. Running AI Clothing Analysis in MOCK mode.");
    return runMockClothingAnalysis(imagePath);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imagePart = fileToGenerativePart(imagePath, mimeType);
    
    const prompt = `
      You are an expert fashion AI analyzer. Analyze this clothing item image and determine:
      1. Category (must be one of: shirt, t-shirt, pants, jeans, shorts, jacket, shoes, accessories, top, crop top, kurti, skirt, leggings, dress, saree)
      2. Color (primary color, simple e.g. white, black, navy blue, red, olive, beige, grey, brown)
      3. Secondary Color (if any, e.g. white, none, red)
      4. Pattern (e.g. solid, striped, checked, printed, floral)
      5. Style (e.g. casual, formal, party, traditional, travel)
      6. Recommended Season (must be one of: summer, winter, rainy, spring-fall, all)
      7. Suggested Brand (if visible, else leave empty)
      8. Suggested Tags (array of strings, e.g. ["cotton", "denim", "button-down", "slim-fit"])

      Respond ONLY with a valid JSON object. Do not include any markdown formatting or extra text.
      JSON structure:
      {
        "category": "string",
        "color": "string",
        "secondaryColor": "string",
        "pattern": "string",
        "style": "string",
        "season": "string",
        "brand": "string",
        "tags": ["string", "string"]
      }
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text().trim();
    
    // Clean up response text if Gemini wraps it in markdown ```json ... ```
    const cleanedJson = responseText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Error in Gemini Clothing Analysis:", error);
    return runMockClothingAnalysis(imagePath);
  }
};

/**
 * Mock Clothing Analysis Fallback
 */
const runMockClothingAnalysis = (imagePath) => {
  const lowercasePath = imagePath.toLowerCase();
  
  let category = "shirt";
  let color = "navy blue";
  let secondaryColor = "none";
  let pattern = "solid";
  let style = "casual";
  let season = "all";
  let brand = "StyleCorp";
  let tags = ["essential", "cotton"];

  if (lowercasePath.includes("dress") || lowercasePath.includes("gown") || lowercasePath.includes("onepiece")) {
    category = "dress";
    color = "black";
    style = "party";
    tags = ["one-piece", "feminine", "elegant"];
  } else if (lowercasePath.includes("saree") || lowercasePath.includes("sari")) {
    category = "saree";
    color = "red";
    style = "traditional";
    tags = ["traditional", "ethnic", "indian"];
  } else if (lowercasePath.includes("skirt")) {
    category = "skirt";
    color = "pink";
    tags = ["skirt", "feminine", "casual"];
  } else if (lowercasePath.includes("kurti") || lowercasePath.includes("kurtas")) {
    category = "kurti";
    color = "yellow";
    style = "traditional";
    tags = ["traditional", "kurti", "ethnic"];
  } else if (lowercasePath.includes("crop top") || lowercasePath.includes("croptop")) {
    category = "crop top";
    color = "white";
    season = "summer";
    tags = ["modern", "crop-top", "summer"];
  } else if (lowercasePath.includes("legging") || lowercasePath.includes("leggings")) {
    category = "leggings";
    color = "black";
    tags = ["stretch", "leggings", "comfy"];
  } else if (lowercasePath.includes("top")) {
    category = "top";
    color = "white";
    tags = ["casual", "top", "essential"];
  } else if (lowercasePath.includes("pant") || lowercasePath.includes("trouser")) {
    category = "pants";
    color = "black";
    style = "formal";
    tags = ["formal", "office", "slim-fit"];
  } else if (lowercasePath.includes("jean") || lowercasePath.includes("denim")) {
    category = "jeans";
    color = "blue";
    tags = ["denim", "indigo", "rugged"];
  } else if (lowercasePath.includes("shoe") || lowercasePath.includes("sneaker") || lowercasePath.includes("boot")) {
    category = "shoes";
    color = "white";
    tags = ["sneakers", "leather", "athleisure"];
  } else if (lowercasePath.includes("tshirt") || lowercasePath.includes("tee") || lowercasePath.includes("t-shirt")) {
    category = "t-shirt";
    color = "grey";
    tags = ["comfy", "crew-neck", "basics"];
  } else if (lowercasePath.includes("jacket") || lowercasePath.includes("coat") || lowercasePath.includes("hoodie")) {
    category = "jacket";
    color = "olive";
    season = "winter";
    tags = ["outerwear", "warm", "layered"];
  } else if (lowercasePath.includes("short")) {
    category = "shorts";
    color = "beige";
    season = "summer";
    tags = ["beachwear", "chilling", "relaxed"];
  } else if (lowercasePath.includes("watch") || lowercasePath.includes("bag") || lowercasePath.includes("belt") || lowercasePath.includes("accessory")) {
    category = "accessories";
    color = "brown";
    tags = ["leather", "classic", "styling"];
  }

  return {
    category,
    color,
    secondaryColor,
    pattern,
    style,
    season,
    brand,
    tags
  };
};

/**
 * 3. Wardrobe Gap Analysis
 */
export const runWardrobeGapAnalysis = async (wardrobeItems) => {
  if (!genAI) {
    return runMockGapAnalysis(wardrobeItems);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are a fashion intelligence advisor. I will provide a list of clothing items in a user's wardrobe.
      Analyze the list and identify:
      1. Missing wardrobe essentials (e.g., "Your wardrobe lacks formal shoes", "You have many dark shirts but few light-colored shirts").
      2. 3 actionable suggestions to improve their wardrobe versatility.

      User's Wardrobe Items:
      ${JSON.stringify(wardrobeItems, null, 2)}

      Respond ONLY with a valid JSON object containing an array of strings called "gaps" and an array of strings called "suggestions".
      JSON structure:
      {
        "gaps": ["string", "string"],
        "suggestions": ["string", "string"]
      }
    `;

    const result = await model.generateContent([prompt]);
    const responseText = result.response.text().trim();
    const cleanedJson = responseText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Error in Gemini Gap Analysis:", error);
    return runMockGapAnalysis(wardrobeItems);
  }
};

const runMockGapAnalysis = (wardrobeItems) => {
  const counts = {
    shirt: 0,
    "t-shirt": 0,
    pants: 0,
    jeans: 0,
    shorts: 0,
    jacket: 0,
    shoes: 0,
    accessories: 0,
  };
  
  let hasFormal = false;
  let lightColors = 0;
  let darkColors = 0;

  wardrobeItems.forEach(item => {
    if (counts[item.category] !== undefined) {
      counts[item.category]++;
    }
    if (item.style === 'formal') {
      hasFormal = true;
    }
    const color = item.color.toLowerCase();
    if (['white', 'beige', 'light blue', 'light grey', 'yellow'].includes(color)) {
      lightColors++;
    } else {
      darkColors++;
    }
  });

  const gaps = [];
  const suggestions = [];

  if (counts.shoes === 0) {
    gaps.push("Your wardrobe completely lacks shoes. You need versatile footwear to pair with your outfits.");
    suggestions.push("Invest in a pair of clean white minimalist sneakers (highly versatile for casual wear) and black formal leather shoes.");
  } else if (counts.shoes < 2) {
    gaps.push("Your footwear selection is very limited.");
    suggestions.push("Add formal shoes if you only have sneakers, or vice-versa, to bridge the gap between casual and formal wear.");
  }

  if (counts.shirt === 0 && counts["t-shirt"] === 0) {
    gaps.push("You do not have any tops in your digital wardrobe.");
    suggestions.push("Upload some basic t-shirts and shirts to start generating complete outfits.");
  }

  if (counts.pants === 0 && counts.jeans === 0) {
    gaps.push("You are missing bottoms (pants or jeans).");
    suggestions.push("Add a pair of dark blue jeans and black/charcoal trousers to complete basic outfits.");
  }

  if (!hasFormal && wardrobeItems.length > 3) {
    gaps.push("You lack formal clothing options. Everything in your wardrobe is casual.");
    suggestions.push("Add a structured formal white or light blue shirt and formal trousers for interviews or business occasions.");
  }

  if (lightColors === 0 && wardrobeItems.length > 3) {
    gaps.push("You have many dark items but lack versatile light-colored clothes.");
    suggestions.push("Pick up a classic white crew-neck tee or a beige linen shirt to balance out your dark shirts.");
  }

  // Fallback default gaps if everything looks okay
  if (gaps.length === 0) {
    gaps.push("You have a balanced wardrobe baseline.");
    gaps.push("You could benefit from more seasonal layering options (like a lightweight jacket).");
    suggestions.push("Add a neutral-colored jacket (e.g. olive bomber or black denim) to enhance layering options.");
    suggestions.push("Add accessories like a classic brown leather belt or watch to elevate casual outfits.");
  }

  return { gaps, suggestions };
};

/**
 * 4. Shopping Assistant Recommendations
 */
export const getShoppingSuggestions = async (wardrobeItems, query, filters) => {
  if (!genAI) {
    return runMockShoppingSuggestions(wardrobeItems, query, filters);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are a personalized AI shopping assistant. Based on the user's current wardrobe items, recommend 3 specific clothing items that would match their current clothes.
      The user's query is: "${query}"
      Filters: Budget: ${filters.budget || 'Any'}, Brand: ${filters.brand || 'Any'}, Category: ${filters.category || 'Any'}, Occasion: ${filters.occasion || 'Any'}

      User's Wardrobe:
      ${JSON.stringify(wardrobeItems.map(i => ({ category: i.category, color: i.color, style: i.style, pattern: i.pattern })), null, 2)}

      Return ONLY a JSON array of 3 objects.
      Each object must contain:
      - "name": String (product name)
      - "brand": String
      - "price": Number (in INR ₹, matching their budget filter if specified)
      - "imageUrl": String (use a placeholder clothing image URL or a high-quality free image URL)
      - "purchaseLink": String (simulated store link)
      - "matchReason": String (detailed explanation of exactly which item in their wardrobe it pairs with and why it fits their style profile or occasion)

      Do not return markdown format or any text outside of the JSON array.
      JSON structure:
      [
        {
          "name": "string",
          "brand": "string",
          "price": 0,
          "imageUrl": "string",
          "purchaseLink": "string",
          "matchReason": "string"
        }
      ]
    `;

    const result = await model.generateContent([prompt]);
    const responseText = result.response.text().trim();
    const cleanedJson = responseText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    const suggestions = JSON.parse(cleanedJson);
    
    return suggestions.map(prod => {
      const searchTerms = `${prod.brand || ''} ${prod.name || ''}`.trim();
      const formattedTerms = searchTerms.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const purchaseLink = `https://www.myntra.com/${formattedTerms}?rawQuery=${encodeURIComponent(searchTerms)}`;
      return {
        ...prod,
        purchaseLink
      };
    });
  } catch (error) {
    console.error("Error in Gemini Shopping Assistant:", error);
    return runMockShoppingSuggestions(wardrobeItems, query, filters);
  }
};

const runMockShoppingSuggestions = (wardrobeItems, query, filters) => {
  const lowercaseQuery = query.toLowerCase();
  
  // 1. Parse budget from query or filters
  let budget = parseInt(filters.budget) || 1500;
  const priceMatch = lowercaseQuery.match(/(?:under|below|less than|within|inr|rs|rs\.|₹)\s*(\d+)/i) || lowercaseQuery.match(/(\d+)\s*(?:budget|rupees|rs|inr|₹)/i);
  if (priceMatch) {
    budget = parseInt(priceMatch[1]);
  }

  // 2. Parse category from query or filters
  let categoryFilter = (filters.category || '').toLowerCase();
  if (!categoryFilter) {
    if (lowercaseQuery.includes("pant") || lowercaseQuery.includes("trouser") || lowercaseQuery.includes("chino") || lowercaseQuery.includes("trousers")) {
      categoryFilter = "pants";
    } else if (lowercaseQuery.includes("shoe") || lowercaseQuery.includes("sneaker") || lowercaseQuery.includes("boot") || lowercaseQuery.includes("footwear") || lowercaseQuery.includes("sneakers") || lowercaseQuery.includes("boots")) {
      categoryFilter = "shoes";
    } else if (lowercaseQuery.includes("jacket") || lowercaseQuery.includes("hoodie") || lowercaseQuery.includes("coat") || lowercaseQuery.includes("outerwear")) {
      categoryFilter = "jacket";
    } else if (lowercaseQuery.includes("jean") || lowercaseQuery.includes("denim") || lowercaseQuery.includes("jeans")) {
      categoryFilter = "jeans";
    } else if (lowercaseQuery.includes("tshirt") || lowercaseQuery.includes("t-shirt") || lowercaseQuery.includes("tee")) {
      categoryFilter = "t-shirt";
    } else if (lowercaseQuery.includes("shirt")) {
      categoryFilter = "shirt";
    } else if (lowercaseQuery.includes("short") || lowercaseQuery.includes("shorts")) {
      categoryFilter = "shorts";
    } else if (lowercaseQuery.includes("watch") || lowercaseQuery.includes("belt") || lowercaseQuery.includes("accessory") || lowercaseQuery.includes("accessories")) {
      categoryFilter = "accessories";
    }
  }

  // 3. Parse brand from query or filters
  let brandFilter = (filters.brand || '').toLowerCase();
  if (!brandFilter) {
    const brandsList = ['roadster', 'wrogn', 'hrx', 'puma', 'bata', 'louis philippe', 'mast & harbour', 'adidas', 'nike', 'zara', 'h&m', 'levi'];
    for (const b of brandsList) {
      if (lowercaseQuery.includes(b)) {
        brandFilter = b;
        break;
      }
    }
  }

  // 4. Tokenize query
  const queryTokens = lowercaseQuery
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  // 5. Scoring dictionary for weights
  const weights = {
    // Categories
    'shirt': 12, 'tshirt': 12, 't-shirt': 12, 'pants': 12, 'trouser': 12, 'trousers': 12,
    'jeans': 12, 'denim': 12, 'shorts': 12, 'jacket': 12, 'coat': 12, 'hoodie': 12,
    'shoes': 12, 'sneaker': 12, 'sneakers': 12, 'boot': 12, 'boots': 12, 'accessory': 12, 'accessories': 12,
    // Colors
    'white': 10, 'black': 10, 'grey': 10, 'gray': 10, 'blue': 10, 'navy': 10,
    'olive': 10, 'green': 10, 'beige': 10, 'brown': 10, 'red': 10, 'yellow': 10,
    'pink': 10, 'khaki': 10, 'cream': 10, 'rust': 10, 'maroon': 10,
    // Brands
    'roadster': 8, 'wrogn': 8, 'hrx': 8, 'puma': 8, 'bata': 8, 'louis': 8, 'philippe': 8,
    'mast': 8, 'harbour': 8, 'adidas': 8, 'nike': 8, 'zara': 8, 'hm': 8, 'levis': 8, 'levi': 8,
    // Styles
    'casual': 6, 'formal': 6, 'party': 6, 'traditional': 6, 'travel': 6, 'sports': 6
  };

  // 6. Map and Score dataset items
  const scoredItems = clothingDataset.map(item => {
    const docText = `${item.name} ${item.brand} ${item.category} ${item.color} ${item.style} ${item.description}`.toLowerCase();
    const docTokens = docText.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    const docSet = new Set(docTokens);

    let intersectionWeight = 0;
    let queryWeightSum = 0;
    let docWeightSum = 0;

    queryTokens.forEach(t => {
      const w = weights[t] || 2;
      queryWeightSum += w * w;
      if (docSet.has(t)) {
        intersectionWeight += w * w;
      }
    });

    docTokens.forEach(t => {
      const w = weights[t] || 2;
      docWeightSum += w * w;
    });

    let similarity = 0;
    if (queryWeightSum > 0 && docWeightSum > 0) {
      similarity = intersectionWeight / (Math.sqrt(queryWeightSum) * Math.sqrt(docWeightSum));
    }

    return {
      ...item,
      similarity
    };
  });

  // 7. Apply layered filters
  // Step 1: Base candidates filtered by brand if brandFilter is set
  let brandFilteredCandidates = scoredItems;
  if (brandFilter) {
    brandFilteredCandidates = scoredItems.filter(item => 
      item.brand.toLowerCase().includes(brandFilter) || brandFilter.includes(item.brand.toLowerCase())
    );
  }

  // Step 2: Candidates filtered by category if categoryFilter is set
  let categoryFilteredCandidates = brandFilteredCandidates;
  if (categoryFilter) {
    categoryFilteredCandidates = brandFilteredCandidates.filter(item => {
      if (categoryFilter === 'pants') return item.category === 'pants' || item.category === 'jeans';
      if (categoryFilter === 'jeans') return item.category === 'jeans' || item.category === 'pants';
      if (categoryFilter === 't-shirt') return item.category === 't-shirt' || item.category === 'shirt';
      if (categoryFilter === 'shirt') return item.category === 'shirt' || item.category === 't-shirt';
      return item.category === categoryFilter;
    });
  }

  // Step 3: Candidates within budget
  let finalCandidates = categoryFilteredCandidates.filter(item => item.price <= budget);

  // Sort by similarity score descending
  finalCandidates.sort((a, b) => b.similarity - a.similarity);

  // Take top 3
  const results = finalCandidates.slice(0, 3);

  // Layered Fallback if we have fewer than 3 items
  // Layer A: Matches brand + category, but goes over budget
  if (results.length < 3 && categoryFilteredCandidates.length > results.length) {
    const existingIds = new Set(results.map(r => r.name));
    const fallbacks = categoryFilteredCandidates
      .filter(item => !existingIds.has(item.name))
      .sort((a, b) => b.similarity - a.similarity);
    
    for (const item of fallbacks) {
      if (results.length >= 3) break;
      results.push(item);
    }
  }

  // Layer B: Matches brand + budget, but any category
  if (results.length < 3 && brandFilteredCandidates.length > results.length) {
    const existingIds = new Set(results.map(r => r.name));
    const fallbacks = brandFilteredCandidates
      .filter(item => item.price <= budget && !existingIds.has(item.name))
      .sort((a, b) => b.similarity - a.similarity);
    
    for (const item of fallbacks) {
      if (results.length >= 3) break;
      results.push(item);
    }
  }

  // Layer C: Matches brand, any budget, any category
  if (results.length < 3 && brandFilteredCandidates.length > results.length) {
    const existingIds = new Set(results.map(r => r.name));
    const fallbacks = brandFilteredCandidates
      .filter(item => !existingIds.has(item.name))
      .sort((a, b) => b.similarity - a.similarity);
    
    for (const item of fallbacks) {
      if (results.length >= 3) break;
      results.push(item);
    }
  }

  // Layer D: Matches category + budget, any brand (only if brand was NOT strictly selected or if we ran out of brand items)
  if (results.length < 3) {
    const existingIds = new Set(results.map(r => r.name));
    let categoryBudgetFallbacks = scoredItems.filter(item => item.price <= budget && !existingIds.has(item.name));
    if (categoryFilter) {
      categoryBudgetFallbacks = categoryBudgetFallbacks.filter(item => {
        if (categoryFilter === 'pants') return item.category === 'pants' || item.category === 'jeans';
        if (categoryFilter === 'jeans') return item.category === 'jeans' || item.category === 'pants';
        if (categoryFilter === 't-shirt') return item.category === 't-shirt' || item.category === 'shirt';
        if (categoryFilter === 'shirt') return item.category === 'shirt' || item.category === 't-shirt';
        return item.category === categoryFilter;
      });
    }
    categoryBudgetFallbacks.sort((a, b) => b.similarity - a.similarity);
    
    for (const item of categoryBudgetFallbacks) {
      if (results.length >= 3) break;
      results.push(item);
    }
  }

  // Layer E: Any item under budget
  if (results.length < 3) {
    const existingIds = new Set(results.map(r => r.name));
    const finalFallbacks = scoredItems
      .filter(item => item.price <= budget && !existingIds.has(item.name))
      .sort((a, b) => b.similarity - a.similarity);
    for (const item of finalFallbacks) {
      if (results.length >= 3) break;
      results.push(item);
    }
  }

  // 9. Personalize reasoning based on actual wardrobe items!
  const sampleBottom = wardrobeItems.find(i => ['pants', 'jeans', 'shorts'].includes(i.category)) || { color: 'dark', category: 'jeans' };
  const sampleTop = wardrobeItems.find(i => ['shirt', 't-shirt'].includes(i.category)) || { color: 'white', category: 't-shirt' };

  return results.map(item => {
    // Generate dynamic match reasons
    let matchReason = `Matches your style criteria.`;
    if (item.category === 'shirt' || item.category === 't-shirt') {
      matchReason = `Pairs beautifully with the ${sampleBottom.color} ${sampleBottom.category} in your wardrobe, adding a versatile, coordinated layering option.`;
    } else if (item.category === 'pants' || item.category === 'jeans' || item.category === 'shorts') {
      matchReason = `Coordinates nicely with the ${sampleTop.color} ${sampleTop.category} in your wardrobe, creating a clean ${item.style} outfit structure.`;
    } else if (item.category === 'shoes') {
      matchReason = `Complements your ${sampleBottom.color} ${sampleBottom.category} perfectly. Ideal for complete ${item.style} styling and daily wear.`;
    } else {
      matchReason = `An essential layering piece to complete your ${sampleTop.color} tops and elevate your styling depth.`;
    }

    const searchTerms = `${item.brand} ${item.name}`;
    const formattedTerms = searchTerms.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const purchaseLink = `https://www.myntra.com/${formattedTerms}?rawQuery=${encodeURIComponent(searchTerms)}`;

    return {
      name: item.name,
      brand: item.brand,
      price: item.price,
      imageUrl: item.imageUrl,
      purchaseLink,
      matchReason
    };
  });
};

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
 * Helper to get generative model with request options (like custom proxy base URL)
 */
const getModelWithOptions = (modelName) => {
  if (!genAI) return null;
  const options = { model: modelName };
  const requestOptions = {};
  if (process.env.GEMINI_BASE_URL) {
    requestOptions.baseUrl = process.env.GEMINI_BASE_URL;
  }
  return genAI.getGenerativeModel(options, requestOptions);
};


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
export const analyzeClothingImage = async (imagePath, mimeType, gender = 'male') => {
  if (!genAI) {
    console.log("GEMINI_API_KEY not found. Running AI Clothing Analysis in MOCK mode.");
    return runMockClothingAnalysis(imagePath);
  }

  try {
    const model = getModelWithOptions("gemini-2.5-flash");
    const imagePart = fileToGenerativePart(imagePath, mimeType);
    
    const allowedCategories = gender === 'female'
      ? "top, crop top, kurti, skirt, leggings, dress, saree, shirt, t-shirt, pants, jeans, shorts, jacket, shoes, accessories"
      : "shirt, t-shirt, pants, jeans, shorts, jacket, shoes, accessories";

    const prompt = `
      You are an expert fashion AI analyzer. Analyze this clothing item image and determine:
      1. Category (must be one of: ${allowedCategories})
      2. Target Gender (must be one of: men, women, unisex)
      3. Color (primary color, simple e.g. white, black, navy blue, red, olive, beige, grey, brown)
      4. Secondary Color (if any, e.g. white, none, red)
      5. Pattern (e.g. solid, striped, checked, printed, floral)
      6. Style (e.g. casual, formal, party, traditional, travel)
      7. Recommended Season (must be one of: summer, winter, rainy, spring-fall, all)
      8. Suggested Brand (if visible, else leave empty)
      9. Suggested Tags (array of strings, e.g. ["cotton", "denim", "button-down", "slim-fit"])

      Respond ONLY with a valid JSON object. Do not include any markdown formatting or extra text.
      JSON structure:
      {
        "category": "string",
        "gender": "string",
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
    
    // Robust extraction of JSON object
    let jsonStart = responseText.indexOf('{');
    let jsonEnd = responseText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Could not find JSON structure in model response");
    }
    const cleanedJson = responseText.substring(jsonStart, jsonEnd + 1);
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

  const femaleOnlyCategories = ['top', 'crop top', 'kurti', 'skirt', 'leggings', 'dress', 'saree'];
  let mockGender = 'men';
  if (femaleOnlyCategories.includes(category)) {
    mockGender = 'women';
  } else if (category === 'accessories') {
    mockGender = 'unisex';
  }

  return {
    category,
    gender: mockGender,
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
    const model = getModelWithOptions("gemini-2.5-flash");
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
    
    // Robust extraction of JSON object
    let jsonStart = responseText.indexOf('{');
    let jsonEnd = responseText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Could not find JSON structure in model response");
    }
    const cleanedJson = responseText.substring(jsonStart, jsonEnd + 1);
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
 * Helper to retrieve, score, and rank candidate items from clothingDataset
 */
const getSortedCandidates = (wardrobeItems, query, filters) => {
  const lowercaseQuery = query.toLowerCase();
  
  // 1. Parse budget from query or filters
  let budget = parseInt(filters.budget) || 1500;
  const priceMatch = lowercaseQuery.match(/(?:under|below|less than|within|inr|rs|rs\.|₹)\s*(\d+)/i) || lowercaseQuery.match(/(\d+)\s*(?:budget|rupees|rs|inr|₹)/i);
  if (priceMatch) {
    budget = parseInt(priceMatch[1]);
  }

  // 1.5. Clean query of matching reference context to find the actual target category
  let cleanQuery = lowercaseQuery;
  const matchingPhrases = [
    /(?:for|with|match|matching|pair|go with)\s+(?:my\s+)?(?:[a-z-]+\s+)*(?:shirt|t-shirt|pant|trouser|chino|jeans|denim|shorts|jacket|shoes|sneaker|boot|top|crop top|kurti|skirt|leggings|dress|saree)s?/gi
  ];
  matchingPhrases.forEach(regex => {
    cleanQuery = cleanQuery.replace(regex, '');
  });

  // Extract source category from query to exclude it if no target category is specified
  let matchSourceCategory = '';
  const sourceMatches = lowercaseQuery.match(/(?:for|with|match|matching|pair|go with)\s+(?:my\s+)?(?:[a-z-]+\s+)*(shirt|t-shirt|pant|trouser|chino|jeans|denim|shorts|jacket|shoes|sneaker|boot|top|crop top|kurti|skirt|leggings|dress|saree)s?/i);
  if (sourceMatches) {
    const rawSource = sourceMatches[1].toLowerCase();
    if (rawSource.includes("pant") || rawSource.includes("trouser") || rawSource.includes("chino")) matchSourceCategory = "pants";
    else if (rawSource.includes("jean") || rawSource.includes("denim")) matchSourceCategory = "jeans";
    else if (rawSource.includes("tshirt") || rawSource.includes("t-shirt")) matchSourceCategory = "t-shirt";
    else if (rawSource.includes("shirt")) matchSourceCategory = "shirt";
    else if (rawSource.includes("shoe") || rawSource.includes("sneaker") || rawSource.includes("boot")) matchSourceCategory = "shoes";
    else if (rawSource.includes("short")) matchSourceCategory = "shorts";
    else if (rawSource.includes("jacket")) matchSourceCategory = "jacket";
    else if (rawSource.includes("top")) matchSourceCategory = "top";
    else if (rawSource.includes("crop top")) matchSourceCategory = "crop top";
    else if (rawSource.includes("kurti")) matchSourceCategory = "kurti";
    else if (rawSource.includes("skirt")) matchSourceCategory = "skirt";
    else if (rawSource.includes("leggings")) matchSourceCategory = "leggings";
    else if (rawSource.includes("dress")) matchSourceCategory = "dress";
    else if (rawSource.includes("saree")) matchSourceCategory = "saree";
  }

  // 2. Parse category from query or filters
  let categoryFilter = (filters.category || '').toLowerCase();
  if (!categoryFilter) {
    if (cleanQuery.includes("crop top") || cleanQuery.includes("croptop")) {
      categoryFilter = "crop top";
    } else if (cleanQuery.includes("top")) {
      categoryFilter = "top";
    } else if (cleanQuery.includes("kurti") || cleanQuery.includes("kurtas") || cleanQuery.includes("kurta")) {
      categoryFilter = "kurti";
    } else if (cleanQuery.includes("skirt") || cleanQuery.includes("skirts")) {
      categoryFilter = "skirt";
    } else if (cleanQuery.includes("legging") || cleanQuery.includes("leggings")) {
      categoryFilter = "leggings";
    } else if (cleanQuery.includes("dress") || cleanQuery.includes("dresses")) {
      categoryFilter = "dress";
    } else if (cleanQuery.includes("saree") || cleanQuery.includes("sari") || cleanQuery.includes("sarees")) {
      categoryFilter = "saree";
    } else if (cleanQuery.includes("pant") || cleanQuery.includes("trouser") || cleanQuery.includes("chino") || cleanQuery.includes("trousers")) {
      categoryFilter = "pants";
    } else if (cleanQuery.includes("shoe") || cleanQuery.includes("sneaker") || cleanQuery.includes("boot") || cleanQuery.includes("footwear") || cleanQuery.includes("sneakers") || cleanQuery.includes("boots")) {
      categoryFilter = "shoes";
    } else if (cleanQuery.includes("jacket") || cleanQuery.includes("hoodie") || cleanQuery.includes("coat") || cleanQuery.includes("outerwear")) {
      categoryFilter = "jacket";
    } else if (cleanQuery.includes("jean") || cleanQuery.includes("denim") || cleanQuery.includes("jeans")) {
      categoryFilter = "jeans";
    } else if (cleanQuery.includes("tshirt") || cleanQuery.includes("t-shirt") || cleanQuery.includes("tee")) {
      categoryFilter = "t-shirt";
    } else if (cleanQuery.includes("shirt")) {
      categoryFilter = "shirt";
    } else if (cleanQuery.includes("short") || cleanQuery.includes("shorts")) {
      categoryFilter = "shorts";
    } else if (cleanQuery.includes("watch") || cleanQuery.includes("belt") || cleanQuery.includes("accessory") || cleanQuery.includes("accessories")) {
      categoryFilter = "accessories";
    }
  }

  // 3. Parse brand from query or filters
  let brandFilter = (filters.brand || '').toLowerCase();
  if (!brandFilter) {
    const brandsList = ['roadster', 'wrogn', 'hrx', 'puma', 'bata', 'louis philippe', 'mast & harbour', 'adidas', 'nike', 'zara', 'h&m', 'levi', 'biba', 'only', 'vero moda', 'allen solly', 'van heusen', 'tommy hilfiger', 'w'];
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
    'shirt': 12, 'tshirt': 12, 't-shirt': 12, 'pants': 12, 'trouser': 12, 'trousers': 12,
    'jeans': 12, 'denim': 12, 'shorts': 12, 'jacket': 12, 'coat': 12, 'hoodie': 12,
    'shoes': 12, 'sneaker': 12, 'sneakers': 12, 'boot': 12, 'boots': 12, 'accessory': 12, 'accessories': 12,
    'top': 12, 'crop top': 12, 'croptop': 12, 'kurti': 12, 'kurta': 12, 'skirt': 12, 'leggings': 12, 'dress': 12, 'saree': 12, 'sari': 12,
    'white': 10, 'black': 10, 'grey': 10, 'gray': 10, 'blue': 10, 'navy': 10,
    'olive': 10, 'green': 10, 'beige': 10, 'brown': 10, 'red': 10, 'yellow': 10,
    'pink': 10, 'khaki': 10, 'cream': 10, 'rust': 10, 'maroon': 10,
    'roadster': 8, 'wrogn': 8, 'hrx': 8, 'puma': 8, 'bata': 8, 'louis': 8, 'philippe': 8,
    'mast': 8, 'harbour': 8, 'adidas': 8, 'nike': 8, 'zara': 8, 'hm': 8, 'levis': 8, 'levi': 8,
    'biba': 8, 'w': 8, 'only': 8, 'vero': 8, 'moda': 8, 'allen': 8, 'solly': 8, 'van': 8, 'heusen': 8, 'tommy': 8, 'hilfiger': 8,
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

  // 6.5. Filter by gender
  let genderFilteredItems = scoredItems;
  const userGender = (filters.gender || 'male').toLowerCase();
  
  // Default based on user gender
  let targetGenders = [];
  if (userGender === 'female' || userGender === 'women') {
    targetGenders = ['women', 'unisex'];
  } else {
    targetGenders = ['men', 'unisex'];
  }

  // Override if query explicitly mentions gender-specific keywords
  if (lowercaseQuery.includes('women') || lowercaseQuery.includes('womens') || lowercaseQuery.includes('female') || lowercaseQuery.includes('lady') || lowercaseQuery.includes('ladies') || lowercaseQuery.includes('saree') || lowercaseQuery.includes('kurti') || lowercaseQuery.includes('dress') || lowercaseQuery.includes('skirt') || lowercaseQuery.includes('crop top')) {
    targetGenders = ['women', 'unisex'];
  } else if (lowercaseQuery.includes('men') || lowercaseQuery.includes('mens') || lowercaseQuery.includes('male') || lowercaseQuery.includes('boy') || lowercaseQuery.includes('boys')) {
    targetGenders = ['men', 'unisex'];
  }

  genderFilteredItems = scoredItems.filter(item => targetGenders.includes(item.gender));

  // 7. Apply layered filters
  let brandFilteredCandidates = genderFilteredItems;
  if (brandFilter) {
    brandFilteredCandidates = genderFilteredItems.filter(item => 
      item.brand.toLowerCase().includes(brandFilter) || brandFilter.includes(item.brand.toLowerCase())
    );
  }

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

  // Filter out the match source category to prevent matching jeans with jeans, kurtis with kurtis, etc.
  let sourceFilteredCandidates = categoryFilteredCandidates;
  if (matchSourceCategory && !categoryFilter) {
    sourceFilteredCandidates = categoryFilteredCandidates.filter(item => item.category !== matchSourceCategory);
  }

  let finalCandidates = sourceFilteredCandidates.filter(item => item.price <= budget);
  finalCandidates.sort((a, b) => b.similarity - a.similarity);

  const results = finalCandidates.slice(0, 20);

  // Fallbacks if we have too few items
  if (results.length < 10 && sourceFilteredCandidates.length > results.length) {
    const existingNames = new Set(results.map(r => r.name));
    const fallbacks = sourceFilteredCandidates
      .filter(item => !existingNames.has(item.name))
      .sort((a, b) => b.similarity - a.similarity);
    
    for (const item of fallbacks) {
      if (results.length >= 20) break;
      results.push(item);
    }
  }

  if (results.length < 10 && brandFilteredCandidates.length > results.length) {
    const existingNames = new Set(results.map(r => r.name));
    const fallbacks = brandFilteredCandidates
      .filter(item => item.price <= budget && !existingNames.has(item.name))
      .sort((a, b) => b.similarity - a.similarity);
    
    for (const item of fallbacks) {
      if (results.length >= 20) break;
      results.push(item);
    }
  }

  if (results.length < 20) {
    const existingNames = new Set(results.map(r => r.name));
    const finalFallbacks = genderFilteredItems
      .filter(item => item.price <= budget && !existingNames.has(item.name))
      .sort((a, b) => b.similarity - a.similarity);
    for (const item of finalFallbacks) {
      if (results.length >= 20) break;
      results.push(item);
    }
  }

  return results;
};

/**
 * 4. Shopping Assistant Recommendations
 */
export const getShoppingSuggestions = async (wardrobeItems, query, filters) => {
  if (!genAI) {
    return runMockShoppingSuggestions(wardrobeItems, query, filters);
  }

  try {
    const candidates = getSortedCandidates(wardrobeItems, query, filters).slice(0, 15);
    
    if (candidates.length === 0) {
      return runMockShoppingSuggestions(wardrobeItems, query, filters);
    }

    const model = getModelWithOptions("gemini-2.5-flash");
    const prompt = `
      You are a personalized AI fashion shopping assistant.
      Select the top 3 best matching clothing items for the user from the Candidate Items List below.
      The user's search query is: "${query}"

      User's Current Wardrobe:
      ${JSON.stringify(wardrobeItems.map(i => ({ category: i.category, color: i.color, style: i.style, pattern: i.pattern })), null, 2)}

      Candidate Items List (you MUST select ONLY from these items):
      ${JSON.stringify(candidates.map((item, idx) => ({ index: idx, name: item.name, brand: item.brand, price: item.price, category: item.category, color: item.color, style: item.style, description: item.description })), null, 2)}

      Return ONLY a JSON array of 3 objects representing your selection.
      Each object must contain:
      - "index": Number (the index of the selected item in the Candidate Items List)
      - "name": String (the exact name of the selected item from the list)
      - "brand": String (the brand of the selected item)
      - "matchReason": String (detailed explanation of exactly which item in the user's wardrobe it pairs with and why it fits their search occasion)

      Do not return markdown format or any text outside of the JSON array.
      JSON structure:
      [
        {
          "index": 0,
          "name": "string",
          "brand": "string",
          "matchReason": "string"
        }
      ]
    `;

    const result = await model.generateContent([prompt]);
    const responseText = result.response.text().trim();
    
    // Robust extraction of JSON array
    let jsonStart = responseText.indexOf('[');
    let jsonEnd = responseText.lastIndexOf(']');
    if (jsonStart === -1 || jsonEnd === -1) {
      jsonStart = responseText.indexOf('{');
      jsonEnd = responseText.lastIndexOf('}');
    }
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Could not find JSON structure in model response");
    }
    const cleanedJson = responseText.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(cleanedJson);
    const selections = Array.isArray(parsed) ? parsed : [parsed];
    
    return selections.map((sel, idx) => {
      let item = null;
      
      // 1. Resolve from index
      if (sel.index !== undefined && candidates[sel.index] !== undefined) {
        item = candidates[sel.index];
      }
      
      // 2. Fallback: Search candidates by exact or partial name
      if (!item && sel.name) {
        const lowerSelName = sel.name.toLowerCase();
        item = candidates.find(c => 
          lowerSelName.includes(c.name.toLowerCase()) || 
          c.name.toLowerCase().includes(lowerSelName)
        );
      }
      
      // 3. Fallback: Search entire dataset by name to ensure we get a valid catalog item
      if (!item && sel.name) {
        const lowerSelName = sel.name.toLowerCase();
        item = clothingDataset.find(c => 
          lowerSelName.includes(c.name.toLowerCase()) || 
          c.name.toLowerCase().includes(lowerSelName)
        );
      }
      
      // 4. Fallback: Search candidates by category match
      if (!item && sel.category) {
        item = candidates.find(c => c.category === sel.category.toLowerCase());
      }
      
      // 5. Absolute Fallback: Default to index sequence
      if (!item) {
        item = candidates[idx % candidates.length];
      }
      
      const searchTerms = item.name.toLowerCase().startsWith(item.brand.toLowerCase())
        ? item.name
        : `${item.brand} ${item.name}`;
      const formattedTerms = searchTerms.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const platforms = ['myntra', 'ajio', 'amazon'];
      const platform = platforms[(idx + item.price) % platforms.length];
      let purchaseLink;
      if (platform === 'ajio') {
        purchaseLink = `https://www.ajio.com/search/?text=${encodeURIComponent(searchTerms)}`;
      } else if (platform === 'amazon') {
        purchaseLink = `https://www.amazon.in/s?k=${encodeURIComponent(searchTerms)}`;
      } else {
        purchaseLink = `https://www.myntra.com/${formattedTerms}?rawQuery=${encodeURIComponent(searchTerms)}`;
      }

      return {
        name: item.name,
        brand: item.brand,
        price: item.price,
        imageUrl: item.imageUrl,
        purchaseLink,
        matchReason: sel.matchReason || `Matches your ${query} search parameters.`
      };
    });
  } catch (error) {
    console.error("Error in Gemini Shopping Assistant:", error);
    return runMockShoppingSuggestions(wardrobeItems, query, filters);
  }
};

const runMockShoppingSuggestions = (wardrobeItems, query, filters) => {
  const candidates = getSortedCandidates(wardrobeItems, query, filters).slice(0, 3);
  
  const sampleBottom = wardrobeItems.find(i => ['pants', 'jeans', 'shorts', 'skirt', 'leggings'].includes(i.category)) || { color: 'dark', category: 'jeans' };
  const sampleTop = wardrobeItems.find(i => ['shirt', 't-shirt', 'top', 'crop top', 'kurti'].includes(i.category)) || { color: 'white', category: 't-shirt' };

  return candidates.map((item, idx) => {
    let matchReason = `Matches your style criteria.`;
    if (item.category === 'shirt' || item.category === 't-shirt') {
      matchReason = `Pairs beautifully with the ${sampleBottom.color} ${sampleBottom.category} in your wardrobe, adding a versatile, coordinated option.`;
    } else if (item.category === 'pants' || item.category === 'jeans' || item.category === 'shorts') {
      matchReason = `Coordinates nicely with the ${sampleTop.color} ${sampleTop.category} in your wardrobe, creating a clean, structured outfit.`;
    } else if (item.category === 'shoes') {
      matchReason = `Complements your ${sampleBottom.color} ${sampleBottom.category} and tops perfectly. Ideal for completing your outfit's styling.`;
    } else if (item.category === 'saree') {
      matchReason = `A stunning traditional saree that adds rich ethnic elegance to your collection. Pair with neutral heels for a complete festive look.`;
    } else if (item.category === 'kurti') {
      const bottom = wardrobeItems.find(i => ['leggings', 'jeans', 'pants'].includes(i.category)) || { color: 'blue', category: 'jeans' };
      matchReason = `Pairs beautifully with the ${bottom.color} ${bottom.category} in your wardrobe, creating a comfortable yet elegant traditional-casual style.`;
    } else if (item.category === 'skirt') {
      matchReason = `Complements the ${sampleTop.color} ${sampleTop.category} in your wardrobe, offering a stylish and feminine alternative for warm days.`;
    } else if (item.category === 'top' || item.category === 'crop top') {
      matchReason = `Pairs perfectly with the ${sampleBottom.color} ${sampleBottom.category} in your wardrobe for a chic, balanced silhouette.`;
    } else if (item.category === 'leggings') {
      const kurti = wardrobeItems.find(i => i.category === 'kurti') || { color: 'traditional', category: 'kurti' };
      matchReason = `An essential wardrobe foundation. Pairs perfectly under the ${kurti.color} ${kurti.category} in your wardrobe for daily comfort.`;
    } else if (item.category === 'dress') {
      const shoes = wardrobeItems.find(i => i.category === 'shoes') || { color: 'classic', category: 'shoes' };
      matchReason = `A beautiful, standalone statement dress. Style it with the ${shoes.color} ${shoes.category} in your collection for an effortless look.`;
    } else if (item.category === 'jacket') {
      matchReason = `A versatile layering piece to wear over your ${sampleTop.color} ${sampleTop.category}, adding structure and warmth to casual outings.`;
    } else if (item.category === 'accessories') {
      matchReason = `The perfect finishing touch to elevate your daily outfits, adding detail and refinement to your style.`;
    }

    const searchTerms = item.name.toLowerCase().startsWith(item.brand.toLowerCase())
      ? item.name
      : `${item.brand} ${item.name}`;
    const formattedTerms = searchTerms.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const platforms = ['myntra', 'ajio', 'amazon'];
    const platform = platforms[(item.brand.length + item.price) % platforms.length];
    let purchaseLink;
    if (platform === 'ajio') {
      purchaseLink = `https://www.ajio.com/search/?text=${encodeURIComponent(searchTerms)}`;
    } else if (platform === 'amazon') {
      purchaseLink = `https://www.amazon.in/s?k=${encodeURIComponent(searchTerms)}`;
    } else {
      purchaseLink = `https://www.myntra.com/${formattedTerms}?rawQuery=${encodeURIComponent(searchTerms)}`;
    }

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

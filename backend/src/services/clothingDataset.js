const manualClothingDataset = [
  // --- SHIRTS ---
  {
    name: "Checked Casual Navy and White Shirt",
    brand: "Roadster",
    category: "shirt",
    color: "navy blue",
    secondaryColor: "white",
    pattern: "checked",
    style: "casual",
    season: "all",
    price: 899,
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
    description: "casual checked pattern long sleeve cotton shirt navy blue and white colors"
  },
  {
    name: "Solid White Oxford Casual Shirt",
    brand: "Mast & Harbour",
    category: "shirt",
    color: "white",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "all",
    price: 1099,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80",
    description: "casual solid white oxford button down cotton shirt long sleeve"
  },
  {
    name: "Classic Formal White Shirt",
    brand: "Louis Philippe",
    category: "shirt",
    color: "white",
    secondaryColor: "none",
    pattern: "solid",
    style: "formal",
    season: "all",
    price: 1499,
    imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80",
    description: "formal office business solid white cotton shirt slim fit long sleeve placement interview wear"
  },
  {
    name: "Solid Olive Green Casual Shirt",
    brand: "HRX",
    category: "shirt",
    color: "olive",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "summer",
    price: 799,
    imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&q=80",
    description: "casual olive green solid cotton short sleeve light summer shirt"
  },
  {
    name: "Rugged Indigo Denim Shirt",
    brand: "Roadster",
    category: "shirt",
    color: "blue",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "spring-fall",
    price: 1199,
    imageUrl: "https://images.unsplash.com/photo-1588359348347-9bc6cbaa689e?w=500&q=80",
    description: "casual rugged indigo blue denim cotton long sleeve heavy shirt"
  },
  {
    name: "Premium Black Party Wear Shirt",
    brand: "Wrogn",
    category: "shirt",
    color: "black",
    secondaryColor: "none",
    pattern: "solid",
    style: "party",
    season: "all",
    price: 1399,
    imageUrl: "https://images.unsplash.com/photo-1620012253295-c05518e99309?w=500&q=80",
    description: "party wear solid black shiny satin slim fit cotton shirt long sleeve"
  },
  {
    name: "Floral Print Light Summer Shirt",
    brand: "Mast & Harbour",
    category: "shirt",
    color: "pink",
    secondaryColor: "yellow",
    pattern: "printed",
    style: "casual",
    season: "summer",
    price: 999,
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
    description: "casual printed floral pink yellow summer beach half sleeve breathable shirt"
  },

  // --- T-SHIRTS ---
  {
    name: "Sports Navy Blue Melange T-shirt",
    brand: "HRX",
    category: "t-shirt",
    color: "navy blue",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "summer",
    price: 599,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80",
    description: "casual sporty navy blue melange quick dry active wear polyester t-shirt"
  },
  {
    name: "Classic Black Crewneck Tee",
    brand: "Puma",
    category: "t-shirt",
    color: "black",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "all",
    price: 899,
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80",
    description: "casual solid black basic crewneck cotton sports t-shirt"
  },
  {
    name: "Active White Training T-shirt",
    brand: "Adidas",
    category: "t-shirt",
    color: "white",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "summer",
    price: 1099,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80",
    description: "casual active dry fit training solid white sports t-shirt Adidas"
  },
  {
    name: "Grey Melange Graphic Printed Tee",
    brand: "Roadster",
    category: "t-shirt",
    color: "grey",
    secondaryColor: "none",
    pattern: "printed",
    style: "casual",
    season: "all",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80",
    description: "casual printed graphic grey melange cotton t-shirt"
  },
  {
    name: "Oversized Solid Olive Green Tee",
    brand: "H&M",
    category: "t-shirt",
    color: "olive",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "summer",
    price: 999,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80",
    description: "casual street wear oversized loose fit solid olive green cotton t-shirt"
  },

  // --- JEANS ---
  {
    name: "511 Slim Fit Blue Jeans",
    brand: "Levi's",
    category: "jeans",
    color: "blue",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "all",
    price: 2499,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80",
    description: "casual solid blue denim jeans slim fit Levi's durable daily wear"
  },
  {
    name: "Dark Charcoal Regular Fit Jeans",
    brand: "Roadster",
    category: "jeans",
    color: "black",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "all",
    price: 1199,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80",
    description: "casual dark charcoal black solid regular fit denim jeans"
  },
  {
    name: "Ripped Blue Casual Denim Jeans",
    brand: "Wrogn",
    category: "jeans",
    color: "blue",
    secondaryColor: "none",
    pattern: "solid",
    style: "party",
    season: "all",
    price: 1899,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80",
    description: "casual stylish ripped blue denim jeans slim fit party wear"
  },
  {
    name: "Black Skinny Fit Denim Jeans",
    brand: "H&M",
    category: "jeans",
    color: "black",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "all",
    price: 1999,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80",
    description: "casual solid black stretch skinny fit denim jeans street wear"
  },

  // --- PANTS / TROUSERS ---
  {
    name: "Classic Black Formal Trousers",
    brand: "Louis Philippe",
    category: "pants",
    color: "black",
    secondaryColor: "none",
    pattern: "solid",
    style: "formal",
    season: "all",
    price: 1699,
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80",
    description: "formal business office interview black solid slim fit trousers dress pants"
  },
  {
    name: "Slim Fit Beige Chinos",
    brand: "Mast & Harbour",
    category: "pants",
    color: "beige",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "all",
    price: 1299,
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80",
    description: "casual smart slim fit solid beige cotton chinos khaki pants"
  },
  {
    name: "Active Athletic Grey Track Pants",
    brand: "HRX",
    category: "pants",
    color: "grey",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "all",
    price: 899,
    imageUrl: "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=500&q=80",
    description: "casual sports active grey melange sweatpants track pants jogger"
  },
  {
    name: "Military Style Olive Green Cargo Pants",
    brand: "H&M",
    category: "pants",
    color: "olive",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "all",
    price: 1799,
    imageUrl: "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=500&q=80",
    description: "casual military style multi-pocket solid olive green cotton cargo pants"
  },
  {
    name: "Khaki Smart Formal Chinos",
    brand: "Louis Philippe",
    category: "pants",
    color: "beige",
    secondaryColor: "none",
    pattern: "solid",
    style: "formal",
    season: "all",
    price: 1899,
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80",
    description: "formal semi-formal solid khaki beige dress chinos smart office wear"
  },

  // --- SHORTS ---
  {
    name: "Beige Casual Chino Shorts",
    brand: "Roadster",
    category: "shorts",
    color: "beige",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "summer",
    price: 699,
    imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80",
    description: "casual summer solid beige lightweight cotton chino shorts"
  },
  {
    name: "Sports Dry-Fit Black Shorts",
    brand: "HRX",
    category: "shorts",
    color: "black",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "summer",
    price: 599,
    imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80",
    description: "casual active sports dry fit solid black running gym training shorts"
  },

  // --- JACKETS ---
  {
    name: "Classic Olive Green Bomber Jacket",
    brand: "Roadster",
    category: "jacket",
    color: "olive",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "winter",
    price: 1499,
    imageUrl: "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=500&q=80",
    description: "casual warm olive green winter bomber jacket quilted windproof zip up"
  },
  {
    name: "Black Faux Leather Biker Jacket",
    brand: "Wrogn",
    category: "jacket",
    color: "black",
    secondaryColor: "none",
    pattern: "solid",
    style: "party",
    season: "winter",
    price: 2999,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
    description: "party wear stylish black faux leather motorcycle biker zip up winter jacket"
  },
  {
    name: "Classic Blue Denim Trucker Jacket",
    brand: "H&M",
    category: "jacket",
    color: "blue",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "spring-fall",
    price: 2299,
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80",
    description: "casual solid blue denim trucker heavy cotton winter jacket layering option"
  },
  {
    name: "Maroon Fleece Warm Hoodie",
    brand: "Roadster",
    category: "jacket",
    color: "red",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "winter",
    price: 1199,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
    description: "casual winter warm soft maroon red fleece hoodie sweatshirt pullover"
  },

  // --- SHOES ---
  {
    name: "White Classic Minimalist Sneakers",
    brand: "Puma",
    category: "shoes",
    color: "white",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "all",
    price: 2499,
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80",
    description: "casual sneakers white classic leather sports daily wear shoes"
  },
  {
    name: "Black Leather Derby Formal Shoes",
    brand: "Bata",
    category: "shoes",
    color: "black",
    secondaryColor: "none",
    pattern: "solid",
    style: "formal",
    season: "all",
    price: 1499,
    imageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&q=80",
    description: "formal leather black dress derby shoes business office interview graduation shoes"
  },
  {
    name: "Active Running Sports Shoes",
    brand: "HRX",
    category: "shoes",
    color: "grey",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "all",
    price: 1299,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    description: "casual sports active running light grey mesh comfortable trainers shoes"
  },
  {
    name: "Brown Suede Chelsea Boots",
    brand: "Zara",
    category: "shoes",
    color: "brown",
    secondaryColor: "none",
    pattern: "solid",
    style: "party",
    season: "winter",
    price: 3499,
    imageUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&q=80",
    description: "party wear elegant dark brown suede leather chelsea slip on ankle boots shoes"
  },

  // --- ACCESSORIES ---
  {
    name: "Minimalist Brown Leather Watch",
    brand: "Mast & Harbour",
    category: "accessories",
    color: "brown",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "all",
    price: 1299,
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80",
    description: "casual smart formal minimalist watch analog dial brown leather strap accessory"
  },
  {
    name: "Premium Black Leather Belt",
    brand: "Roadster",
    category: "accessories",
    color: "black",
    secondaryColor: "none",
    pattern: "solid",
    style: "casual",
    season: "all",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb805296f?w=500&q=80",
    description: "casual formal black pure leather belt metal buckle accessory"
  }
];

const brandConfigs = {
  "Roadster": {
    categories: ["shirt", "t-shirt", "jeans", "shorts", "jacket", "accessories"],
    styles: ["casual", "travel"],
    minPrice: 499,
    maxPrice: 1999
  },
  "Wrogn": {
    categories: ["shirt", "t-shirt", "jeans", "jacket"],
    styles: ["casual", "party"],
    minPrice: 799,
    maxPrice: 2999
  },
  "HRX": {
    categories: ["t-shirt", "pants", "shorts", "jacket", "shoes"],
    styles: ["sports", "casual"],
    minPrice: 499,
    maxPrice: 2499
  },
  "Puma": {
    categories: ["t-shirt", "shorts", "jacket", "shoes", "accessories"],
    styles: ["sports", "casual"],
    minPrice: 799,
    maxPrice: 3999
  },
  "Bata": {
    categories: ["shoes"],
    styles: ["formal", "casual"],
    minPrice: 699,
    maxPrice: 2499
  },
  "Louis Philippe": {
    categories: ["shirt", "pants", "jacket", "shoes", "accessories"],
    styles: ["formal"],
    minPrice: 1299,
    maxPrice: 4499
  },
  "Mast & Harbour": {
    categories: ["shirt", "t-shirt", "pants", "shorts", "accessories", "top", "crop top", "skirt", "dress", "kurti"],
    styles: ["casual", "party", "traditional"],
    minPrice: 599,
    maxPrice: 1899
  },
  "Adidas": {
    categories: ["t-shirt", "pants", "shorts", "jacket", "shoes", "accessories", "leggings"],
    styles: ["sports", "casual"],
    minPrice: 999,
    maxPrice: 4999
  },
  "Nike": {
    categories: ["t-shirt", "pants", "shorts", "jacket", "shoes", "accessories", "leggings"],
    styles: ["sports", "casual"],
    minPrice: 999,
    maxPrice: 5499
  },
  "Zara": {
    categories: ["shirt", "t-shirt", "pants", "jeans", "jacket", "shoes", "accessories", "dress", "skirt", "top", "crop top"],
    styles: ["party", "casual", "formal"],
    minPrice: 1499,
    maxPrice: 5999
  },
  "H&M": {
    categories: ["shirt", "t-shirt", "pants", "jeans", "shorts", "jacket", "accessories", "dress", "skirt", "top", "crop top", "leggings"],
    styles: ["casual", "party"],
    minPrice: 599,
    maxPrice: 2999
  },
  "Levi's": {
    categories: ["shirt", "t-shirt", "jeans", "jacket", "accessories"],
    styles: ["casual"],
    minPrice: 999,
    maxPrice: 3999
  },
  "Biba": {
    categories: ["kurti", "saree", "dress", "skirt"],
    styles: ["traditional"],
    minPrice: 999,
    maxPrice: 3499
  },
  "W": {
    categories: ["kurti", "top", "skirt", "pants"],
    styles: ["traditional", "casual"],
    minPrice: 799,
    maxPrice: 2499
  },
  "Only": {
    categories: ["top", "crop top", "jeans", "dress", "skirt", "jacket"],
    styles: ["casual", "party"],
    minPrice: 899,
    maxPrice: 3199
  },
  "Vero Moda": {
    categories: ["top", "dress", "skirt", "pants", "jacket"],
    styles: ["casual", "party", "formal"],
    minPrice: 1199,
    maxPrice: 4999
  },
  "Allen Solly": {
    categories: ["shirt", "t-shirt", "pants", "dress", "top"],
    styles: ["casual", "formal"],
    minPrice: 999,
    maxPrice: 2999
  },
  "Van Heusen": {
    categories: ["shirt", "pants", "jacket", "dress"],
    styles: ["formal"],
    minPrice: 1299,
    maxPrice: 4999
  },
  "Tommy Hilfiger": {
    categories: ["shirt", "t-shirt", "pants", "jeans", "jacket", "accessories"],
    styles: ["casual", "travel"],
    minPrice: 1999,
    maxPrice: 7999
  },
  "Others": {
    categories: ["shirt", "t-shirt", "pants", "jeans", "shorts", "jacket", "shoes", "accessories", "top", "crop top", "kurti", "skirt", "leggings", "dress", "saree"],
    styles: ["casual", "formal", "party", "traditional", "travel"],
    minPrice: 299,
    maxPrice: 1999
  }
};

const categoryDetails = {
  shirt: {
    adjectives: ["Oxford Casual", "Linen Premium", "Checked Flannel", "Printed Summer", "Slim Fit Poplin", "Chambray Casual", "Formal Solid Cotton", "Mandarin Collar"],
    colors: ["white", "navy blue", "black", "olive", "blue", "pink", "beige", "red", "grey"],
    patterns: ["solid", "striped", "checked", "printed", "textured"],
    seasons: ["summer", "winter", "spring-fall", "all"]
  },
  "t-shirt": {
    adjectives: ["Crewneck Basic", "V-Neck Comfy", "Polo Classic", "Graphic Printed", "Melange Casual", "Oversized Street", "Active Training", "Athletic Fit"],
    colors: ["black", "white", "grey", "navy blue", "olive", "red", "yellow", "green"],
    patterns: ["solid", "striped", "printed", "textured"],
    seasons: ["summer", "spring-fall", "all"]
  },
  jeans: {
    adjectives: ["511 Slim Fit", "Ripped Casual", "Tapered Stretch", "Distressed Street", "Classic Straight Cut", "Skinny Fit Stretch"],
    colors: ["blue", "black", "charcoal", "grey", "light blue"],
    patterns: ["solid", "faded", "textured"],
    seasons: ["all"]
  },
  pants: {
    adjectives: ["Slim Fit Chino", "Comfort Jogger", "Formal Dress Trouser", "Cargo Multi-pocket", "Relaxed Sweatpant"],
    colors: ["black", "beige", "grey", "khaki", "olive", "navy blue"],
    patterns: ["solid", "textured"],
    seasons: ["all"]
  },
  shorts: {
    adjectives: ["Casual Chino", "Denim Street", "Gym Training", "Active Dry-Fit", "Relaxed Cargo"],
    colors: ["beige", "black", "blue", "olive", "grey"],
    patterns: ["solid", "printed"],
    seasons: ["summer"]
  },
  jacket: {
    adjectives: ["Classic Bomber", "Windproof Active", "Warm Fleece Hoodie", "Denim Trucker", "Quilted Puffer", "Biker Leather"],
    colors: ["olive", "black", "blue", "red", "navy blue", "grey"],
    patterns: ["solid", "textured"],
    seasons: ["winter", "spring-fall"]
  },
  shoes: {
    adjectives: ["Classic Leather Sneaker", "Air Mesh Running", "Derby Formal Dress", "Suede Chelsea Boot", "Slip-On Casual Loafer"],
    colors: ["white", "black", "grey", "brown", "navy blue"],
    patterns: ["solid", "textured"],
    seasons: ["all"]
  },
  accessories: {
    adjectives: ["Leather Strap Watch", "Classic Bi-Fold Wallet", "Premium Leather Belt", "UV Aviator Sunglasses"],
    colors: ["brown", "black", "grey"],
    patterns: ["solid", "textured"],
    seasons: ["all"]
  },
  top: {
    adjectives: ["Floral Print Casual", "Lace Detail Elegant", "Ribbed Knit Modern", "Peplum Stylish"],
    colors: ["white", "black", "pink", "yellow", "blue", "red"],
    patterns: ["solid", "printed", "floral"],
    seasons: ["summer", "spring-fall", "all"]
  },
  "crop top": {
    adjectives: ["Ribbed Casual", "Graphic Printed", "Ruched Stylish", "Sleeveless Summer"],
    colors: ["black", "white", "pink", "yellow", "grey"],
    patterns: ["solid", "printed", "striped"],
    seasons: ["summer"]
  },
  kurti: {
    adjectives: ["Anarkali Traditional", "A-Line Floral", "Straight Cotton", "Printed Festive"],
    colors: ["red", "yellow", "blue", "pink", "green", "white"],
    patterns: ["printed", "solid", "floral"],
    seasons: ["summer", "spring-fall", "all"]
  },
  skirt: {
    adjectives: ["Pleated A-Line", "Floral Maxi", "Denim Casual", "Pencil Formal"],
    colors: ["black", "blue", "pink", "white", "beige"],
    patterns: ["solid", "printed", "floral"],
    seasons: ["summer", "spring-fall", "all"]
  },
  leggings: {
    adjectives: ["Stretch Sports", "Soft Cotton", "Ankle-Length Daily"],
    colors: ["black", "navy blue", "grey", "white"],
    patterns: ["solid"],
    seasons: ["all"]
  },
  dress: {
    adjectives: ["A-Line Summer", "Bodycon Party", "Maxi Floral", "Formal Shift"],
    colors: ["black", "red", "pink", "blue", "green", "yellow"],
    patterns: ["solid", "printed", "floral"],
    seasons: ["summer", "spring-fall", "all"]
  },
  saree: {
    adjectives: ["Silk Traditional", "Georgette Party", "Cotton Handloom", "Organza Designer"],
    colors: ["red", "yellow", "green", "pink", "blue", "black"],
    patterns: ["solid", "printed", "textured"],
    seasons: ["all"]
  }
};

const categoryImages = {
  shirt: [
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80",
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80",
    "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&q=80",
    "https://images.unsplash.com/photo-1588359348347-9bc6cbaa689e?w=500&q=80",
    "https://images.unsplash.com/photo-1620012253295-c05518e99309?w=500&q=80"
  ],
  "t-shirt": [
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=80",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80"
  ],
  jeans: [
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80",
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80"
  ],
  pants: [
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80"
  ],
  shorts: [
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80",
    "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500&q=80"
  ],
  jacket: [
    "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=500&q=80",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80"
  ],
  shoes: [
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80",
    "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&q=80"
  ],
  accessories: [
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80",
    "https://images.unsplash.com/photo-1624222247344-550fb805296f?w=500&q=80"
  ],
  top: [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80"
  ],
  "crop top": [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80"
  ],
  kurti: [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
    "https://images.unsplash.com/photo-1608748010899-18f300247112?w=500&q=80"
  ],
  skirt: [
    "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80",
    "https://images.unsplash.com/photo-1577900272786-39877020dd2a?w=500&q=80"
  ],
  leggings: [
    "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=500&q=80"
  ],
  dress: [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80"
  ],
  saree: [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
    "https://images.unsplash.com/photo-1608748010899-18f300247112?w=500&q=80"
  ]
};

const generateExtraItems = () => {
  const extraItems = [];
  let idCounter = 1;

  for (const [brand, config] of Object.entries(brandConfigs)) {
    const categories = config.categories;
    const styles = config.styles;
    
    for (const category of categories) {
      const details = categoryDetails[category];
      const images = categoryImages[category] || ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80"];
      
      // Generate 3 items per brand/category combination
      for (let i = 0; i < 3; i++) {
        const adj = details.adjectives[i % details.adjectives.length];
        const color = details.colors[(i + idCounter) % details.colors.length];
        const pattern = details.patterns[(i + idCounter) % details.patterns.length];
        const style = styles[i % styles.length];
        const season = details.seasons[(i + idCounter) % details.seasons.length];
        const imgUrl = images[(i + idCounter) % images.length];
        
        // Calculate a price point within range
        const priceStep = Math.floor((config.maxPrice - config.minPrice) / 3);
        const price = config.minPrice + (i * priceStep) + (idCounter % 50); // add minor variation
        
        const name = `${brand} ${adj} ${color.charAt(0).toUpperCase() + color.slice(1)} ${category === 'pants' ? 'Pants' : category === 'jeans' ? 'Jeans' : category.charAt(0).toUpperCase() + category.slice(1)}`;
        
        const description = `${style} ${pattern} ${color} ${category} from ${brand}. Made with high-quality material, perfect for ${season} wear.`;
        
        const femaleOnlyCategories = ['top', 'crop top', 'kurti', 'skirt', 'leggings', 'dress', 'saree'];
        const femaleBrands = ['Biba', 'W', 'Only', 'Vero Moda'];
        const maleBrands = ['Louis Philippe', 'Van Heusen', 'Wrogn'];

        let gender = 'men';
        if (femaleOnlyCategories.includes(category)) {
          gender = 'women';
        } else if (femaleBrands.includes(brand)) {
          gender = 'women';
        } else if (maleBrands.includes(brand)) {
          gender = 'men';
        } else if (category === 'accessories') {
          gender = 'unisex';
        } else {
          // Neutral brands, alternate between men, women, unisex
          if (i === 0) gender = 'men';
          else if (i === 1) gender = 'women';
          else gender = 'unisex';
        }

        extraItems.push({
          name,
          brand,
          category,
          color,
          secondaryColor: i % 2 === 0 ? "none" : details.colors[(i + idCounter + 2) % details.colors.length],
          pattern,
          style,
          season,
          price: Math.round(price / 10) * 10 - 1, // make it look like ₹99, ₹1499, etc.
          imageUrl: imgUrl,
          description,
          gender
        });
        
        idCounter++;
      }
    }
  }
  return extraItems;
};

export const clothingDataset = [
  ...manualClothingDataset.map(item => {
    const femaleOnlyCategories = ['top', 'crop top', 'kurti', 'skirt', 'leggings', 'dress', 'saree'];
    let gender = 'men';
    if (femaleOnlyCategories.includes(item.category)) {
      gender = 'women';
    } else if (item.category === 'accessories') {
      gender = 'unisex';
    }
    return { ...item, gender };
  }),
  ...generateExtraItems()
];

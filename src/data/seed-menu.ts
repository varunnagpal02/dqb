// ============================================
// Desi Quick Bite — Seed Menu Data
// Run this via Supabase SQL editor or a seed script
// ============================================

export const cuisines = [
  { name: "North Indian", slug: "north-indian", sort_order: 1, image_url: "/images/cuisines/north-indian.jpg" },
  { name: "South Indian", slug: "south-indian", sort_order: 2, image_url: "/images/cuisines/south-indian.jpg" },
  { name: "Indo-Chinese", slug: "indo-chinese", sort_order: 3, image_url: "/images/cuisines/indo-chinese.jpg" },
  { name: "Street Food", slug: "street-food", sort_order: 4, image_url: "/images/cuisines/street-food.jpg" },
  { name: "Desserts", slug: "desserts", sort_order: 5, image_url: "/images/cuisines/desserts.jpg" },
  { name: "Beverages", slug: "beverages", sort_order: 6, image_url: "/images/cuisines/beverages.jpg" },
];

export const categories = [
  // North Indian
  { cuisine_slug: "north-indian", name: "Starters", slug: "ni-starters", sort_order: 1 },
  { cuisine_slug: "north-indian", name: "Main Course", slug: "ni-main-course", sort_order: 2 },
  { cuisine_slug: "north-indian", name: "Breads", slug: "ni-breads", sort_order: 3 },
  { cuisine_slug: "north-indian", name: "Rice & Biryani", slug: "ni-rice-biryani", sort_order: 4 },
  // South Indian
  { cuisine_slug: "south-indian", name: "Dosas", slug: "si-dosas", sort_order: 1 },
  { cuisine_slug: "south-indian", name: "Mains", slug: "si-mains", sort_order: 2 },
  // Indo-Chinese
  { cuisine_slug: "indo-chinese", name: "Starters", slug: "ic-starters", sort_order: 1 },
  { cuisine_slug: "indo-chinese", name: "Noodles & Rice", slug: "ic-noodles-rice", sort_order: 2 },
  // Street Food
  { cuisine_slug: "street-food", name: "Chaat", slug: "sf-chaat", sort_order: 1 },
  { cuisine_slug: "street-food", name: "Wraps & Rolls", slug: "sf-wraps-rolls", sort_order: 2 },
  // Desserts
  { cuisine_slug: "desserts", name: "Traditional", slug: "d-traditional", sort_order: 1 },
  // Beverages
  { cuisine_slug: "beverages", name: "Hot Drinks", slug: "b-hot", sort_order: 1 },
  { cuisine_slug: "beverages", name: "Cold Drinks", slug: "b-cold", sort_order: 2 },
];

export interface SeedMenuItem {
  category_slug: string;
  name: string;
  description: string;
  price: number;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  spice_level: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  mood_tags: string[];
  keywords: string[];
  sort_order: number;
}

export const menuItems: SeedMenuItem[] = [
  // ===== NORTH INDIAN — STARTERS =====
  {
    category_slug: "ni-starters", name: "Paneer Tikka", description: "Cubes of paneer marinated in spiced yogurt, grilled in tandoor",
    price: 10.99, is_vegetarian: true, is_vegan: false, is_gluten_free: true, is_spicy: true, spice_level: 2,
    calories: 320, protein_g: 18, carbs_g: 12, fat_g: 22, fiber_g: 2,
    mood_tags: ["comfort", "celebratory"], keywords: ["paneer", "tikka", "tandoor", "grilled"], sort_order: 1,
  },
  {
    category_slug: "ni-starters", name: "Chicken Seekh Kebab", description: "Minced chicken mixed with aromatic spices, grilled on skewers",
    price: 12.99, is_vegetarian: false, is_vegan: false, is_gluten_free: true, is_spicy: true, spice_level: 3,
    calories: 280, protein_g: 32, carbs_g: 6, fat_g: 14, fiber_g: 1,
    mood_tags: ["spicy", "filling"], keywords: ["chicken", "kebab", "grilled", "protein"], sort_order: 2,
  },
  {
    category_slug: "ni-starters", name: "Samosa (2 pcs)", description: "Crispy pastry filled with spiced potatoes and peas",
    price: 5.99, is_vegetarian: true, is_vegan: true, is_gluten_free: false, is_spicy: false, spice_level: 1,
    calories: 340, protein_g: 6, carbs_g: 42, fat_g: 16, fiber_g: 3,
    mood_tags: ["comfort", "light"], keywords: ["samosa", "crispy", "potato", "snack"], sort_order: 3,
  },
  {
    category_slug: "ni-starters", name: "Aloo Tikki", description: "Crispy potato patties served with mint and tamarind chutney",
    price: 6.99, is_vegetarian: true, is_vegan: true, is_gluten_free: true, is_spicy: false, spice_level: 1,
    calories: 220, protein_g: 4, carbs_g: 32, fat_g: 10, fiber_g: 3,
    mood_tags: ["light", "comfort"], keywords: ["potato", "tikki", "crispy", "chutney"], sort_order: 4,
  },
  {
    category_slug: "ni-starters", name: "Tandoori Chicken (Half)", description: "Chicken marinated in yogurt and spices, roasted in clay oven",
    price: 13.99, is_vegetarian: false, is_vegan: false, is_gluten_free: true, is_spicy: true, spice_level: 3,
    calories: 350, protein_g: 42, carbs_g: 8, fat_g: 16, fiber_g: 0,
    mood_tags: ["spicy", "healthy", "filling"], keywords: ["chicken", "tandoori", "roasted", "high-protein"], sort_order: 5,
  },

  // ===== NORTH INDIAN — MAIN COURSE =====
  {
    category_slug: "ni-main-course", name: "Butter Chicken", description: "Tender chicken in rich, creamy tomato-butter sauce",
    price: 15.99, is_vegetarian: false, is_vegan: false, is_gluten_free: true, is_spicy: false, spice_level: 1,
    calories: 490, protein_g: 30, carbs_g: 18, fat_g: 32, fiber_g: 2,
    mood_tags: ["comfort", "celebratory", "filling"], keywords: ["butter", "chicken", "creamy", "tomato", "curry"], sort_order: 1,
  },
  {
    category_slug: "ni-main-course", name: "Palak Paneer", description: "Cottage cheese cubes in smooth, spiced spinach gravy",
    price: 13.99, is_vegetarian: true, is_vegan: false, is_gluten_free: true, is_spicy: false, spice_level: 1,
    calories: 350, protein_g: 20, carbs_g: 14, fat_g: 24, fiber_g: 5,
    mood_tags: ["healthy", "comfort"], keywords: ["paneer", "spinach", "palak", "protein", "iron"], sort_order: 2,
  },
  {
    category_slug: "ni-main-course", name: "Dal Makhani", description: "Slow-cooked black lentils in buttery, creamy gravy",
    price: 12.99, is_vegetarian: true, is_vegan: false, is_gluten_free: true, is_spicy: false, spice_level: 1,
    calories: 380, protein_g: 16, carbs_g: 36, fat_g: 18, fiber_g: 8,
    mood_tags: ["comfort", "filling"], keywords: ["dal", "lentils", "creamy", "protein", "fiber"], sort_order: 3,
  },
  {
    category_slug: "ni-main-course", name: "Chicken Vindaloo", description: "Fiery hot Goan-style chicken curry with vinegar tang",
    price: 15.99, is_vegetarian: false, is_vegan: false, is_gluten_free: true, is_spicy: true, spice_level: 5,
    calories: 420, protein_g: 34, carbs_g: 12, fat_g: 26, fiber_g: 2,
    mood_tags: ["spicy", "filling"], keywords: ["vindaloo", "chicken", "goan", "hot", "spicy"], sort_order: 4,
  },
  {
    category_slug: "ni-main-course", name: "Chana Masala", description: "Chickpeas cooked in tangy, spiced tomato gravy",
    price: 11.99, is_vegetarian: true, is_vegan: true, is_gluten_free: true, is_spicy: true, spice_level: 2,
    calories: 310, protein_g: 14, carbs_g: 42, fat_g: 10, fiber_g: 12,
    mood_tags: ["healthy", "comfort"], keywords: ["chana", "chickpea", "vegan", "protein", "fiber"], sort_order: 5,
  },
  {
    category_slug: "ni-main-course", name: "Rogan Josh", description: "Aromatic Kashmiri lamb curry with rich red gravy",
    price: 17.99, is_vegetarian: false, is_vegan: false, is_gluten_free: true, is_spicy: true, spice_level: 3,
    calories: 480, protein_g: 36, carbs_g: 10, fat_g: 32, fiber_g: 2,
    mood_tags: ["celebratory", "comfort", "filling"], keywords: ["lamb", "kashmiri", "rogan", "josh", "curry"], sort_order: 6,
  },
  {
    category_slug: "ni-main-course", name: "Aloo Gobi", description: "Potatoes and cauliflower cooked with turmeric and cumin",
    price: 10.99, is_vegetarian: true, is_vegan: true, is_gluten_free: true, is_spicy: false, spice_level: 1,
    calories: 240, protein_g: 6, carbs_g: 34, fat_g: 10, fiber_g: 6,
    mood_tags: ["light", "healthy"], keywords: ["aloo", "gobi", "cauliflower", "potato", "vegan"], sort_order: 7,
  },
  {
    category_slug: "ni-main-course", name: "Paneer Butter Masala", description: "Paneer cubes in velvety tomato-cashew cream sauce",
    price: 14.99, is_vegetarian: true, is_vegan: false, is_gluten_free: true, is_spicy: false, spice_level: 1,
    calories: 440, protein_g: 18, carbs_g: 20, fat_g: 34, fiber_g: 2,
    mood_tags: ["comfort", "celebratory", "filling"], keywords: ["paneer", "butter", "masala", "creamy", "rich"], sort_order: 8,
  },

  // ===== NORTH INDIAN — BREADS =====
  {
    category_slug: "ni-breads", name: "Butter Naan", description: "Soft leavened bread brushed with butter, baked in tandoor",
    price: 3.49, is_vegetarian: true, is_vegan: false, is_gluten_free: false, is_spicy: false, spice_level: 0,
    calories: 260, protein_g: 8, carbs_g: 42, fat_g: 6, fiber_g: 2,
    mood_tags: ["comfort"], keywords: ["naan", "bread", "butter", "tandoor"], sort_order: 1,
  },
  {
    category_slug: "ni-breads", name: "Garlic Naan", description: "Naan topped with roasted garlic and cilantro",
    price: 3.99, is_vegetarian: true, is_vegan: false, is_gluten_free: false, is_spicy: false, spice_level: 0,
    calories: 280, protein_g: 8, carbs_g: 44, fat_g: 8, fiber_g: 2,
    mood_tags: ["comfort"], keywords: ["naan", "garlic", "bread", "cilantro"], sort_order: 2,
  },
  {
    category_slug: "ni-breads", name: "Tandoori Roti", description: "Whole wheat bread baked in clay oven",
    price: 2.49, is_vegetarian: true, is_vegan: true, is_gluten_free: false, is_spicy: false, spice_level: 0,
    calories: 160, protein_g: 6, carbs_g: 30, fat_g: 2, fiber_g: 4,
    mood_tags: ["healthy", "light"], keywords: ["roti", "wheat", "bread", "healthy"], sort_order: 3,
  },
  {
    category_slug: "ni-breads", name: "Stuffed Paratha", description: "Whole wheat flatbread stuffed with spiced potatoes",
    price: 4.99, is_vegetarian: true, is_vegan: true, is_gluten_free: false, is_spicy: false, spice_level: 1,
    calories: 320, protein_g: 8, carbs_g: 48, fat_g: 12, fiber_g: 4,
    mood_tags: ["comfort", "filling"], keywords: ["paratha", "stuffed", "potato", "aloo"], sort_order: 4,
  },

  // ===== NORTH INDIAN — RICE & BIRYANI =====
  {
    category_slug: "ni-rice-biryani", name: "Chicken Biryani", description: "Fragrant basmati rice layered with spiced chicken and saffron",
    price: 14.99, is_vegetarian: false, is_vegan: false, is_gluten_free: true, is_spicy: true, spice_level: 2,
    calories: 520, protein_g: 28, carbs_g: 58, fat_g: 18, fiber_g: 2,
    mood_tags: ["celebratory", "comfort", "filling"], keywords: ["biryani", "chicken", "rice", "saffron", "basmati"], sort_order: 1,
  },
  {
    category_slug: "ni-rice-biryani", name: "Veg Biryani", description: "Basmati rice with mixed vegetables, nuts and aromatic spices",
    price: 12.99, is_vegetarian: true, is_vegan: true, is_gluten_free: true, is_spicy: false, spice_level: 1,
    calories: 420, protein_g: 12, carbs_g: 62, fat_g: 14, fiber_g: 6,
    mood_tags: ["comfort", "filling"], keywords: ["biryani", "veg", "rice", "vegetables", "aromatic"], sort_order: 2,
  },
  {
    category_slug: "ni-rice-biryani", name: "Jeera Rice", description: "Basmati rice tempered with cumin seeds and ghee",
    price: 4.99, is_vegetarian: true, is_vegan: false, is_gluten_free: true, is_spicy: false, spice_level: 0,
    calories: 220, protein_g: 4, carbs_g: 42, fat_g: 4, fiber_g: 1,
    mood_tags: ["light"], keywords: ["rice", "jeera", "cumin", "basmati"], sort_order: 3,
  },

  // ===== SOUTH INDIAN — DOSAS =====
  {
    category_slug: "si-dosas", name: "Masala Dosa", description: "Crispy rice crepe filled with spiced potato filling, served with sambar and chutney",
    price: 10.99, is_vegetarian: true, is_vegan: true, is_gluten_free: true, is_spicy: false, spice_level: 1,
    calories: 350, protein_g: 8, carbs_g: 52, fat_g: 12, fiber_g: 4,
    mood_tags: ["comfort", "light"], keywords: ["dosa", "masala", "crispy", "south-indian", "crepe"], sort_order: 1,
  },
  {
    category_slug: "si-dosas", name: "Plain Dosa", description: "Thin, crispy rice and lentil crepe served with chutneys and sambar",
    price: 8.99, is_vegetarian: true, is_vegan: true, is_gluten_free: true, is_spicy: false, spice_level: 0,
    calories: 240, protein_g: 6, carbs_g: 38, fat_g: 8, fiber_g: 2,
    mood_tags: ["light", "healthy"], keywords: ["dosa", "plain", "crispy", "simple"], sort_order: 2,
  },
  {
    category_slug: "si-dosas", name: "Mysore Masala Dosa", description: "Dosa spread with spicy red chutney, filled with potato masala",
    price: 11.99, is_vegetarian: true, is_vegan: true, is_gluten_free: true, is_spicy: true, spice_level: 3,
    calories: 380, protein_g: 8, carbs_g: 54, fat_g: 14, fiber_g: 4,
    mood_tags: ["spicy", "comfort"], keywords: ["dosa", "mysore", "spicy", "chutney", "masala"], sort_order: 3,
  },

  // ===== SOUTH INDIAN — MAINS =====
  {
    category_slug: "si-mains", name: "Idli Sambar (4 pcs)", description: "Steamed rice cakes served with lentil soup and coconut chutney",
    price: 7.99, is_vegetarian: true, is_vegan: true, is_gluten_free: true, is_spicy: false, spice_level: 0,
    calories: 260, protein_g: 10, carbs_g: 48, fat_g: 4, fiber_g: 4,
    mood_tags: ["light", "healthy"], keywords: ["idli", "sambar", "steamed", "healthy", "breakfast"], sort_order: 1,
  },
  {
    category_slug: "si-mains", name: "Medu Vada (3 pcs)", description: "Crispy fried lentil donuts served with sambar and chutney",
    price: 7.49, is_vegetarian: true, is_vegan: true, is_gluten_free: true, is_spicy: false, spice_level: 1,
    calories: 320, protein_g: 12, carbs_g: 36, fat_g: 14, fiber_g: 4,
    mood_tags: ["comfort"], keywords: ["vada", "medu", "crispy", "fried", "lentil"], sort_order: 2,
  },
  {
    category_slug: "si-mains", name: "Uttapam", description: "Thick rice pancake topped with onions, tomatoes, and chilies",
    price: 9.99, is_vegetarian: true, is_vegan: true, is_gluten_free: true, is_spicy: false, spice_level: 1,
    calories: 310, protein_g: 8, carbs_g: 46, fat_g: 10, fiber_g: 3,
    mood_tags: ["comfort", "filling"], keywords: ["uttapam", "pancake", "onion", "tomato"], sort_order: 3,
  },

  // ===== INDO-CHINESE — STARTERS =====
  {
    category_slug: "ic-starters", name: "Veg Manchurian", description: "Deep-fried vegetable balls tossed in spicy soy-garlic sauce",
    price: 9.99, is_vegetarian: true, is_vegan: true, is_gluten_free: false, is_spicy: true, spice_level: 2,
    calories: 340, protein_g: 6, carbs_g: 38, fat_g: 18, fiber_g: 3,
    mood_tags: ["spicy", "comfort"], keywords: ["manchurian", "chinese", "fried", "saucy", "garlic"], sort_order: 1,
  },
  {
    category_slug: "ic-starters", name: "Chilli Paneer", description: "Paneer cubes stir-fried with peppers in hot chili sauce",
    price: 11.99, is_vegetarian: true, is_vegan: false, is_gluten_free: false, is_spicy: true, spice_level: 3,
    calories: 360, protein_g: 16, carbs_g: 20, fat_g: 24, fiber_g: 2,
    mood_tags: ["spicy"], keywords: ["chilli", "paneer", "chinese", "stir-fry", "peppers"], sort_order: 2,
  },
  {
    category_slug: "ic-starters", name: "Chicken 65", description: "Spicy deep-fried chicken bites with curry leaves and chilies",
    price: 12.99, is_vegetarian: false, is_vegan: false, is_gluten_free: false, is_spicy: true, spice_level: 4,
    calories: 380, protein_g: 28, carbs_g: 18, fat_g: 22, fiber_g: 1,
    mood_tags: ["spicy", "celebratory"], keywords: ["chicken", "65", "fried", "spicy", "crispy"], sort_order: 3,
  },
  {
    category_slug: "ic-starters", name: "Spring Rolls (4 pcs)", description: "Crispy rolls stuffed with vegetables, served with sweet chili sauce",
    price: 7.99, is_vegetarian: true, is_vegan: true, is_gluten_free: false, is_spicy: false, spice_level: 0,
    calories: 280, protein_g: 4, carbs_g: 34, fat_g: 14, fiber_g: 2,
    mood_tags: ["light"], keywords: ["spring", "rolls", "crispy", "vegetables", "snack"], sort_order: 4,
  },

  // ===== INDO-CHINESE — NOODLES & RICE =====
  {
    category_slug: "ic-noodles-rice", name: "Hakka Noodles", description: "Stir-fried noodles with vegetables and soy sauce",
    price: 10.99, is_vegetarian: true, is_vegan: true, is_gluten_free: false, is_spicy: false, spice_level: 1,
    calories: 380, protein_g: 10, carbs_g: 56, fat_g: 12, fiber_g: 3,
    mood_tags: ["comfort", "filling"], keywords: ["noodles", "hakka", "stir-fry", "soy", "vegetables"], sort_order: 1,
  },
  {
    category_slug: "ic-noodles-rice", name: "Chicken Fried Rice", description: "Wok-tossed rice with chicken, eggs, and vegetables",
    price: 12.99, is_vegetarian: false, is_vegan: false, is_gluten_free: true, is_spicy: false, spice_level: 1,
    calories: 440, protein_g: 22, carbs_g: 52, fat_g: 16, fiber_g: 2,
    mood_tags: ["comfort", "filling"], keywords: ["fried", "rice", "chicken", "wok", "eggs"], sort_order: 2,
  },
  {
    category_slug: "ic-noodles-rice", name: "Schezwan Noodles", description: "Spicy noodles tossed in fiery Schezwan sauce with vegetables",
    price: 11.99, is_vegetarian: true, is_vegan: true, is_gluten_free: false, is_spicy: true, spice_level: 4,
    calories: 400, protein_g: 10, carbs_g: 56, fat_g: 14, fiber_g: 3,
    mood_tags: ["spicy", "filling"], keywords: ["schezwan", "noodles", "spicy", "hot", "szechuan"], sort_order: 3,
  },

  // ===== STREET FOOD — CHAAT =====
  {
    category_slug: "sf-chaat", name: "Pani Puri (6 pcs)", description: "Crispy hollow puri filled with tangy mint water and chickpeas",
    price: 6.99, is_vegetarian: true, is_vegan: true, is_gluten_free: false, is_spicy: true, spice_level: 2,
    calories: 180, protein_g: 4, carbs_g: 28, fat_g: 6, fiber_g: 2,
    mood_tags: ["light", "refreshing"], keywords: ["pani", "puri", "chaat", "tangy", "mint", "street-food"], sort_order: 1,
  },
  {
    category_slug: "sf-chaat", name: "Bhel Puri", description: "Puffed rice mixed with chutneys, onions, tomatoes and sev",
    price: 6.49, is_vegetarian: true, is_vegan: true, is_gluten_free: false, is_spicy: false, spice_level: 1,
    calories: 220, protein_g: 4, carbs_g: 36, fat_g: 8, fiber_g: 2,
    mood_tags: ["light", "refreshing"], keywords: ["bhel", "chaat", "puffed-rice", "crunchy", "tangy"], sort_order: 2,
  },
  {
    category_slug: "sf-chaat", name: "Dahi Puri", description: "Crispy puris topped with yogurt, chutneys, and pomegranate",
    price: 7.49, is_vegetarian: true, is_vegan: false, is_gluten_free: false, is_spicy: false, spice_level: 1,
    calories: 240, protein_g: 6, carbs_g: 32, fat_g: 10, fiber_g: 2,
    mood_tags: ["light", "refreshing", "sweet"], keywords: ["dahi", "puri", "yogurt", "chaat", "sweet"], sort_order: 3,
  },
  {
    category_slug: "sf-chaat", name: "Papdi Chaat", description: "Crispy wafers with chickpeas, yogurt, and tamarind chutney",
    price: 7.99, is_vegetarian: true, is_vegan: false, is_gluten_free: false, is_spicy: false, spice_level: 1,
    calories: 260, protein_g: 6, carbs_g: 34, fat_g: 12, fiber_g: 3,
    mood_tags: ["light", "comfort"], keywords: ["papdi", "chaat", "crispy", "yogurt", "tamarind"], sort_order: 4,
  },

  // ===== STREET FOOD — WRAPS & ROLLS =====
  {
    category_slug: "sf-wraps-rolls", name: "Chicken Kathi Roll", description: "Grilled chicken wrapped in paratha with onions and green chutney",
    price: 9.99, is_vegetarian: false, is_vegan: false, is_gluten_free: false, is_spicy: true, spice_level: 2,
    calories: 380, protein_g: 24, carbs_g: 36, fat_g: 14, fiber_g: 2,
    mood_tags: ["filling"], keywords: ["kathi", "roll", "chicken", "wrap", "paratha"], sort_order: 1,
  },
  {
    category_slug: "sf-wraps-rolls", name: "Paneer Kathi Roll", description: "Spiced paneer wrapped in flaky paratha with mint chutney",
    price: 8.99, is_vegetarian: true, is_vegan: false, is_gluten_free: false, is_spicy: false, spice_level: 1,
    calories: 360, protein_g: 16, carbs_g: 38, fat_g: 16, fiber_g: 2,
    mood_tags: ["filling", "comfort"], keywords: ["kathi", "roll", "paneer", "wrap", "vegetarian"], sort_order: 2,
  },

  // ===== DESSERTS =====
  {
    category_slug: "d-traditional", name: "Gulab Jamun (3 pcs)", description: "Deep-fried milk dumplings soaked in rose-cardamom syrup",
    price: 5.99, is_vegetarian: true, is_vegan: false, is_gluten_free: false, is_spicy: false, spice_level: 0,
    calories: 380, protein_g: 6, carbs_g: 56, fat_g: 14, fiber_g: 0,
    mood_tags: ["sweet", "celebratory", "comfort"], keywords: ["gulab", "jamun", "sweet", "dessert", "syrup"], sort_order: 1,
  },
  {
    category_slug: "d-traditional", name: "Ras Malai (2 pcs)", description: "Soft paneer patties in sweet saffron-cardamom milk",
    price: 6.99, is_vegetarian: true, is_vegan: false, is_gluten_free: true, is_spicy: false, spice_level: 0,
    calories: 320, protein_g: 10, carbs_g: 42, fat_g: 12, fiber_g: 0,
    mood_tags: ["sweet", "celebratory", "light"], keywords: ["ras", "malai", "saffron", "milk", "dessert"], sort_order: 2,
  },
  {
    category_slug: "d-traditional", name: "Kheer", description: "Creamy rice pudding with cardamom, nuts and saffron",
    price: 5.49, is_vegetarian: true, is_vegan: false, is_gluten_free: true, is_spicy: false, spice_level: 0,
    calories: 280, protein_g: 8, carbs_g: 44, fat_g: 8, fiber_g: 1,
    mood_tags: ["sweet", "comfort"], keywords: ["kheer", "rice", "pudding", "cardamom", "dessert"], sort_order: 3,
  },
  {
    category_slug: "d-traditional", name: "Jalebi (4 pcs)", description: "Crispy, pretzel-shaped sweets soaked in saffron sugar syrup",
    price: 4.99, is_vegetarian: true, is_vegan: false, is_gluten_free: false, is_spicy: false, spice_level: 0,
    calories: 350, protein_g: 4, carbs_g: 58, fat_g: 12, fiber_g: 0,
    mood_tags: ["sweet", "celebratory"], keywords: ["jalebi", "sweet", "crispy", "saffron", "syrup"], sort_order: 4,
  },
  {
    category_slug: "d-traditional", name: "Gajar Ka Halwa", description: "Warm carrot pudding with ghee, nuts, and cardamom",
    price: 5.99, is_vegetarian: true, is_vegan: false, is_gluten_free: true, is_spicy: false, spice_level: 0,
    calories: 340, protein_g: 6, carbs_g: 48, fat_g: 14, fiber_g: 3,
    mood_tags: ["sweet", "comfort"], keywords: ["gajar", "halwa", "carrot", "warm", "dessert"], sort_order: 5,
  },

  // ===== BEVERAGES — HOT =====
  {
    category_slug: "b-hot", name: "Masala Chai", description: "Spiced Indian tea with ginger, cardamom, and cinnamon",
    price: 3.49, is_vegetarian: true, is_vegan: false, is_gluten_free: true, is_spicy: false, spice_level: 0,
    calories: 80, protein_g: 2, carbs_g: 12, fat_g: 2, fiber_g: 0,
    mood_tags: ["comfort", "refreshing"], keywords: ["chai", "tea", "masala", "spiced", "hot"], sort_order: 1,
  },
  {
    category_slug: "b-hot", name: "Filter Coffee", description: "Strong South Indian filter coffee with frothy milk",
    price: 3.99, is_vegetarian: true, is_vegan: false, is_gluten_free: true, is_spicy: false, spice_level: 0,
    calories: 90, protein_g: 2, carbs_g: 10, fat_g: 4, fiber_g: 0,
    mood_tags: ["refreshing"], keywords: ["coffee", "filter", "south-indian", "strong", "milk"], sort_order: 2,
  },

  // ===== BEVERAGES — COLD =====
  {
    category_slug: "b-cold", name: "Mango Lassi", description: "Thick, creamy yogurt smoothie blended with Alphonso mango",
    price: 4.99, is_vegetarian: true, is_vegan: false, is_gluten_free: true, is_spicy: false, spice_level: 0,
    calories: 220, protein_g: 6, carbs_g: 38, fat_g: 4, fiber_g: 1,
    mood_tags: ["refreshing", "sweet"], keywords: ["lassi", "mango", "yogurt", "smoothie", "cold"], sort_order: 1,
  },
  {
    category_slug: "b-cold", name: "Sweet Lassi", description: "Traditional yogurt drink sweetened with sugar and rosewater",
    price: 3.99, is_vegetarian: true, is_vegan: false, is_gluten_free: true, is_spicy: false, spice_level: 0,
    calories: 180, protein_g: 6, carbs_g: 30, fat_g: 4, fiber_g: 0,
    mood_tags: ["refreshing", "sweet"], keywords: ["lassi", "sweet", "yogurt", "rosewater", "cold"], sort_order: 2,
  },
  {
    category_slug: "b-cold", name: "Masala Lemonade", description: "Fresh lemonade with roasted cumin, mint, and black salt",
    price: 3.99, is_vegetarian: true, is_vegan: true, is_gluten_free: true, is_spicy: false, spice_level: 1,
    calories: 60, protein_g: 0, carbs_g: 16, fat_g: 0, fiber_g: 0,
    mood_tags: ["refreshing", "light", "healthy"], keywords: ["lemonade", "masala", "cumin", "mint", "fresh"], sort_order: 3,
  },
];

// ============================================
// SQL INSERT GENERATOR
// Use this to generate seed SQL for Supabase
// ============================================
export function generateSeedSQL(): string {
  let sql = "-- ============================================\n";
  sql += "-- Desi Quick Bite — Seed Data\n";
  sql += "-- ============================================\n\n";

  // Insert cuisines
  sql += "-- Cuisines\n";
  for (const c of cuisines) {
    sql += `INSERT INTO cuisines (name, slug, image_url, sort_order) VALUES ('${c.name}', '${c.slug}', '${c.image_url}', ${c.sort_order});\n`;
  }

  sql += "\n-- Categories\n";
  for (const cat of categories) {
    sql += `INSERT INTO categories (cuisine_id, name, slug, sort_order) VALUES ((SELECT id FROM cuisines WHERE slug = '${cat.cuisine_slug}'), '${cat.name}', '${cat.slug}', ${cat.sort_order});\n`;
  }

  sql += "\n-- Menu Items\n";
  for (const item of menuItems) {
    const moodTags = `'{${item.mood_tags.map((t) => `"${t}"`).join(",")}}'`;
    const kw = `'{${item.keywords.map((k) => `"${k}"`).join(",")}}'`;
    sql += `INSERT INTO menu_items (category_id, name, description, price, is_vegetarian, is_vegan, is_gluten_free, is_spicy, spice_level, calories, protein_g, carbs_g, fat_g, fiber_g, mood_tags, keywords, sort_order) VALUES ((SELECT id FROM categories WHERE slug = '${item.category_slug}'), '${item.name.replace(/'/g, "''")}', '${item.description.replace(/'/g, "''")}', ${item.price}, ${item.is_vegetarian}, ${item.is_vegan}, ${item.is_gluten_free}, ${item.is_spicy}, ${item.spice_level}, ${item.calories}, ${item.protein_g}, ${item.carbs_g}, ${item.fat_g}, ${item.fiber_g}, ${moodTags}, ${kw}, ${item.sort_order});\n`;
  }

  return sql;
}

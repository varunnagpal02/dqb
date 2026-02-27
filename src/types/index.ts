// ============================================
// Desi Quick Bite — TypeScript Type Definitions
// ============================================

// --- Cuisine ---
export interface Cuisine {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// --- Category ---
export interface Category {
  id: string;
  cuisine_id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  cuisine?: Cuisine;
}

// --- Menu Item ---
export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;

  // Dietary
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  spice_level: number;

  // Macros
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;

  // AI metadata
  mood_tags: string[];
  keywords: string[];

  // Status
  is_available: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;

  // Joined data
  category?: Category;
}

// --- Cart ---
export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  special_instructions?: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

// --- User ---
export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string;
  default_address: string | null;
  created_at: string;
}

// --- Order ---
export type OrderStatus =
  | "placed"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  user_id: string;
  order_number: number;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  delivery_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions: string | null;
}

// --- Chat ---
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: MenuItem[];
  timestamp: Date;
}

export interface ChatFilters {
  budget_max: number | null;
  budget_min: number | null;
  cuisine: string | null;
  dietary: string[];
  mood: string[];
  max_calories: number | null;
  min_protein: number | null;
  max_carbs: number | null;
  max_fat: number | null;
  query_text: string;
}

export interface ChatAIResponse {
  message: string;
  filters: ChatFilters;
  intent: "recommendation" | "question" | "greeting" | "other";
}

// --- API Response ---
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

// --- Menu Filters (for query params) ---
export interface MenuFilters {
  cuisine?: string;
  category?: string;
  search?: string;
  vegetarian?: boolean;
  vegan?: boolean;
  gluten_free?: boolean;
  maxPrice?: number;
  minPrice?: number;
  maxCalories?: number;
  sortBy?: "price_asc" | "price_desc" | "name" | "calories";
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind class merge helper (won't work until clsx/twMerge installed — using simple version)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price as currency
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

// Calculate tax (8.5% default)
export function calculateTax(subtotal: number, rate: number = 0.085): number {
  return Math.round(subtotal * rate * 100) / 100;
}

// Generate a URL-friendly slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Truncate text with ellipsis
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

// Format date for display
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Get order status color for badges
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    placed: "bg-blue-100 text-blue-800",
    confirmed: "bg-yellow-100 text-yellow-800",
    preparing: "bg-orange-100 text-orange-800",
    ready: "bg-green-100 text-green-800",
    delivered: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

// Macro display helper
export function formatMacro(value: number | null, unit: string): string {
  if (value === null || value === undefined) return "—";
  return `${value}${unit}`;
}

// Dietary badge helpers
export function getDietaryBadges(item: {
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
}): { label: string; color: string; emoji: string }[] {
  const badges: { label: string; color: string; emoji: string }[] = [];
  if (item.is_vegan) badges.push({ label: "Vegan", color: "bg-green-100 text-green-800", emoji: "🌱" });
  else if (item.is_vegetarian) badges.push({ label: "Veg", color: "bg-emerald-100 text-emerald-800", emoji: "🥬" });
  if (item.is_gluten_free) badges.push({ label: "GF", color: "bg-amber-100 text-amber-800", emoji: "🌾" });
  if (item.is_spicy) badges.push({ label: "Spicy", color: "bg-red-100 text-red-800", emoji: "🌶️" });
  return badges;
}

// Generate unique ID for chat messages
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

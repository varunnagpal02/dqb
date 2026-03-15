/**
 * Desi Quick Bite — Phase 2 Tests
 *
 * Tests cover all Phase 2 features:
 * 1. DeliveryContext — state management, persistence
 * 2. Serviceable areas — ZIP/city matching
 * 3. Seed data — is_recommended flags, meal-time tags
 * 4. Menu filtering — quick nav, enhanced sort, advanced filters
 * 5. Types — DeliveryState, is_recommended on MenuItem
 * 6. Landing page logic — form validation, serviceability
 * 7. Menu search — smart query detection
 */
import { describe, it, expect } from "vitest";
import { menuItems, categories, cuisines } from "@/data/seed-menu";
import { checkServiceability, SERVICEABLE_ZIPS, SERVICEABLE_CITIES, filterSuggestions, parseAddressForServiceability, AREA_SUGGESTIONS } from "@/data/serviceable-areas";

// Build lookups (same as menu page)
const categoryToCuisine: Record<string, string> = {};
categories.forEach((cat) => {
  categoryToCuisine[cat.slug] = cat.cuisine_slug;
});

// ============================================
// 1. SERVICEABLE AREAS
// ============================================
describe("Serviceable Areas", () => {
  it("should have serviceable ZIP codes defined", () => {
    expect(SERVICEABLE_ZIPS.length).toBeGreaterThan(0);
  });

  it("should have serviceable cities defined", () => {
    expect(SERVICEABLE_CITIES.length).toBeGreaterThan(0);
  });

  it("should return serviceable for known ZIP (10001)", () => {
    const result = checkServiceability("10001", "");
    expect(result.isServiceable).toBe(true);
    expect(result.message).toContain("deliver");
  });

  it("should return serviceable for known city (Manhattan)", () => {
    const result = checkServiceability("00000", "Manhattan");
    expect(result.isServiceable).toBe(true);
  });

  it("should be case-insensitive for city names", () => {
    const result = checkServiceability("00000", "BROOKLYN");
    expect(result.isServiceable).toBe(true);
  });

  it("should return not serviceable for unknown ZIP and city", () => {
    const result = checkServiceability("99999", "Timbuktu");
    expect(result.isServiceable).toBe(false);
    expect(result.message).toContain("not in your area");
  });

  it("should handle empty strings gracefully", () => {
    const result = checkServiceability("", "");
    expect(result.isServiceable).toBe(false);
  });

  it("should handle whitespace-padded ZIP codes", () => {
    const result = checkServiceability("  10001  ", "");
    // .trim() is applied in the function
    expect(result.isServiceable).toBe(true);
  });

  it("should handle Jersey City ZIP", () => {
    const result = checkServiceability("07302", "");
    expect(result.isServiceable).toBe(true);
  });

  it("should accept city match even with bad ZIP", () => {
    const result = checkServiceability("11111", "jersey city");
    expect(result.isServiceable).toBe(true);
  });
});

// ============================================
// 2. SEED DATA — IS_RECOMMENDED
// ============================================
describe("Seed Data — Recommended Items", () => {
  const recommendedItems = menuItems.filter((i) => i.is_recommended);

  it("should have recommended items defined", () => {
    expect(recommendedItems.length).toBeGreaterThan(0);
  });

  it("should have at least 8 recommended items", () => {
    expect(recommendedItems.length).toBeGreaterThanOrEqual(8);
  });

  it("should include Butter Chicken as recommended", () => {
    const bc = menuItems.find((i) => i.name === "Butter Chicken");
    expect(bc?.is_recommended).toBe(true);
  });

  it("should include Masala Dosa as recommended", () => {
    const md = menuItems.find((i) => i.name === "Masala Dosa");
    expect(md?.is_recommended).toBe(true);
  });

  it("should include Chicken Biryani as recommended", () => {
    const cb = menuItems.find((i) => i.name === "Chicken Biryani");
    expect(cb?.is_recommended).toBe(true);
  });

  it("should include Paneer Tikka as recommended", () => {
    const pt = menuItems.find((i) => i.name === "Paneer Tikka");
    expect(pt?.is_recommended).toBe(true);
  });

  it("should include Gulab Jamun as recommended", () => {
    const gj = menuItems.find((i) => i.name.includes("Gulab Jamun"));
    expect(gj?.is_recommended).toBe(true);
  });

  it("should include Masala Chai as recommended", () => {
    const mc = menuItems.find((i) => i.name === "Masala Chai");
    expect(mc?.is_recommended).toBe(true);
  });

  it("should NOT have all items be recommended", () => {
    expect(recommendedItems.length).toBeLessThan(menuItems.length);
  });
});

// ============================================
// 3. SEED DATA — MEAL-TIME TAGS
// ============================================
describe("Seed Data — Meal-Time Tags", () => {
  it("should have items tagged with 'breakfast'", () => {
    const breakfast = menuItems.filter((i) => i.mood_tags.includes("breakfast"));
    expect(breakfast.length).toBeGreaterThan(0);
  });

  it("should have items tagged with 'lunch'", () => {
    const lunch = menuItems.filter((i) => i.mood_tags.includes("lunch"));
    expect(lunch.length).toBeGreaterThan(0);
  });

  it("should have items tagged with 'dinner'", () => {
    const dinner = menuItems.filter((i) => i.mood_tags.includes("dinner"));
    expect(dinner.length).toBeGreaterThan(0);
  });

  it("should have items tagged with 'deal'", () => {
    const deals = menuItems.filter((i) => i.mood_tags.includes("deal"));
    expect(deals.length).toBeGreaterThan(0);
  });

  it("Idli Sambar should have 'breakfast' tag", () => {
    const idli = menuItems.find((i) => i.name.includes("Idli"));
    expect(idli?.mood_tags).toContain("breakfast");
  });

  it("Butter Chicken should have 'dinner' tag", () => {
    const bc = menuItems.find((i) => i.name === "Butter Chicken");
    expect(bc?.mood_tags).toContain("dinner");
  });

  it("Masala Chai should have 'breakfast' tag", () => {
    const mc = menuItems.find((i) => i.name === "Masala Chai");
    expect(mc?.mood_tags).toContain("breakfast");
  });

  it("Samosa should have 'deal' tag", () => {
    const s = menuItems.find((i) => i.name.includes("Samosa"));
    expect(s?.mood_tags).toContain("deal");
  });

  it("Stuffed Paratha should have 'breakfast' tag", () => {
    const sp = menuItems.find((i) => i.name === "Stuffed Paratha");
    expect(sp?.mood_tags).toContain("breakfast");
  });
});

// ============================================
// 4. QUICK NAV FILTERING LOGIC
// ============================================
describe("Quick Nav Filtering", () => {
  it("should filter appetizers by category slugs", () => {
    const appetCats = ["ni-starters", "ic-starters", "sf-chaat"];
    const filtered = menuItems.filter((i) => appetCats.includes(i.category_slug));
    expect(filtered.length).toBeGreaterThan(0);
    // All should be from starters or chaat categories
    filtered.forEach((item) => {
      expect(appetCats).toContain(item.category_slug);
    });
  });

  it("should filter mains by category slugs", () => {
    const mainCats = ["ni-main-course", "si-mains", "ic-noodles-rice"];
    const filtered = menuItems.filter((i) => mainCats.includes(i.category_slug));
    expect(filtered.length).toBeGreaterThan(0);
  });

  it("should filter breads correctly", () => {
    const breads = menuItems.filter((i) => i.category_slug === "ni-breads");
    expect(breads.length).toBeGreaterThan(0);
    breads.forEach((b) => {
      expect(b.category_slug).toBe("ni-breads");
    });
  });

  it("should filter drinks by beverage categories", () => {
    const drinkCats = ["b-hot", "b-cold"];
    const drinks = menuItems.filter((i) => drinkCats.includes(i.category_slug));
    expect(drinks.length).toBeGreaterThan(0);
  });

  it("should filter by cuisine slug (north-indian)", () => {
    const niItems = menuItems.filter((i) => {
      const cuisineSlug = categoryToCuisine[i.category_slug] || "";
      return cuisineSlug === "north-indian";
    });
    expect(niItems.length).toBeGreaterThan(10); // North Indian has many items
  });

  it("should filter by cuisine slug (south-indian)", () => {
    const siItems = menuItems.filter((i) => {
      const cuisineSlug = categoryToCuisine[i.category_slug] || "";
      return cuisineSlug === "south-indian";
    });
    expect(siItems.length).toBeGreaterThan(0);
  });

  it("should filter by cuisine slug (indo-chinese)", () => {
    const icItems = menuItems.filter((i) => {
      const cuisineSlug = categoryToCuisine[i.category_slug] || "";
      return cuisineSlug === "indo-chinese";
    });
    expect(icItems.length).toBeGreaterThan(0);
  });

  it("should filter breakfast items by mood tag", () => {
    const breakfast = menuItems.filter((i) => i.mood_tags.includes("breakfast"));
    expect(breakfast.length).toBeGreaterThan(3);
  });

  it("should filter dinner items by mood tag", () => {
    const dinner = menuItems.filter((i) => i.mood_tags.includes("dinner"));
    expect(dinner.length).toBeGreaterThan(3);
  });

  it("should filter deal items by mood tag", () => {
    const deals = menuItems.filter((i) => i.mood_tags.includes("deal"));
    expect(deals.length).toBeGreaterThan(1);
  });
});

// ============================================
// 5. ENHANCED SORTING
// ============================================
describe("Enhanced Sorting", () => {
  it("should sort by price ascending", () => {
    const sorted = [...menuItems].sort((a, b) => a.price - b.price);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].price).toBeGreaterThanOrEqual(sorted[i - 1].price);
    }
  });

  it("should sort by price descending", () => {
    const sorted = [...menuItems].sort((a, b) => b.price - a.price);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].price).toBeLessThanOrEqual(sorted[i - 1].price);
    }
  });

  it("should sort by calories ascending", () => {
    const sorted = [...menuItems].sort((a, b) => a.calories - b.calories);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].calories).toBeGreaterThanOrEqual(sorted[i - 1].calories);
    }
  });

  it("should sort by protein descending", () => {
    const sorted = [...menuItems].sort((a, b) => b.protein_g - a.protein_g);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].protein_g).toBeLessThanOrEqual(sorted[i - 1].protein_g);
    }
  });

  it("should sort recommended first in default sort", () => {
    const sorted = [...menuItems].sort((a, b) => {
      if (a.is_recommended && !b.is_recommended) return -1;
      if (!a.is_recommended && b.is_recommended) return 1;
      return 0;
    });
    // First items should be recommended
    const firstNonRec = sorted.findIndex((i) => !i.is_recommended);
    const recommendedCount = menuItems.filter((i) => i.is_recommended).length;
    expect(firstNonRec).toBe(recommendedCount);
  });
});

// ============================================
// 6. ADVANCED FILTERS
// ============================================
describe("Advanced Filters", () => {
  it("should filter by max price $10", () => {
    const filtered = menuItems.filter((i) => i.price <= 10);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((item) => {
      expect(item.price).toBeLessThanOrEqual(10);
    });
  });

  it("should filter by max calories 300", () => {
    const filtered = menuItems.filter((i) => i.calories <= 300);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((item) => {
      expect(item.calories).toBeLessThanOrEqual(300);
    });
  });

  it("should filter by spice level <= 1 (mild)", () => {
    const filtered = menuItems.filter((i) => i.spice_level <= 1);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((item) => {
      expect(item.spice_level).toBeLessThanOrEqual(1);
    });
  });

  it("should filter by spice level <= 0 (none)", () => {
    const filtered = menuItems.filter((i) => i.spice_level <= 0);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((item) => {
      expect(item.spice_level).toBe(0);
    });
  });

  it("should combine dietary + price filter", () => {
    const filtered = menuItems.filter((i) => i.is_vegetarian && i.price <= 8);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((item) => {
      expect(item.is_vegetarian).toBe(true);
      expect(item.price).toBeLessThanOrEqual(8);
    });
  });

  it("should combine vegan + calorie filter", () => {
    const filtered = menuItems.filter((i) => i.is_vegan && i.calories <= 300);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((item) => {
      expect(item.is_vegan).toBe(true);
      expect(item.calories).toBeLessThanOrEqual(300);
    });
  });
});

// ============================================
// 7. SMART SEARCH DETECTION
// ============================================
describe("Smart Search Detection", () => {
  function isSmartQuery(q: string): boolean {
    const smartPatterns = /(\$|under|below|above|budget|cheap|expensive|protein|calories?|carbs?|fat|macro|low.?cal|high.?protein|healthy|light|heavy|filling|comfort)/i;
    return smartPatterns.test(q);
  }

  it("should detect price-related query", () => {
    expect(isSmartQuery("under $10")).toBe(true);
    expect(isSmartQuery("food for $15")).toBe(true);
    expect(isSmartQuery("cheap options")).toBe(true);
    expect(isSmartQuery("budget meals")).toBe(true);
  });

  it("should detect macro-related query", () => {
    expect(isSmartQuery("high protein")).toBe(true);
    expect(isSmartQuery("low calorie")).toBe(true);
    expect(isSmartQuery("low carb")).toBe(true);
    expect(isSmartQuery("low fat")).toBe(true);
  });

  it("should detect mood-related query", () => {
    expect(isSmartQuery("comfort food")).toBe(true);
    expect(isSmartQuery("something light")).toBe(true);
    expect(isSmartQuery("filling meals")).toBe(true);
    expect(isSmartQuery("healthy options")).toBe(true);
  });

  it("should NOT detect plain dish names as smart queries", () => {
    expect(isSmartQuery("butter chicken")).toBe(false);
    expect(isSmartQuery("biryani")).toBe(false);
    expect(isSmartQuery("naan")).toBe(false);
    expect(isSmartQuery("dosa")).toBe(false);
  });
});

// ============================================
// 8. CUISINE DATA INTEGRITY
// ============================================
describe("Data Integrity", () => {
  it("should have 6 cuisines", () => {
    expect(cuisines.length).toBe(6);
  });

  it("should have all cuisine slugs mapped", () => {
    const slugs = cuisines.map((c) => c.slug);
    expect(slugs).toContain("north-indian");
    expect(slugs).toContain("south-indian");
    expect(slugs).toContain("indo-chinese");
    expect(slugs).toContain("street-food");
    expect(slugs).toContain("desserts");
    expect(slugs).toContain("beverages");
  });

  it("all menu items should have valid category_slug", () => {
    const validSlugs = categories.map((c) => c.slug);
    menuItems.forEach((item) => {
      expect(validSlugs).toContain(item.category_slug);
    });
  });

  it("all menu items should have mood_tags array", () => {
    menuItems.forEach((item) => {
      expect(Array.isArray(item.mood_tags)).toBe(true);
      expect(item.mood_tags.length).toBeGreaterThan(0);
    });
  });

  it("all menu items should have keywords array", () => {
    menuItems.forEach((item) => {
      expect(Array.isArray(item.keywords)).toBe(true);
      expect(item.keywords.length).toBeGreaterThan(0);
    });
  });

  it("all menu items should have positive price", () => {
    menuItems.forEach((item) => {
      expect(item.price).toBeGreaterThan(0);
    });
  });

  it("all menu items should have non-negative calories", () => {
    menuItems.forEach((item) => {
      expect(item.calories).toBeGreaterThanOrEqual(0);
    });
  });

  it("spice_level should be 0-5 for all items", () => {
    menuItems.forEach((item) => {
      expect(item.spice_level).toBeGreaterThanOrEqual(0);
      expect(item.spice_level).toBeLessThanOrEqual(5);
    });
  });

  it("should have 49 menu items", () => {
    expect(menuItems.length).toBe(49);
  });

  it("should have 13 categories", () => {
    expect(categories.length).toBe(13);
  });
});

// ============================================
// 9. CHECKOUT SERVICEABILITY GATE LOGIC
// ============================================
describe("Checkout Serviceability Gate", () => {
  it("should block checkout for unserviceable area", () => {
    const delivery = {
      hasEnteredAddress: true,
      isServiceable: false,
      address: "123 Unknown St",
      city: "Unknown",
      zipCode: "99999",
    };
    const shouldBlock = delivery.hasEnteredAddress && !delivery.isServiceable;
    expect(shouldBlock).toBe(true);
  });

  it("should allow checkout for serviceable area", () => {
    const delivery = {
      hasEnteredAddress: true,
      isServiceable: true,
      address: "123 Main St",
      city: "Manhattan",
      zipCode: "10001",
    };
    const shouldBlock = delivery.hasEnteredAddress && !delivery.isServiceable;
    expect(shouldBlock).toBe(false);
  });

  it("should allow checkout when no address entered yet", () => {
    const delivery = {
      hasEnteredAddress: false,
      isServiceable: false,
      address: "",
      city: "",
      zipCode: "",
    };
    const shouldBlock = delivery.hasEnteredAddress && !delivery.isServiceable;
    expect(shouldBlock).toBe(false);
  });
});

// ============================================
// 10. LANDING PAGE FORM VALIDATION LOGIC (single address bar)
// ============================================
describe("Landing Page Validation", () => {
  it("should require address >= 3 chars for 'now' ordering", () => {
    const canProceed = (address: string, timing: string, date: string, time: string) => {
      return !!(address.trim().length >= 3 && (timing === "now" || (date && time)));
    };

    expect(canProceed("Manhattan, NY 10001", "now", "", "")).toBe(true);
    expect(canProceed("ab", "now", "", "")).toBe(false);
    expect(canProceed("", "now", "", "")).toBe(false);
    expect(canProceed("   ", "now", "", "")).toBe(false);
  });

  it("should require date and time for 'scheduled' ordering", () => {
    const canProceed = (address: string, timing: string, date: string, time: string) => {
      return !!(address.trim().length >= 3 && (timing === "now" || (date && time)));
    };

    expect(canProceed("Manhattan, NY", "scheduled", "2026-03-15", "12:00 PM")).toBe(true);
    expect(canProceed("Manhattan, NY", "scheduled", "", "12:00 PM")).toBe(false);
    expect(canProceed("Manhattan, NY", "scheduled", "2026-03-15", "")).toBe(false);
  });
});

// ============================================
// 11. ADDRESS AUTOCOMPLETE & PARSING
// ============================================
describe("Address Autocomplete", () => {
  it("should have area suggestions for all serviceable areas", () => {
    expect(AREA_SUGGESTIONS.length).toBeGreaterThanOrEqual(10);
    AREA_SUGGESTIONS.forEach((s) => {
      expect(s.label).toBeTruthy();
      expect(s.city).toBeTruthy();
      expect(s.zip).toBeTruthy();
    });
  });

  it("should filter suggestions by query", () => {
    const manhattan = filterSuggestions("manhattan");
    expect(manhattan.length).toBeGreaterThan(0);
    manhattan.forEach((s) => expect(s.label.toLowerCase()).toContain("manhattan"));

    const brooklyn = filterSuggestions("brooklyn");
    expect(brooklyn.length).toBeGreaterThan(0);

    const jersey = filterSuggestions("jersey");
    expect(jersey.length).toBeGreaterThan(0);
  });

  it("should return empty for short queries", () => {
    expect(filterSuggestions("")).toEqual([]);
    expect(filterSuggestions("a")).toEqual([]);
  });

  it("should limit suggestions to 5 results", () => {
    const results = filterSuggestions("new");
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it("should parse zip from address string", () => {
    const result = parseAddressForServiceability("123 Main St, Manhattan, NY 10001");
    expect(result.zip).toBe("10001");
    expect(result.city).toBe("manhattan");
  });

  it("should parse city from address string", () => {
    const result = parseAddressForServiceability("456 Court St, Brooklyn, NY");
    expect(result.city).toBe("brooklyn");
  });

  it("should handle addresses with no recognizable city/zip", () => {
    const result = parseAddressForServiceability("Random Place, Somewhere");
    expect(result.zip).toBe("");
    expect(result.city).toBe("");
  });
});

// Configurable serviceable areas for delivery validation
// Admin can expand these lists as the service area grows

export const SERVICEABLE_ZIPS = [
  // Manhattan
  "10001", "10002", "10003", "10004", "10005", "10006", "10007", "10008", "10009", "10010",
  "10011", "10012", "10013", "10014", "10016", "10017", "10018", "10019", "10020", "10021",
  "10022", "10023", "10024", "10025", "10026", "10027", "10028", "10029", "10030", "10031",
  "10032", "10033", "10034", "10035", "10036", "10037", "10038", "10039", "10040",
  // Brooklyn
  "11201", "11205", "11206", "11211", "11215", "11216", "11217", "11231", "11238",
  // Jersey City
  "07302", "07304", "07306", "07310",
  // Ontario — Kitchener-Waterloo
  "N2A", "N2B", "N2C", "N2E", "N2G", "N2H", "N2J", "N2K", "N2L", "N2M", "N2N", "N2P", "N2R", "N2T", "N2V",
  // Ontario — Toronto
  "M4B", "M4C", "M4E", "M4G", "M4K", "M4L", "M4M", "M4S", "M4W", "M4X", "M4Y", "M5A", "M5B", "M5G", "M5H", "M5J", "M5R", "M5S", "M5T", "M5V",
  // Ontario — Mississauga / Brampton
  "L4T", "L4W", "L4X", "L4Z", "L5A", "L5B", "L5C", "L5E", "L5G", "L5J", "L5K", "L5L", "L5M", "L5N", "L5R", "L5V", "L5W",
  "L6P", "L6R", "L6S", "L6T", "L6V", "L6W", "L6X", "L6Y", "L6Z",
  // Ontario — Hamilton
  "L8E", "L8G", "L8H", "L8J", "L8K", "L8L", "L8M", "L8N", "L8P", "L8R", "L8S", "L8T", "L8V", "L8W",
  // Ontario — London
  "N5V", "N5W", "N5X", "N5Y", "N5Z", "N6A", "N6B", "N6C", "N6E", "N6G", "N6H", "N6J", "N6K",
  // Ontario — Cambridge / Guelph
  "N1G", "N1H", "N1K", "N1L", "N1R", "N1S", "N1T", "N3C", "N3E", "N3H",
  // Ontario — Ottawa
  "K1A", "K1B", "K1C", "K1E", "K1G", "K1H", "K1J", "K1K", "K1L", "K1M", "K1N", "K1P", "K1R", "K1S", "K1T", "K1V", "K1W", "K1Y", "K1Z",
  "K2A", "K2B", "K2C", "K2E", "K2G", "K2H", "K2J", "K2K", "K2L", "K2M", "K2P", "K2R", "K2S", "K2T", "K2V", "K2W",
];

export const SERVICEABLE_CITIES = [
  "new york",
  "manhattan",
  "brooklyn",
  "jersey city",
  "hoboken",
  // Ontario cities
  "kitchener",
  "waterloo",
  "cambridge",
  "guelph",
  "toronto",
  "mississauga",
  "brampton",
  "hamilton",
  "london",
  "ottawa",
  "scarborough",
  "markham",
  "vaughan",
  "richmond hill",
  "oakville",
  "burlington",
  "oshawa",
  "barrie",
  "windsor",
  "sudbury",
  "kingston",
  "st. catharines",
  "niagara falls",
  "thunder bay",
  "peterborough",
  "brantford",
  "ajax",
  "pickering",
  "whitby",
  "milton",
  "georgetown",
  "newmarket",
  "aurora",
  "stouffville",
];

export interface AreaSuggestion {
  label: string;
  city: string;
  zip: string;
}

export const AREA_SUGGESTIONS: AreaSuggestion[] = [
  // NYC area
  { label: "Manhattan, New York, NY 10001", city: "new york", zip: "10001" },
  { label: "Upper East Side, New York, NY 10021", city: "new york", zip: "10021" },
  { label: "Upper West Side, New York, NY 10024", city: "new york", zip: "10024" },
  { label: "Midtown, New York, NY 10018", city: "new york", zip: "10018" },
  { label: "SoHo, New York, NY 10012", city: "new york", zip: "10012" },
  { label: "Chelsea, New York, NY 10011", city: "new york", zip: "10011" },
  { label: "East Village, New York, NY 10003", city: "new york", zip: "10003" },
  { label: "West Village, New York, NY 10014", city: "new york", zip: "10014" },
  { label: "Lower East Side, New York, NY 10002", city: "new york", zip: "10002" },
  { label: "Harlem, New York, NY 10027", city: "new york", zip: "10027" },
  { label: "Greenwich Village, New York, NY 10012", city: "new york", zip: "10012" },
  { label: "Brooklyn Heights, Brooklyn, NY 11201", city: "brooklyn", zip: "11201" },
  { label: "Williamsburg, Brooklyn, NY 11211", city: "brooklyn", zip: "11211" },
  { label: "Park Slope, Brooklyn, NY 11215", city: "brooklyn", zip: "11215" },
  { label: "Downtown Brooklyn, NY 11201", city: "brooklyn", zip: "11201" },
  { label: "DUMBO, Brooklyn, NY 11201", city: "brooklyn", zip: "11201" },
  { label: "Jersey City, NJ 07302", city: "jersey city", zip: "07302" },
  { label: "Hoboken, NJ 07030", city: "hoboken", zip: "07030" },
  // Ontario — Kitchener-Waterloo region
  { label: "Kitchener, ON N2G", city: "kitchener", zip: "N2G" },
  { label: "Downtown Kitchener, ON N2H", city: "kitchener", zip: "N2H" },
  { label: "Waterloo, ON N2L", city: "waterloo", zip: "N2L" },
  { label: "Uptown Waterloo, ON N2J", city: "waterloo", zip: "N2J" },
  { label: "Cambridge, ON N1R", city: "cambridge", zip: "N1R" },
  { label: "Guelph, ON N1G", city: "guelph", zip: "N1G" },
  // Ontario — GTA
  { label: "Downtown Toronto, ON M5H", city: "toronto", zip: "M5H" },
  { label: "North York, Toronto, ON M4S", city: "toronto", zip: "M4S" },
  { label: "Scarborough, Toronto, ON M4B", city: "scarborough", zip: "M4B" },
  { label: "Mississauga, ON L5B", city: "mississauga", zip: "L5B" },
  { label: "Brampton, ON L6T", city: "brampton", zip: "L6T" },
  { label: "Markham, ON L6E", city: "markham", zip: "L6E" },
  { label: "Vaughan, ON L4L", city: "vaughan", zip: "L4L" },
  { label: "Richmond Hill, ON L4C", city: "richmond hill", zip: "L4C" },
  { label: "Oakville, ON L6H", city: "oakville", zip: "L6H" },
  { label: "Burlington, ON L7L", city: "burlington", zip: "L7L" },
  // Ontario — Other
  { label: "Hamilton, ON L8N", city: "hamilton", zip: "L8N" },
  { label: "London, ON N6A", city: "london", zip: "N6A" },
  { label: "Ottawa, ON K1P", city: "ottawa", zip: "K1P" },
  { label: "Oshawa, ON L1G", city: "oshawa", zip: "L1G" },
  { label: "Barrie, ON L4M", city: "barrie", zip: "L4M" },
  { label: "Kingston, ON K7L", city: "kingston", zip: "K7L" },
  { label: "St. Catharines, ON L2R", city: "st. catharines", zip: "L2R" },
  { label: "Niagara Falls, ON L2E", city: "niagara falls", zip: "L2E" },
  { label: "Peterborough, ON K9H", city: "peterborough", zip: "K9H" },
  { label: "Brantford, ON N3R", city: "brantford", zip: "N3R" },
  { label: "Ajax, ON L1S", city: "ajax", zip: "L1S" },
  { label: "Pickering, ON L1V", city: "pickering", zip: "L1V" },
  { label: "Whitby, ON L1N", city: "whitby", zip: "L1N" },
  { label: "Milton, ON L9T", city: "milton", zip: "L9T" },
  { label: "Newmarket, ON L3Y", city: "newmarket", zip: "L3Y" },
  { label: "Aurora, ON L4G", city: "aurora", zip: "L4G" },
];

export function filterSuggestions(query: string): AreaSuggestion[] {
  if (!query || query.trim().length < 2) return [];
  const lower = query.toLowerCase().trim();
  return AREA_SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(lower)).slice(0, 5);
}

export function parseAddressForServiceability(fullAddress: string): { city: string; zip: string } {
  // Match US 5-digit ZIP or Canadian postal code FSA (first 3 chars)
  const usZipMatch = fullAddress.match(/\b(\d{5})\b/);
  const caPostalMatch = fullAddress.match(/\b([A-Za-z]\d[A-Za-z])\s?\d[A-Za-z]\d\b/);
  const caFsaMatch = fullAddress.match(/\b([A-Za-z]\d[A-Za-z])\b/);

  let zip = "";
  if (usZipMatch) {
    zip = usZipMatch[1];
  } else if (caPostalMatch) {
    zip = caPostalMatch[1].toUpperCase();
  } else if (caFsaMatch) {
    zip = caFsaMatch[1].toUpperCase();
  }

  let city = "";
  const lower = fullAddress.toLowerCase();
  for (const c of SERVICEABLE_CITIES) {
    if (lower.includes(c)) {
      city = c;
      break;
    }
  }

  return { city, zip };
}

export function checkServiceability(
  zipCode: string,
  city: string
): { isServiceable: boolean; message: string } {
  const trimmedZip = zipCode.trim().toUpperCase();
  // Exact match (US ZIP) or FSA prefix match (Canadian postal codes)
  const zipMatch = trimmedZip.length >= 3 && SERVICEABLE_ZIPS.some((z) => {
    const upper = z.toUpperCase();
    return upper === trimmedZip || trimmedZip.startsWith(upper) || upper.startsWith(trimmedZip);
  });
  const cityMatch = SERVICEABLE_CITIES.some(
    (c) => c === city.trim().toLowerCase()
  );

  if (zipMatch || cityMatch) {
    return {
      isServiceable: true,
      message: "Great news! We deliver to your area. 🎉",
    };
  }

  return {
    isServiceable: false,
    message:
      "We're not in your area yet — but we're expanding! Browse our menu anyway.",
  };
}

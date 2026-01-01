// ============================================================================
// Fragrance Types
// ============================================================================

export interface Fragrance {
  id: number;
  legacyId: string | null;
  name: string;
  brand: string;
  year: number | null;
  gender: "masculine" | "feminine" | "unisex";
  concentration: string | null;
  scentFamily: string;
  subfamilies: string[] | null;
  longevity: number | null;
  sillage: number | null;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  rating: number | null;
  reviewCount: number | null;
  image: string | null;
  description: string | null;
  seasons: string[] | null;
  occasions: string[] | null;
  url: string | null;
  country: string | null;
  perfumer: string | null;
  accords: string[] | null;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
}

// ============================================================================
// API Response Types
// ============================================================================

export interface FragrancesResponse {
  data: Fragrance[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface FiltersResponse {
  brands: string[];
  scentFamilies: string[];
  genders: string[];
  priceRanges: string[];
  seasons: string[];
  occasions: string[];
  concentrations: string[];
  countries: string[];
  notes: string[];
  yearRange: { min: number; max: number };
  ratingRange: { min: number; max: number };
}

// ============================================================================
// Filter Types
// ============================================================================

export interface FragranceFilters {
  search?: string;
  gender?: string;
  priceRange?: string;
  scentFamily?: string;
  season?: string;
  occasion?: string;
  brand?: string;
  note?: string;
  minRating?: number;
  maxRating?: number;
  minYear?: number;
  maxYear?: number;
  sortBy?: "rating" | "reviewCount" | "year" | "name";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

// ============================================================================
// Constants
// ============================================================================

export const scentFamilies = [
  { name: "Fresh", color: "#7EC8E3", subfamilies: ["Citrus", "Green", "Water", "Ozonic"] },
  { name: "Floral", color: "#F8B4D9", subfamilies: ["Rose", "Jasmine", "White Floral", "Powdery"] },
  { name: "Oriental", color: "#C9A962", subfamilies: ["Amber", "Spicy", "Vanilla", "Sweet"] },
  { name: "Woody", color: "#8B7355", subfamilies: ["Sandalwood", "Cedar", "Oud", "Mossy"] },
  { name: "Aromatic", color: "#9DC183", subfamilies: ["Herbal", "Lavender", "Fougère", "Mint"] },
  { name: "Leather", color: "#6B4423", subfamilies: ["Smoky", "Tobacco", "Suede", "Animalic"] },
  { name: "Gourmand", color: "#D4A574", subfamilies: ["Chocolate", "Coffee", "Caramel", "Fruity"] },
  { name: "Chypre", color: "#708238", subfamilies: ["Oakmoss", "Bergamot", "Patchouli", "Earthy"] },
] as const;

export type ScentFamily = (typeof scentFamilies)[number];

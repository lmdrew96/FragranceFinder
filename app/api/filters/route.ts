import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { fragrances, notes } from "@/db/schema";
import { sql } from "drizzle-orm";

// ============================================================================
// Types
// ============================================================================

interface FilterOptions {
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
// GET /api/filters
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Get all distinct values in parallel
    const [
      brandsResult,
      scentFamiliesResult,
      concentrationsResult,
      countriesResult,
      yearRangeResult,
      ratingRangeResult,
      notesResult,
    ] = await Promise.all([
      // Distinct brands
      db
        .selectDistinct({ brand: fragrances.brand })
        .from(fragrances)
        .orderBy(fragrances.brand),

      // Distinct scent families
      db
        .selectDistinct({ scentFamily: fragrances.scentFamily })
        .from(fragrances)
        .orderBy(fragrances.scentFamily),

      // Distinct concentrations
      db
        .selectDistinct({ concentration: fragrances.concentration })
        .from(fragrances)
        .where(sql`${fragrances.concentration} IS NOT NULL`)
        .orderBy(fragrances.concentration),

      // Distinct countries
      db
        .selectDistinct({ country: fragrances.country })
        .from(fragrances)
        .where(sql`${fragrances.country} IS NOT NULL`)
        .orderBy(fragrances.country),

      // Year range
      db
        .select({
          min: sql<number>`MIN(${fragrances.year})`,
          max: sql<number>`MAX(${fragrances.year})`,
        })
        .from(fragrances),

      // Rating range
      db
        .select({
          min: sql<number>`MIN(${fragrances.rating})`,
          max: sql<number>`MAX(${fragrances.rating})`,
        })
        .from(fragrances),

      // All notes (for autocomplete)
      db
        .select({ name: notes.name })
        .from(notes)
        .orderBy(notes.name),
    ]);

    // Static values that we know from the schema/data
    const genders = ["masculine", "feminine", "unisex"];
    const priceRanges = ["$", "$$", "$$$", "$$$$"];
    const seasons = ["spring", "summer", "fall", "winter"];
    const occasions = [
      "Casual",
      "Daily Wear",
      "Date Night",
      "Evening Out",
      "Formal",
      "Office",
      "Special Occasion",
    ];

    const filters: FilterOptions = {
      brands: brandsResult.map((b) => b.brand),
      scentFamilies: scentFamiliesResult.map((s) => s.scentFamily),
      genders,
      priceRanges,
      seasons,
      occasions,
      concentrations: concentrationsResult
        .map((c) => c.concentration)
        .filter((c): c is string => c !== null),
      countries: countriesResult
        .map((c) => c.country)
        .filter((c): c is string => c !== null),
      notes: notesResult.map((n) => n.name),
      yearRange: {
        min: yearRangeResult[0]?.min || 1900,
        max: yearRangeResult[0]?.max || new Date().getFullYear(),
      },
      ratingRange: {
        min: ratingRangeResult[0]?.min || 0,
        max: ratingRangeResult[0]?.max || 5,
      },
    };

    return NextResponse.json(filters);
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter options" },
      { status: 500 }
    );
  }
}

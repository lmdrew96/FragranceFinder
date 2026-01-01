import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { fragrances, notes, fragranceNotes } from "@/db/schema";
import { eq, ilike, or, and, inArray, gte, lte, sql, desc, asc } from "drizzle-orm";

// ============================================================================
// Types
// ============================================================================

type SortField = "rating" | "reviewCount" | "year" | "name";
type SortOrder = "asc" | "desc";

interface FragranceWithNotes {
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
// GET /api/fragrances
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Filters
    const gender = searchParams.get("gender");
    const priceRange = searchParams.get("priceRange");
    const scentFamily = searchParams.get("scentFamily");
    const season = searchParams.get("season");
    const occasion = searchParams.get("occasion");
    const brand = searchParams.get("brand");
    const minRating = searchParams.get("minRating");
    const maxRating = searchParams.get("maxRating");
    const minYear = searchParams.get("minYear");
    const maxYear = searchParams.get("maxYear");

    // Search
    const search = searchParams.get("search");
    const noteSearch = searchParams.get("note");

    // Sorting
    const sortBy = (searchParams.get("sortBy") as SortField) || "rating";
    const sortOrder = (searchParams.get("sortOrder") as SortOrder) || "desc";

    // Build where conditions
    const conditions: ReturnType<typeof eq>[] = [];

    if (gender) {
      conditions.push(eq(fragrances.gender, gender as "masculine" | "feminine" | "unisex"));
    }

    if (priceRange) {
      conditions.push(eq(fragrances.priceRange, priceRange as "$" | "$$" | "$$$" | "$$$$"));
    }

    if (scentFamily) {
      conditions.push(eq(fragrances.scentFamily, scentFamily));
    }

    if (brand) {
      conditions.push(eq(fragrances.brand, brand));
    }

    if (season) {
      conditions.push(sql`${season} = ANY(${fragrances.seasons})`);
    }

    if (occasion) {
      conditions.push(sql`${occasion} = ANY(${fragrances.occasions})`);
    }

    if (minRating) {
      conditions.push(gte(fragrances.rating, parseFloat(minRating)));
    }

    if (maxRating) {
      conditions.push(lte(fragrances.rating, parseFloat(maxRating)));
    }

    if (minYear) {
      conditions.push(gte(fragrances.year, parseInt(minYear)));
    }

    if (maxYear) {
      conditions.push(lte(fragrances.year, parseInt(maxYear)));
    }

    if (search) {
      conditions.push(
        or(
          ilike(fragrances.name, `%${search}%`),
          ilike(fragrances.brand, `%${search}%`)
        )!
      );
    }

    // If searching by note, we need to join with the notes table
    let fragranceIds: number[] | undefined;
    if (noteSearch) {
      const matchingNotes = await db
        .select({ fragranceId: fragranceNotes.fragranceId })
        .from(fragranceNotes)
        .innerJoin(notes, eq(fragranceNotes.noteId, notes.id))
        .where(ilike(notes.name, `%${noteSearch}%`));

      fragranceIds = matchingNotes.map((n) => n.fragranceId);

      if (fragranceIds.length === 0) {
        // No fragrances match the note search
        return NextResponse.json({
          data: [],
          pagination: { total: 0, limit, offset, hasMore: false },
        });
      }

      conditions.push(inArray(fragrances.id, fragranceIds));
    }

    // Build sort order
    const sortColumn = {
      rating: fragrances.rating,
      reviewCount: fragrances.reviewCount,
      year: fragrances.year,
      name: fragrances.name,
    }[sortBy];

    const orderFn = sortOrder === "asc" ? asc : desc;

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(fragrances)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const total = countResult[0]?.count || 0;

    // Get fragrances
    const fragranceResults = await db
      .select()
      .from(fragrances)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderFn(sortColumn))
      .limit(limit)
      .offset(offset);

    // Get notes for each fragrance
    const fragranceIdsToFetch = fragranceResults.map((f) => f.id);

    const notesResults =
      fragranceIdsToFetch.length > 0
        ? await db
            .select({
              fragranceId: fragranceNotes.fragranceId,
              noteName: notes.name,
              noteType: fragranceNotes.noteType,
            })
            .from(fragranceNotes)
            .innerJoin(notes, eq(fragranceNotes.noteId, notes.id))
            .where(inArray(fragranceNotes.fragranceId, fragranceIdsToFetch))
        : [];

    // Group notes by fragrance
    const notesByFragrance = new Map<
      number,
      { top: string[]; middle: string[]; base: string[] }
    >();

    for (const note of notesResults) {
      if (!notesByFragrance.has(note.fragranceId)) {
        notesByFragrance.set(note.fragranceId, { top: [], middle: [], base: [] });
      }
      const fragranceNoteMap = notesByFragrance.get(note.fragranceId)!;
      fragranceNoteMap[note.noteType].push(note.noteName);
    }

    // Combine fragrances with notes
    const data: FragranceWithNotes[] = fragranceResults.map((f) => ({
      ...f,
      notes: notesByFragrance.get(f.id) || { top: [], middle: [], base: [] },
    }));

    return NextResponse.json({
      data,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching fragrances:", error);
    return NextResponse.json(
      { error: "Failed to fetch fragrances" },
      { status: 500 }
    );
  }
}

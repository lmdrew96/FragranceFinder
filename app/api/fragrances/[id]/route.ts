import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { fragrances, notes, fragranceNotes } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

// ============================================================================
// GET /api/fragrances/[id]
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fragranceId = parseInt(id);

    if (isNaN(fragranceId)) {
      return NextResponse.json(
        { error: "Invalid fragrance ID" },
        { status: 400 }
      );
    }

    // Get the fragrance
    const fragranceResults = await db
      .select()
      .from(fragrances)
      .where(eq(fragrances.id, fragranceId))
      .limit(1);

    if (fragranceResults.length === 0) {
      return NextResponse.json(
        { error: "Fragrance not found" },
        { status: 404 }
      );
    }

    const fragrance = fragranceResults[0];

    // Get notes for the fragrance
    const notesResults = await db
      .select({
        noteName: notes.name,
        noteType: fragranceNotes.noteType,
      })
      .from(fragranceNotes)
      .innerJoin(notes, eq(fragranceNotes.noteId, notes.id))
      .where(eq(fragranceNotes.fragranceId, fragranceId));

    // Group notes by type
    const fragranceNotesByType = {
      top: [] as string[],
      middle: [] as string[],
      base: [] as string[],
    };

    for (const note of notesResults) {
      fragranceNotesByType[note.noteType].push(note.noteName);
    }

    return NextResponse.json({
      ...fragrance,
      notes: fragranceNotesByType,
    });
  } catch (error) {
    console.error("Error fetching fragrance:", error);
    return NextResponse.json(
      { error: "Failed to fetch fragrance" },
      { status: 500 }
    );
  }
}

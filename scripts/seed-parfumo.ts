import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and, sql } from "drizzle-orm";
import * as schema from "../db/schema";
import { fragrances, notes, fragranceNotes, sourceEnum } from "../db/schema";

// Load environment variables from .env
dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const neonSql = neon(process.env.DATABASE_URL);
const db = drizzle(neonSql, { schema });

// ============================================================================
// Types for JSON Data
// ============================================================================

interface FragranceJSON {
  id: string;
  name: string;
  brand: string;
  year: number;
  gender: "masculine" | "feminine" | "unisex";
  concentration: string;
  scentFamily: string;
  subfamilies: string[];
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  longevity: number;
  sillage: number;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  seasons: string[];
  occasions: string[];
  url: string;
  country: string;
  perfumer: string;
  accords: string[];
  source: "fragrantica" | "parfumo";
}

interface ExistingFragrance {
  id: number;
  legacyId: string | null;
  name: string;
  brand: string;
  concentration: string | null;
  perfumer: string | null;
  source: "fragrantica" | "parfumo" | "both";
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Normalize a string for comparison (lowercase, remove special chars)
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Create a unique key for matching fragrances
 */
function createMatchKey(name: string, brand: string): string {
  return `${normalize(name)}::${normalize(brand)}`;
}

/**
 * Extract all unique notes from a set of fragrances
 */
function extractAllNotes(fragrancesData: FragranceJSON[]): Set<string> {
  const allNotes = new Set<string>();

  for (const frag of fragrancesData) {
    frag.notes.top.forEach((note) => allNotes.add(note));
    frag.notes.middle.forEach((note) => allNotes.add(note));
    frag.notes.base.forEach((note) => allNotes.add(note));
  }

  return allNotes;
}

/**
 * Batch insert helper with progress logging
 */
async function batchInsert<T>(
  items: T[],
  batchSize: number,
  insertFn: (batch: T[]) => Promise<void>,
  label: string
): Promise<void> {
  const total = items.length;
  let processed = 0;

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await insertFn(batch);
    processed += batch.length;
    console.log(
      `  ${label}: ${processed}/${total} (${Math.round((processed / total) * 100)}%)`
    );
  }
}

// ============================================================================
// Main Seed Function
// ============================================================================

async function seedParfumo() {
  console.log("🌱 Starting Parfumo merge...\n");

  // -------------------------------------------------------------------------
  // Step 1: Load Parfumo JSON
  // -------------------------------------------------------------------------
  console.log("📖 Reading parfumo_fragrances.json...");
  const jsonPath = path.join(process.cwd(), "parfumo_fragrances.json");
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const parfumoData: FragranceJSON[] = JSON.parse(rawData);
  console.log(`  Found ${parfumoData.length} Parfumo fragrances\n`);

  // -------------------------------------------------------------------------
  // Step 2: Load existing fragrances from database
  // -------------------------------------------------------------------------
  console.log("📖 Loading existing fragrances from database...");
  const existingFragrances = await db
    .select({
      id: fragrances.id,
      legacyId: fragrances.legacyId,
      name: fragrances.name,
      brand: fragrances.brand,
      concentration: fragrances.concentration,
      perfumer: fragrances.perfumer,
      source: fragrances.source,
    })
    .from(fragrances);

  console.log(`  Found ${existingFragrances.length} existing fragrances\n`);

  // Build a map of normalized key -> existing fragrance for fast lookups
  const existingMap = new Map<string, ExistingFragrance>();
  for (const frag of existingFragrances) {
    const key = createMatchKey(frag.name, frag.brand);
    existingMap.set(key, frag);
  }

  // -------------------------------------------------------------------------
  // Step 3: Load note ID map
  // -------------------------------------------------------------------------
  console.log("🗺️  Loading note ID map...");
  const allNotes = await db.select().from(notes);
  const noteIdMap = new Map<string, number>();
  for (const note of allNotes) {
    noteIdMap.set(note.name, note.id);
  }
  console.log(`  Loaded ${noteIdMap.size} existing notes\n`);

  // -------------------------------------------------------------------------
  // Step 4: Extract and insert any new notes from Parfumo data
  // -------------------------------------------------------------------------
  console.log("📝 Checking for new notes from Parfumo...");
  const parfumoNotes = extractAllNotes(parfumoData);
  const newNotes: string[] = [];
  for (const noteName of parfumoNotes) {
    if (!noteIdMap.has(noteName)) {
      newNotes.push(noteName);
    }
  }

  if (newNotes.length > 0) {
    console.log(`  Found ${newNotes.length} new notes to insert`);
    const notesToInsert = newNotes.map((name) => ({ name }));

    await batchInsert(
      notesToInsert,
      500,
      async (batch) => {
        await db.insert(notes).values(batch).onConflictDoNothing();
      },
      "New Notes"
    );

    // Refresh note ID map
    const refreshedNotes = await db.select().from(notes);
    noteIdMap.clear();
    for (const note of refreshedNotes) {
      noteIdMap.set(note.name, note.id);
    }
    console.log(`  Note map updated: ${noteIdMap.size} total notes\n`);
  } else {
    console.log("  No new notes to add\n");
  }

  // -------------------------------------------------------------------------
  // Step 5: Categorize Parfumo fragrances
  // -------------------------------------------------------------------------
  console.log("🔍 Categorizing Parfumo fragrances...");

  const toMerge: { parfumo: FragranceJSON; existing: ExistingFragrance }[] = [];
  const toInsert: FragranceJSON[] = [];
  let alreadyMerged = 0;

  for (const parfumoFrag of parfumoData) {
    const key = createMatchKey(parfumoFrag.name, parfumoFrag.brand);
    const existing = existingMap.get(key);

    if (existing) {
      // Check if already merged (source is 'both' or 'parfumo')
      if (existing.source === "both" || existing.source === "parfumo") {
        alreadyMerged++;
      } else {
        // Found a match that needs merging
        toMerge.push({ parfumo: parfumoFrag, existing });
      }
    } else {
      // No match, need to insert
      toInsert.push(parfumoFrag);
    }
  }

  console.log(`  Duplicates to merge: ${toMerge.length}`);
  console.log(`  New fragrances to add: ${toInsert.length}`);
  console.log(`  Already merged (skipped): ${alreadyMerged}\n`);

  // -------------------------------------------------------------------------
  // Step 6: Merge existing duplicates
  // -------------------------------------------------------------------------
  if (toMerge.length > 0) {
    console.log("🔄 Merging duplicates...");
    let mergedCount = 0;

    for (const { parfumo, existing } of toMerge) {
      // Build update object - only update fields that are empty in existing
      const updates: Partial<{
        source: "both";
        concentration: string;
        perfumer: string;
        updatedAt: Date;
      }> = {
        source: "both",
        updatedAt: new Date(),
      };

      // Fill in missing concentration
      if (!existing.concentration && parfumo.concentration) {
        updates.concentration = parfumo.concentration;
      }

      // Fill in missing perfumer
      if (!existing.perfumer && parfumo.perfumer) {
        updates.perfumer = parfumo.perfumer;
      }

      // Update the fragrance
      await db
        .update(fragrances)
        .set(updates)
        .where(eq(fragrances.id, existing.id));

      // -----------------------------------------------------------------------
      // Merge notes (add any Parfumo notes not already in Fragrantica record)
      // -----------------------------------------------------------------------
      // Get existing notes for this fragrance
      const existingNotes = await db
        .select({
          noteId: fragranceNotes.noteId,
          noteType: fragranceNotes.noteType,
        })
        .from(fragranceNotes)
        .where(eq(fragranceNotes.fragranceId, existing.id));

      const existingNoteKeys = new Set(
        existingNotes.map((n) => `${n.noteId}::${n.noteType}`)
      );

      const newNoteRelations: {
        fragranceId: number;
        noteId: number;
        noteType: "top" | "middle" | "base";
      }[] = [];

      // Check top notes
      for (const noteName of parfumo.notes.top) {
        const noteId = noteIdMap.get(noteName);
        if (noteId && !existingNoteKeys.has(`${noteId}::top`)) {
          newNoteRelations.push({
            fragranceId: existing.id,
            noteId,
            noteType: "top",
          });
        }
      }

      // Check middle notes
      for (const noteName of parfumo.notes.middle) {
        const noteId = noteIdMap.get(noteName);
        if (noteId && !existingNoteKeys.has(`${noteId}::middle`)) {
          newNoteRelations.push({
            fragranceId: existing.id,
            noteId,
            noteType: "middle",
          });
        }
      }

      // Check base notes
      for (const noteName of parfumo.notes.base) {
        const noteId = noteIdMap.get(noteName);
        if (noteId && !existingNoteKeys.has(`${noteId}::base`)) {
          newNoteRelations.push({
            fragranceId: existing.id,
            noteId,
            noteType: "base",
          });
        }
      }

      // Insert new note relationships
      if (newNoteRelations.length > 0) {
        await db
          .insert(fragranceNotes)
          .values(newNoteRelations)
          .onConflictDoNothing();
      }

      mergedCount++;
      if (mergedCount % 100 === 0 || mergedCount === toMerge.length) {
        console.log(
          `  Merged: ${mergedCount}/${toMerge.length} (${Math.round((mergedCount / toMerge.length) * 100)}%)`
        );
      }
    }

    console.log(`  ✓ Merged ${mergedCount} fragrances\n`);
  }

  // -------------------------------------------------------------------------
  // Step 7: Insert new Parfumo-only fragrances
  // -------------------------------------------------------------------------
  if (toInsert.length > 0) {
    console.log("💾 Inserting new Parfumo fragrances...");

    const fragrancesToInsert = toInsert.map((frag) => ({
      legacyId: frag.id,
      name: frag.name,
      brand: frag.brand,
      year: frag.year || null,
      gender: frag.gender,
      concentration: frag.concentration || null,
      scentFamily: frag.scentFamily,
      subfamilies: frag.subfamilies.length > 0 ? frag.subfamilies : null,
      longevity: frag.longevity || null,
      sillage: frag.sillage || null,
      priceRange: frag.priceRange,
      rating: frag.rating || null,
      reviewCount: frag.reviewCount || null,
      image: frag.image || null,
      description: frag.description || null,
      seasons: frag.seasons.length > 0 ? frag.seasons : null,
      occasions: frag.occasions.length > 0 ? frag.occasions : null,
      url: frag.url || null,
      country: frag.country || null,
      perfumer: frag.perfumer || null,
      accords: frag.accords.length > 0 ? frag.accords : null,
      source: "parfumo" as const,
    }));

    // Insert in batches and collect inserted IDs
    const FRAGRANCE_BATCH_SIZE = 500;
    const insertedFragrances: { id: number; legacyId: string }[] = [];

    for (let i = 0; i < fragrancesToInsert.length; i += FRAGRANCE_BATCH_SIZE) {
      const batch = fragrancesToInsert.slice(i, i + FRAGRANCE_BATCH_SIZE);
      const result = await db
        .insert(fragrances)
        .values(batch)
        .returning({ id: fragrances.id, legacyId: fragrances.legacyId });

      insertedFragrances.push(
        ...result.map((r) => ({ id: r.id, legacyId: r.legacyId! }))
      );

      const processed = Math.min(
        i + FRAGRANCE_BATCH_SIZE,
        fragrancesToInsert.length
      );
      console.log(
        `  Fragrances: ${processed}/${fragrancesToInsert.length} (${Math.round((processed / fragrancesToInsert.length) * 100)}%)`
      );
    }

    // Build legacy ID -> new ID map for new fragrances
    const newFragranceIdMap = new Map<string, number>();
    for (const frag of insertedFragrances) {
      newFragranceIdMap.set(frag.legacyId, frag.id);
    }

    // -----------------------------------------------------------------------
    // Insert fragrance-note relationships for new fragrances
    // -----------------------------------------------------------------------
    console.log("\n💾 Inserting note relationships for new fragrances...");
    const fragranceNotesToInsert: {
      fragranceId: number;
      noteId: number;
      noteType: "top" | "middle" | "base";
    }[] = [];

    for (const frag of toInsert) {
      const fragranceId = newFragranceIdMap.get(frag.id);
      if (!fragranceId) continue;

      // Top notes
      for (const noteName of frag.notes.top) {
        const noteId = noteIdMap.get(noteName);
        if (noteId) {
          fragranceNotesToInsert.push({
            fragranceId,
            noteId,
            noteType: "top",
          });
        }
      }

      // Middle notes
      for (const noteName of frag.notes.middle) {
        const noteId = noteIdMap.get(noteName);
        if (noteId) {
          fragranceNotesToInsert.push({
            fragranceId,
            noteId,
            noteType: "middle",
          });
        }
      }

      // Base notes
      for (const noteName of frag.notes.base) {
        const noteId = noteIdMap.get(noteName);
        if (noteId) {
          fragranceNotesToInsert.push({
            fragranceId,
            noteId,
            noteType: "base",
          });
        }
      }
    }

    console.log(
      `  Total relationships to insert: ${fragranceNotesToInsert.length}`
    );

    await batchInsert(
      fragranceNotesToInsert,
      1000,
      async (batch) => {
        await db.insert(fragranceNotes).values(batch).onConflictDoNothing();
      },
      "Relationships"
    );

    console.log(`  ✓ Inserted ${insertedFragrances.length} new fragrances\n`);
  }

  // -------------------------------------------------------------------------
  // Step 8: Final summary
  // -------------------------------------------------------------------------
  const finalCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(fragrances);

  console.log("═".repeat(60));
  console.log("✅ Parfumo merge complete!");
  console.log("═".repeat(60));
  console.log(`  📊 Total Parfumo records processed: ${parfumoData.length}`);
  console.log(`  🔄 Duplicates merged: ${toMerge.length}`);
  console.log(`  ➕ New fragrances added: ${toInsert.length}`);
  console.log(`  ⏭️  Already merged (skipped): ${alreadyMerged}`);
  console.log(`  📦 Total fragrances now: ${finalCount[0].count}`);
  console.log("═".repeat(60));
}

// ============================================================================
// Run Seed
// ============================================================================

seedParfumo()
  .then(() => {
    console.log("\n👋 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Parfumo merge failed:", error);
    process.exit(1);
  });

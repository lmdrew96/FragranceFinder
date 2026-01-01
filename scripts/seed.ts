import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";
import { fragrances, notes, fragranceNotes } from "../db/schema";

// Load environment variables from .env
dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

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
}

// ============================================================================
// Utility Functions
// ============================================================================

function extractAllNotes(fragrancesData: FragranceJSON[]): Set<string> {
  const allNotes = new Set<string>();
  
  for (const frag of fragrancesData) {
    frag.notes.top.forEach((note) => allNotes.add(note));
    frag.notes.middle.forEach((note) => allNotes.add(note));
    frag.notes.base.forEach((note) => allNotes.add(note));
  }
  
  return allNotes;
}

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
    console.log(`  ${label}: ${processed}/${total} (${Math.round((processed / total) * 100)}%)`);
  }
}

// ============================================================================
// Main Seed Function
// ============================================================================

async function seed() {
  console.log("🌱 Starting database seed...\n");

  // Step 1: Read JSON file
  console.log("📖 Reading fragrances_data.json...");
  const jsonPath = path.join(process.cwd(), "fragrances_data.json");
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const fragrancesData: FragranceJSON[] = JSON.parse(rawData);
  console.log(`  Found ${fragrancesData.length} fragrances\n`);

  // Step 2: Extract and insert all unique notes
  console.log("📝 Extracting unique notes...");
  const uniqueNotes = extractAllNotes(fragrancesData);
  console.log(`  Found ${uniqueNotes.size} unique notes\n`);

  console.log("💾 Inserting notes...");
  const notesList = Array.from(uniqueNotes).map((name) => ({ name }));
  
  await batchInsert(
    notesList,
    500,
    async (batch) => {
      await db.insert(notes).values(batch).onConflictDoNothing();
    },
    "Notes"
  );

  // Step 3: Build note name -> ID map
  console.log("\n🗺️  Building note ID map...");
  const allNotes = await db.select().from(notes);
  const noteIdMap = new Map<string, number>();
  for (const note of allNotes) {
    noteIdMap.set(note.name, note.id);
  }
  console.log(`  Mapped ${noteIdMap.size} notes\n`);

  // Step 4: Insert fragrances
  console.log("💾 Inserting fragrances...");
  const fragrancesToInsert = fragrancesData.map((frag) => ({
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
    
    insertedFragrances.push(...result.map(r => ({ id: r.id, legacyId: r.legacyId! })));
    
    const processed = Math.min(i + FRAGRANCE_BATCH_SIZE, fragrancesToInsert.length);
    console.log(`  Fragrances: ${processed}/${fragrancesToInsert.length} (${Math.round((processed / fragrancesToInsert.length) * 100)}%)`);
  }

  // Step 5: Build legacy ID -> new ID map
  console.log("\n🗺️  Building fragrance ID map...");
  const fragranceIdMap = new Map<string, number>();
  for (const frag of insertedFragrances) {
    fragranceIdMap.set(frag.legacyId, frag.id);
  }
  console.log(`  Mapped ${fragranceIdMap.size} fragrances\n`);

  // Step 6: Insert fragrance-note relationships
  console.log("💾 Inserting fragrance-note relationships...");
  const fragranceNotesToInsert: {
    fragranceId: number;
    noteId: number;
    noteType: "top" | "middle" | "base";
  }[] = [];

  for (const frag of fragrancesData) {
    const fragranceId = fragranceIdMap.get(frag.id);
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

  console.log(`  Total relationships to insert: ${fragranceNotesToInsert.length}`);

  await batchInsert(
    fragranceNotesToInsert,
    1000,
    async (batch) => {
      await db.insert(fragranceNotes).values(batch).onConflictDoNothing();
    },
    "Relationships"
  );

  console.log("\n✅ Seed completed successfully!");
  console.log(`  - Notes: ${noteIdMap.size}`);
  console.log(`  - Fragrances: ${fragranceIdMap.size}`);
  console.log(`  - Fragrance-Note relationships: ${fragranceNotesToInsert.length}`);
}

// ============================================================================
// Run Seed
// ============================================================================

seed()
  .then(() => {
    console.log("\n👋 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  });

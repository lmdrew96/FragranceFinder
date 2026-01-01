import {
  pgTable,
  serial,
  text,
  integer,
  real,
  timestamp,
  index,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================================
// Enums
// ============================================================================

export const genderEnum = pgEnum("gender", ["masculine", "feminine", "unisex"]);
export const priceRangeEnum = pgEnum("price_range", ["$", "$$", "$$$", "$$$$"]);
export const noteTypeEnum = pgEnum("note_type", ["top", "middle", "base"]);
export const sourceEnum = pgEnum("source", ["fragrantica", "parfumo", "both"]);

// ============================================================================
// Notes Table
// ============================================================================

export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("notes_name_idx").on(table.name),
  ]
);

export const notesRelations = relations(notes, ({ many }) => ({
  fragranceNotes: many(fragranceNotes),
}));

// ============================================================================
// Fragrances Table
// ============================================================================

export const fragrances = pgTable(
  "fragrances",
  {
    id: serial("id").primaryKey(),
    legacyId: text("legacy_id").unique(), // Original "frag-X" ID for debugging
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    year: integer("year"),
    gender: genderEnum("gender").notNull(),
    concentration: text("concentration"),
    scentFamily: text("scent_family").notNull(),
    subfamilies: text("subfamilies").array(),
    longevity: integer("longevity"), // 1-10 scale
    sillage: integer("sillage"), // 1-10 scale
    priceRange: priceRangeEnum("price_range").notNull(),
    rating: real("rating"),
    reviewCount: integer("review_count"),
    image: text("image"),
    description: text("description"),
    seasons: text("seasons").array(),
    occasions: text("occasions").array(),
    url: text("url"),
    country: text("country"),
    perfumer: text("perfumer"),
    accords: text("accords").array(),
    source: sourceEnum("source").default("fragrantica").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Filtering indexes
    index("fragrances_brand_idx").on(table.brand),
    index("fragrances_gender_idx").on(table.gender),
    index("fragrances_price_range_idx").on(table.priceRange),
    index("fragrances_scent_family_idx").on(table.scentFamily),
    
    // Sorting indexes
    index("fragrances_rating_idx").on(table.rating),
    index("fragrances_review_count_idx").on(table.reviewCount),
    index("fragrances_year_idx").on(table.year),
    index("fragrances_name_idx").on(table.name),
    
    // Full-text search will be added via raw SQL migration for tsvector
  ]
);

export const fragrancesRelations = relations(fragrances, ({ many }) => ({
  fragranceNotes: many(fragranceNotes),
}));

// ============================================================================
// Fragrance Notes Junction Table
// ============================================================================

export const fragranceNotes = pgTable(
  "fragrance_notes",
  {
    fragranceId: integer("fragrance_id")
      .notNull()
      .references(() => fragrances.id, { onDelete: "cascade" }),
    noteId: integer("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    noteType: noteTypeEnum("note_type").notNull(), // top, middle, or base
  },
  (table) => [
    primaryKey({ columns: [table.fragranceId, table.noteId, table.noteType] }),
    index("fragrance_notes_fragrance_idx").on(table.fragranceId),
    index("fragrance_notes_note_idx").on(table.noteId),
    index("fragrance_notes_type_idx").on(table.noteType),
    // Composite index for similarity queries
    index("fragrance_notes_note_type_idx").on(table.noteId, table.noteType),
  ]
);

export const fragranceNotesRelations = relations(fragranceNotes, ({ one }) => ({
  fragrance: one(fragrances, {
    fields: [fragranceNotes.fragranceId],
    references: [fragrances.id],
  }),
  note: one(notes, {
    fields: [fragranceNotes.noteId],
    references: [notes.id],
  }),
}));

// ============================================================================
// Type Exports
// ============================================================================

export type Fragrance = typeof fragrances.$inferSelect;
export type NewFragrance = typeof fragrances.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type FragranceNote = typeof fragranceNotes.$inferSelect;
export type NewFragranceNote = typeof fragranceNotes.$inferInsert;

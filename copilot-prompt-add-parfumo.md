# Add Parfumo Data to FragranceFinder Database

## Context

The FragranceFinder app already has:
- Neon database with Drizzle ORM
- Schema with fragrances table + notes junction table
- 13,802 Fragrantica fragrances seeded

I now have a second dataset (`parfumo_fragrances.json`) with 12,342 additional fragrances from Parfumo that need to be merged in **without creating duplicates**.

## The New Data File

**Location:** `parfumo_fragrances.json` in the project root

**Structure:** Identical to the Fragrantica data, with these differences:
- `id` format: `"parfumo-1"`, `"parfumo-2"`, etc.
- `source`: `"parfumo"` (Fragrantica records have `"fragrantica"`)
- `gender`: Always `"unisex"` (Parfumo doesn't provide gender data)
- `country`: Always empty string (not in Parfumo data)
- Rating already converted to 0-5 scale to match Fragrantica

```typescript
interface Fragrance {
  id: string
  name: string
  brand: string
  year: number
  gender: "masculine" | "feminine" | "unisex"
  concentration: "EDT" | "EDP" | "Parfum" | "Cologne" | "Intense"
  scentFamily: string
  subfamilies: string[]
  notes: {
    top: string[]
    middle: string[]
    base: string[]
  }
  longevity: number
  sillage: number
  priceRange: "$" | "$$" | "$$$" | "$$$$"
  rating: number
  reviewCount: number
  image: string
  description: string
  seasons: string[]
  occasions: string[]
  url: string
  country: string
  perfumer: string
  accords: string[]
  source: "fragrantica" | "parfumo"
}
```

## What I Need

### 1. Update Schema (if needed)

Add a `source` column to the fragrances table if it doesn't exist:
- Type: `text` or enum
- Values: `"fragrantica"` | `"parfumo"` | `"both"` (for merged records)
- Default: `"fragrantica"` for existing records

### 2. Create Merge Script

Create `scripts/seed-parfumo.ts` that:

**Step 1: Load existing fragrances from database**
- Fetch all existing fragrance names + brands for comparison

**Step 2: Load Parfumo JSON**
- Read `parfumo_fragrances.json`

**Step 3: Deduplicate**
- For each Parfumo fragrance, check if it already exists in DB
- Match on **normalized name + brand**:
  ```typescript
  function normalize(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove special chars
      .trim()
  }
  
  // Match if both name AND brand match after normalization
  const key = `${normalize(name)}::${normalize(brand)}`
  ```

**Step 4: Handle matches**
When a Parfumo fragrance matches an existing Fragrantica one:
- Update `source` to `"both"`
- Optionally merge any fields that were empty in Fragrantica but present in Parfumo (e.g., `perfumer`, `concentration`)
- Do NOT overwrite: `gender` (Parfumo has no real data), `rating`, `reviewCount`
- Log the merge: `"Merged: Sauvage by Dior (already in Fragrantica)"`

**Step 5: Insert new fragrances**
For Parfumo fragrances with no match:
- Insert as new records with `source: "parfumo"`
- Insert their notes into the junction table
- Log: `"Added: [Name] by [Brand] (Parfumo only)"`

**Step 6: Summary stats**
At the end, log:
```
Parfumo merge complete:
- Total Parfumo records: 12,342
- Duplicates merged: X
- New fragrances added: Y
- Total fragrances now: Z
```

### 3. Add npm Script

Add to `package.json`:
```json
{
  "scripts": {
    "db:seed:parfumo": "tsx scripts/seed-parfumo.ts"
  }
}
```

## Technical Requirements

- Use Drizzle's existing connection and schema
- Batch inserts (chunks of 100-500) for performance
- Transaction for atomicity — if something fails, rollback
- Handle the notes junction table correctly for new fragrances
- Idempotent — safe to run multiple times (skip already-merged records)

## Edge Cases to Handle

1. **Slight name variations:**
   - "L'Homme" vs "L'homme" vs "L'Homme" → should match (normalization handles this)
   - "Dior Homme" vs "Homme Dior" → will NOT match (that's okay, rather have duplicates than wrong merges)

2. **Same name, different brand:**
   - "Blue" by Chanel vs "Blue" by Dolce & Gabbana → correctly treated as different fragrances

3. **Brand name variations:**
   - "Yves Saint Laurent" vs "YSL" → won't match automatically (that's acceptable)
   - Could add manual mapping if needed later

4. **Empty notes arrays:**
   - Some Parfumo records may have empty note arrays — still insert them, just skip junction table entries

## File Structure

```
scripts/
└── seed-parfumo.ts    # New merge script
```

## Run Order

After implementation:
```bash
pnpm db:seed:parfumo
```

This should be safe to run after the initial Fragrantica seed, and safe to run multiple times.

---

Please implement the merge script. Show me the code and I'll review before running.

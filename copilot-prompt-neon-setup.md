# FragranceFinder: Neon Database Setup

## Project Context

I'm building **FragranceFinder**, a Next.js fragrance discovery app. I have a JSON file with 13,802 real fragrances from Fragrantica that I need to migrate to a Neon (serverless Postgres) database.

**Current stack:**
- Next.js (App Router)
- TypeScript
- Deployed on Vercel
- Repo: https://github.com/lmdrew96/FragranceFinder

**Data file location:** `fragrances_data.json` in the project root (I'll add it)

## Data Structure

Each fragrance in the JSON has this structure:

```typescript
interface Fragrance {
  id: string                    // e.g., "frag-1"
  name: string                  // e.g., "Sauvage"
  brand: string                 // e.g., "Dior"
  year: number                  // e.g., 2015
  gender: "masculine" | "feminine" | "unisex"
  concentration: string         // e.g., "EDP"
  scentFamily: string           // e.g., "Fresh", "Oriental", "Woody"
  subfamilies: string[]         // e.g., ["Citrus", "Spicy"]
  notes: {
    top: string[]               // e.g., ["Bergamot", "Pepper"]
    middle: string[]            // e.g., ["Lavender", "Geranium"]
    base: string[]              // e.g., ["Ambroxan", "Cedar"]
  }
  longevity: number             // 1-10 scale
  sillage: number               // 1-10 scale
  priceRange: "$" | "$$" | "$$$" | "$$$$"
  rating: number                // e.g., 4.23
  reviewCount: number           // e.g., 15420
  image: string                 // Currently empty
  description: string           // Currently empty
  seasons: string[]             // e.g., ["spring", "summer"]
  occasions: string[]           // e.g., ["Daily Wear", "Office"]
  url: string                   // Fragrantica URL
  country: string               // e.g., "France"
  perfumer: string              // e.g., "François Demachy"
  accords: string[]             // e.g., ["fresh", "woody", "aromatic"]
}
```

## What I Need You To Do

### 1. Database Schema Design

Create a Postgres schema optimized for:
- Fast filtering by multiple criteria (gender, price, season, scent family)
- Full-text search on name, brand, notes
- Efficient querying of array fields (notes, accords, seasons)
- Future extensibility (user favorites, collections, reviews)

**Considerations:**
- Should notes be a junction table for better querying, or is a Postgres array sufficient for 13k rows?
- Use appropriate indexes for common filter patterns
- Include created_at/updated_at timestamps

### 2. Set Up Drizzle ORM

I prefer Drizzle over Prisma for its SQL-like syntax and lighter weight.

- Install and configure Drizzle with Neon
- Create the schema file(s) in `db/schema.ts`
- Set up the database connection in `db/index.ts`
- Configure drizzle.config.ts for migrations

### 3. Create Seed Script

Create a script (`db/seed.ts` or `scripts/seed.ts`) that:
- Reads `fragrances_data.json`
- Transforms data to match the schema
- Batch inserts efficiently (not one-by-one)
- Handles the notes array → junction table transformation (if using junction table)
- Can be run with `pnpm db:seed` or similar

### 4. Create API Routes

Create Next.js API routes for:

**GET /api/fragrances**
- Pagination (limit, offset)
- Filtering: gender, priceRange, scentFamily, season, occasion
- Search: by name, brand, or notes
- Sorting: by rating, reviewCount, year, name

**GET /api/fragrances/[id]**
- Single fragrance by ID

**GET /api/filters**
- Returns all unique values for filter dropdowns (brands, scent families, occasions, etc.)

### 5. Environment Setup

- Add necessary env vars to `.env.example`
- Document the Neon connection string format
- Add database scripts to `package.json`

## Technical Requirements

- Use TypeScript throughout
- Use Drizzle's query builder (not raw SQL) for type safety
- Implement proper error handling in API routes
- Use Neon's serverless driver for Vercel compatibility
- Keep queries efficient — this will be queried frequently

## Package.json Scripts Needed

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate", 
    "db:push": "drizzle-kit push",
    "db:seed": "tsx scripts/seed.ts",
    "db:studio": "drizzle-kit studio"
  }
}
```

## File Structure Expected

```
├── db/
│   ├── index.ts          # Database connection
│   ├── schema.ts         # Drizzle schema
│   └── migrations/       # Generated migrations
├── scripts/
│   └── seed.ts           # Seed script
├── app/
│   └── api/
│       └── fragrances/
│           ├── route.ts          # GET list with filters
│           └── [id]/
│               └── route.ts      # GET single
│       └── filters/
│           └── route.ts          # GET filter options
├── drizzle.config.ts
├── fragrances_data.json  # The source data
└── .env.example
```

## Start Here

1. First, show me the recommended schema design and explain your choices
2. Then implement the files one by one
3. After each file, wait for my confirmation before moving to the next

Let's begin with the schema design.

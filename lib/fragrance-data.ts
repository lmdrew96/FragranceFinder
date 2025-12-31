export interface Note {
  name: string
  category: "top" | "middle" | "base"
}

export interface Fragrance {
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
  longevity: number // 1-10
  sillage: number // 1-10
  priceRange: "$" | "$$" | "$$$" | "$$$$"
  rating: number
  reviewCount: number
  image: string
  description: string
  seasons: ("spring" | "summer" | "fall" | "winter")[]
  occasions: string[]
}

export const scentFamilies = [
  { name: "Fresh", color: "#7EC8E3", subfamilies: ["Citrus", "Green", "Water", "Ozonic"] },
  { name: "Floral", color: "#F8B4D9", subfamilies: ["Rose", "Jasmine", "White Floral", "Powdery"] },
  { name: "Oriental", color: "#C9A962", subfamilies: ["Amber", "Spicy", "Vanilla", "Sweet"] },
  { name: "Woody", color: "#8B7355", subfamilies: ["Sandalwood", "Cedar", "Oud", "Mossy"] },
  { name: "Aromatic", color: "#9DC183", subfamilies: ["Herbal", "Lavender", "Fougère", "Mint"] },
  { name: "Leather", color: "#6B4423", subfamilies: ["Smoky", "Tobacco", "Suede", "Animalic"] },
  { name: "Gourmand", color: "#D4A574", subfamilies: ["Chocolate", "Coffee", "Caramel", "Fruity"] },
  { name: "Chypre", color: "#708238", subfamilies: ["Oakmoss", "Bergamot", "Patchouli", "Earthy"] },
]

export const allNotes = [
  "Bergamot",
  "Lemon",
  "Orange",
  "Grapefruit",
  "Mandarin",
  "Lime",
  "Neroli",
  "Rose",
  "Jasmine",
  "Ylang-Ylang",
  "Tuberose",
  "Iris",
  "Violet",
  "Lily",
  "Peony",
  "Magnolia",
  "Orange Blossom",
  "Amber",
  "Vanilla",
  "Tonka Bean",
  "Benzoin",
  "Labdanum",
  "Musk",
  "Oud",
  "Incense",
  "Sandalwood",
  "Cedar",
  "Vetiver",
  "Patchouli",
  "Oakmoss",
  "Guaiac Wood",
  "Birch",
  "Lavender",
  "Rosemary",
  "Sage",
  "Thyme",
  "Basil",
  "Mint",
  "Pepper",
  "Cardamom",
  "Cinnamon",
  "Nutmeg",
  "Clove",
  "Ginger",
  "Saffron",
  "Apple",
  "Pear",
  "Peach",
  "Raspberry",
  "Blackcurrant",
  "Fig",
  "Coconut",
  "Coffee",
  "Chocolate",
  "Caramel",
  "Honey",
  "Praline",
  "Rum",
  "Leather",
  "Tobacco",
  "Smoke",
  "Suede",
  "Sea Salt",
  "Seaweed",
  "Rain",
  "Ozone",
  "Aldehydes",
]

// Generate 1500+ fragrances
const brands = [
  "Chanel",
  "Dior",
  "Tom Ford",
  "Creed",
  "Maison Francis Kurkdjian",
  "Byredo",
  "Le Labo",
  "Acqua di Parma",
  "Jo Malone",
  "Guerlain",
  "Hermès",
  "Yves Saint Laurent",
  "Giorgio Armani",
  "Versace",
  "Dolce & Gabbana",
  "Prada",
  "Valentino",
  "Givenchy",
  "Burberry",
  "Calvin Klein",
  "Hugo Boss",
  "Jean Paul Gaultier",
  "Issey Miyake",
  "Kenzo",
  "Marc Jacobs",
  "Carolina Herrera",
  "Narciso Rodriguez",
  "Thierry Mugler",
  "Viktor & Rolf",
  "Montblanc",
  "Azzaro",
  "Paco Rabanne",
  "Amouage",
  "Xerjoff",
  "Parfums de Marly",
  "Initio",
  "Nishane",
  "Roja Parfums",
  "Clive Christian",
  "Bond No. 9",
  "Escentric Molecules",
  "Diptyque",
  "Serge Lutens",
  "Frederic Malle",
  "Penhaligon's",
  "Atelier Cologne",
  "Clean Reserve",
  "Commodity",
  "Replica",
  "Memo Paris",
  "Vilhelm Parfumerie",
]

const fragranceNames = [
  "Noir Absolu",
  "Golden Hour",
  "Velvet Rose",
  "Ocean Breeze",
  "Midnight Oud",
  "Cashmere Mist",
  "Amber Dreams",
  "Silver Mountain",
  "Wild Lavender",
  "Dark Honey",
  "Silk Road",
  "Morning Dew",
  "Eternal Flame",
  "Crystal Waters",
  "Shadow Play",
  "Sun Kissed",
  "Mystic Woods",
  "Royal Iris",
  "Desert Rose",
  "Arctic Ice",
  "Warm Embrace",
  "Starlight",
  "Autumn Leaves",
  "Spring Garden",
  "Winter Spice",
  "Summer Rain",
  "Twilight",
  "Dawn",
  "Dusk",
  "Eclipse",
  "Zenith",
  "Horizon",
  "Infinity",
  "Legacy",
  "Heritage",
  "Signature",
  "Essence",
  "Pure",
  "Intense",
  "Absolute",
  "Elixir",
  "Nectar",
  "Bloom",
  "Blush",
  "Glow",
  "Shine",
  "Radiance",
  "Luminous",
  "Divine",
  "Sacred",
  "Precious",
  "Rare",
  "Exclusive",
  "Limited",
  "Private",
  "Collection",
  "Reserve",
  "Vintage",
  "Classic",
  "Modern",
  "Contemporary",
  "Avant-Garde",
  "Artisan",
  "Bespoke",
  "Couture",
]

const descriptions = [
  "An intoxicating blend that opens with sparkling citrus and evolves into a warm, sensual base.",
  "A sophisticated composition that captures the essence of timeless elegance.",
  "Fresh and vibrant, this scent embodies modern luxury with a playful twist.",
  "Deep and mysterious, perfect for those who dare to stand out.",
  "A harmonious balance of floral and woody notes creates an unforgettable impression.",
  "Light and airy, reminiscent of a spring morning in a blooming garden.",
  "Bold and confident, this fragrance makes a powerful statement.",
  "Delicate yet complex, revealing new facets with every wear.",
  "An olfactory journey through exotic landscapes and precious ingredients.",
  "Clean and refined, the epitome of understated sophistication.",
]

function generateFragrance(id: number): Fragrance {
  const brand = brands[Math.floor(Math.random() * brands.length)]
  const baseName = fragranceNames[Math.floor(Math.random() * fragranceNames.length)]
  const suffix =
    Math.random() > 0.7
      ? ` ${["Noir", "Blanc", "Intense", "Légère", "Extreme", "Oud", "Rose", "Nuit", "Jour"][Math.floor(Math.random() * 9)]}`
      : ""

  const family = scentFamilies[Math.floor(Math.random() * scentFamilies.length)]
  const gender: Fragrance["gender"] = ["masculine", "feminine", "unisex"][
    Math.floor(Math.random() * 3)
  ] as Fragrance["gender"]
  const concentration: Fragrance["concentration"] = ["EDT", "EDP", "Parfum", "Cologne", "Intense"][
    Math.floor(Math.random() * 5)
  ] as Fragrance["concentration"]

  const topNotes = allNotes
    .slice(0, 15)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3 + Math.floor(Math.random() * 2))
  const middleNotes = allNotes
    .slice(10, 35)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3 + Math.floor(Math.random() * 3))
  const baseNotes = allNotes
    .slice(20, 50)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2 + Math.floor(Math.random() * 3))

  const seasons: Fragrance["seasons"] = (["spring", "summer", "fall", "winter"] as const).filter(
    () => Math.random() > 0.4,
  )
  if (seasons.length === 0) seasons.push("fall")

  const occasions = [
    "Daily Wear",
    "Office",
    "Date Night",
    "Evening Out",
    "Special Occasion",
    "Wedding",
    "Casual",
    "Formal",
  ].filter(() => Math.random() > 0.5)
  if (occasions.length === 0) occasions.push("Daily Wear")

  return {
    id: `frag-${id}`,
    name: `${baseName}${suffix}`,
    brand,
    year: 1990 + Math.floor(Math.random() * 35),
    gender,
    concentration,
    scentFamily: family.name,
    subfamilies: family.subfamilies.sort(() => Math.random() - 0.5).slice(0, 2),
    notes: {
      top: topNotes,
      middle: middleNotes,
      base: baseNotes,
    },
    longevity: 4 + Math.floor(Math.random() * 6),
    sillage: 3 + Math.floor(Math.random() * 7),
    priceRange: (["$", "$$", "$$$", "$$$$"] as const)[Math.floor(Math.random() * 4)],
    rating: 3 + Math.random() * 2,
    reviewCount: 50 + Math.floor(Math.random() * 5000),
    image: `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(`${brand} ${baseName} perfume bottle luxury`)}`,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    seasons,
    occasions,
  }
}

// Generate the full catalog
const generatedFragrances: Fragrance[] = Array.from({ length: 1544 }, (_, i) => generateFragrance(i + 1))

const featuredFragrances: Fragrance[] = [
  {
    id: "frag-featured-1",
    name: "Skin",
    brand: "Clean Reserve",
    year: 2016,
    gender: "unisex",
    concentration: "EDP",
    scentFamily: "Floral",
    subfamilies: ["White Floral", "Powdery"],
    notes: {
      top: ["Bergamot", "Pink Pepper", "Cardamom"],
      middle: ["Jasmine", "Violet", "Iris"],
      base: ["Musk", "Sandalwood", "Amber"],
    },
    longevity: 6,
    sillage: 4,
    priceRange: "$$",
    rating: 4.3,
    reviewCount: 1820,
    image: "",
    description:
      "A warm, intimate scent that captures the essence of clean, radiant skin. Fresh yet sensual, it blends delicate florals with soft musks for an effortlessly alluring finish.",
    seasons: ["spring", "summer", "fall"],
    occasions: ["Daily Wear", "Office", "Date Night", "Casual"],
  },
  {
    id: "frag-featured-2",
    name: "Jade888",
    brand: "Hermetica",
    year: 2019,
    gender: "unisex",
    concentration: "EDP",
    scentFamily: "Fresh",
    subfamilies: ["Green", "Citrus"],
    notes: {
      top: ["Bergamot", "Green Tea", "Ginger"],
      middle: ["Jasmine", "Magnolia", "Violet"],
      base: ["Musk", "Amber", "Cedar"],
    },
    longevity: 7,
    sillage: 5,
    priceRange: "$$$",
    rating: 4.5,
    reviewCount: 892,
    image: "",
    description:
      "A luminous molecular fragrance inspired by the purity of jade. Green tea and delicate florals create a serene, meditative aura with exceptional longevity thanks to Hermetica's alcohol-free technology.",
    seasons: ["spring", "summer"],
    occasions: ["Daily Wear", "Office", "Casual", "Special Occasion"],
  },
  {
    id: "frag-featured-3",
    name: "Pleasures",
    brand: "Estée Lauder",
    year: 1995,
    gender: "feminine",
    concentration: "EDP",
    scentFamily: "Floral",
    subfamilies: ["White Floral", "Green"],
    notes: {
      top: ["Green Notes", "Violet Leaves", "Pink Pepper"],
      middle: ["Lilies", "Rose", "Peony", "Jasmine"],
      base: ["Sandalwood", "Patchouli", "Musk"],
    },
    longevity: 7,
    sillage: 6,
    priceRange: "$$",
    rating: 4.4,
    reviewCount: 8450,
    image: "",
    description:
      "A sheer, airy floral bouquet that captures the exhilarating feeling of happiness. Layers of lilies, white peonies, and jasmine create a fresh, feminine signature that has become a timeless classic.",
    seasons: ["spring", "summer"],
    occasions: ["Daily Wear", "Office", "Wedding", "Casual"],
  },
]

export const fragrances: Fragrance[] = [...featuredFragrances, ...generatedFragrances]

// Get unique values for filters
export const allBrands = [...new Set(fragrances.map((f) => f.brand))].sort()
export const allOccasions = [...new Set(fragrances.flatMap((f) => f.occasions))].sort()

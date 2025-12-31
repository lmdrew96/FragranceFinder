// Map of fragrance notes to visual representations
export const noteIcons: Record<string, { emoji: string; color: string; bgColor: string }> = {
  // Citrus
  bergamot: { emoji: "🍊", color: "text-orange-600", bgColor: "bg-orange-100" },
  lemon: { emoji: "🍋", color: "text-yellow-500", bgColor: "bg-yellow-100" },
  orange: { emoji: "🍊", color: "text-orange-500", bgColor: "bg-orange-100" },
  grapefruit: { emoji: "🍊", color: "text-pink-500", bgColor: "bg-pink-100" },
  mandarin: { emoji: "🍊", color: "text-orange-400", bgColor: "bg-orange-50" },
  lime: { emoji: "🍋", color: "text-lime-500", bgColor: "bg-lime-100" },
  citrus: { emoji: "🍋", color: "text-yellow-500", bgColor: "bg-yellow-100" },

  // Floral
  rose: { emoji: "🌹", color: "text-rose-500", bgColor: "bg-rose-100" },
  jasmine: { emoji: "🌸", color: "text-pink-300", bgColor: "bg-pink-50" },
  lavender: { emoji: "💜", color: "text-purple-500", bgColor: "bg-purple-100" },
  iris: { emoji: "💜", color: "text-indigo-400", bgColor: "bg-indigo-100" },
  violet: { emoji: "💜", color: "text-violet-500", bgColor: "bg-violet-100" },
  peony: { emoji: "🌸", color: "text-pink-400", bgColor: "bg-pink-100" },
  tuberose: { emoji: "🌼", color: "text-cream-500", bgColor: "bg-amber-50" },
  ylangylang: { emoji: "🌼", color: "text-yellow-400", bgColor: "bg-yellow-50" },
  neroli: { emoji: "🌸", color: "text-orange-300", bgColor: "bg-orange-50" },
  magnolia: { emoji: "🌸", color: "text-pink-200", bgColor: "bg-pink-50" },
  lily: { emoji: "🌷", color: "text-pink-300", bgColor: "bg-pink-50" },

  // Woody
  sandalwood: { emoji: "🪵", color: "text-amber-700", bgColor: "bg-amber-100" },
  cedar: { emoji: "🌲", color: "text-emerald-700", bgColor: "bg-emerald-100" },
  oud: { emoji: "🪵", color: "text-amber-900", bgColor: "bg-amber-200" },
  vetiver: { emoji: "🌿", color: "text-green-700", bgColor: "bg-green-100" },
  patchouli: { emoji: "🍂", color: "text-amber-800", bgColor: "bg-amber-100" },
  oakmoss: { emoji: "🌿", color: "text-green-800", bgColor: "bg-green-100" },
  birch: { emoji: "🌳", color: "text-stone-600", bgColor: "bg-stone-100" },

  // Spicy
  pepper: { emoji: "🌶️", color: "text-red-600", bgColor: "bg-red-100" },
  cinnamon: { emoji: "🟤", color: "text-amber-700", bgColor: "bg-amber-100" },
  cardamom: { emoji: "🫚", color: "text-green-600", bgColor: "bg-green-100" },
  ginger: { emoji: "🫚", color: "text-amber-500", bgColor: "bg-amber-100" },
  saffron: { emoji: "🧡", color: "text-orange-600", bgColor: "bg-orange-100" },
  clove: { emoji: "🟤", color: "text-amber-800", bgColor: "bg-amber-200" },
  nutmeg: { emoji: "🟤", color: "text-amber-600", bgColor: "bg-amber-100" },

  // Sweet/Gourmand
  vanilla: { emoji: "🍦", color: "text-amber-300", bgColor: "bg-amber-50" },
  caramel: { emoji: "🍮", color: "text-amber-600", bgColor: "bg-amber-100" },
  honey: { emoji: "🍯", color: "text-amber-500", bgColor: "bg-amber-100" },
  chocolate: { emoji: "🍫", color: "text-amber-900", bgColor: "bg-amber-200" },
  coffee: { emoji: "☕", color: "text-amber-900", bgColor: "bg-amber-200" },
  tonkabean: { emoji: "🫘", color: "text-amber-700", bgColor: "bg-amber-100" },
  almond: { emoji: "🥜", color: "text-amber-500", bgColor: "bg-amber-50" },

  // Fresh/Aquatic
  marine: { emoji: "🌊", color: "text-blue-500", bgColor: "bg-blue-100" },
  aquatic: { emoji: "💧", color: "text-cyan-500", bgColor: "bg-cyan-100" },
  ozonic: { emoji: "💨", color: "text-sky-400", bgColor: "bg-sky-100" },
  rain: { emoji: "🌧️", color: "text-slate-500", bgColor: "bg-slate-100" },
  seawater: { emoji: "🌊", color: "text-blue-600", bgColor: "bg-blue-100" },

  // Green/Herbal
  mint: { emoji: "🌿", color: "text-emerald-500", bgColor: "bg-emerald-100" },
  basil: { emoji: "🌿", color: "text-green-600", bgColor: "bg-green-100" },
  rosemary: { emoji: "🌿", color: "text-green-700", bgColor: "bg-green-100" },
  thyme: { emoji: "🌿", color: "text-green-600", bgColor: "bg-green-50" },
  tea: { emoji: "🍵", color: "text-green-500", bgColor: "bg-green-100" },
  greentea: { emoji: "🍵", color: "text-green-500", bgColor: "bg-green-100" },
  herbs: { emoji: "🌿", color: "text-green-600", bgColor: "bg-green-100" },

  // Fruity
  apple: { emoji: "🍎", color: "text-red-500", bgColor: "bg-red-100" },
  peach: { emoji: "🍑", color: "text-orange-400", bgColor: "bg-orange-100" },
  pear: { emoji: "🍐", color: "text-lime-500", bgColor: "bg-lime-100" },
  raspberry: { emoji: "🫐", color: "text-pink-600", bgColor: "bg-pink-100" },
  blackberry: { emoji: "🫐", color: "text-purple-700", bgColor: "bg-purple-100" },
  fig: { emoji: "🍇", color: "text-purple-600", bgColor: "bg-purple-100" },
  plum: { emoji: "🍇", color: "text-purple-700", bgColor: "bg-purple-100" },
  cherry: { emoji: "🍒", color: "text-red-600", bgColor: "bg-red-100" },
  coconut: { emoji: "🥥", color: "text-amber-100", bgColor: "bg-amber-50" },
  pineapple: { emoji: "🍍", color: "text-yellow-500", bgColor: "bg-yellow-100" },
  mango: { emoji: "🥭", color: "text-orange-500", bgColor: "bg-orange-100" },

  // Musky/Animalic
  musk: { emoji: "✨", color: "text-stone-500", bgColor: "bg-stone-100" },
  amber: { emoji: "🔶", color: "text-amber-600", bgColor: "bg-amber-100" },
  leather: { emoji: "🟤", color: "text-stone-700", bgColor: "bg-stone-200" },
  suede: { emoji: "🟤", color: "text-stone-500", bgColor: "bg-stone-100" },

  // Smoky/Incense
  incense: { emoji: "🕯️", color: "text-stone-600", bgColor: "bg-stone-100" },
  smoke: { emoji: "💨", color: "text-gray-500", bgColor: "bg-gray-100" },
  tobacco: { emoji: "🍂", color: "text-amber-800", bgColor: "bg-amber-200" },
  myrrh: { emoji: "🕯️", color: "text-amber-700", bgColor: "bg-amber-100" },
  frankincense: { emoji: "🕯️", color: "text-amber-600", bgColor: "bg-amber-100" },

  // Default fallback
  default: { emoji: "💫", color: "text-primary", bgColor: "bg-muted" },
}

export function getNoteIcon(note: string) {
  const normalizedNote = note.toLowerCase().replace(/[\s-]/g, "")
  return noteIcons[normalizedNote] || noteIcons.default
}

// Get gradient colors based on scent family
export const scentFamilyGradients: Record<string, { from: string; to: string; accent: string }> = {
  Floral: { from: "from-rose-100", to: "to-pink-50", accent: "bg-rose-200" },
  Woody: { from: "from-amber-100", to: "to-stone-50", accent: "bg-amber-200" },
  Oriental: { from: "from-orange-100", to: "to-amber-50", accent: "bg-orange-200" },
  Fresh: { from: "from-cyan-100", to: "to-sky-50", accent: "bg-cyan-200" },
  Citrus: { from: "from-yellow-100", to: "to-orange-50", accent: "bg-yellow-200" },
  Aquatic: { from: "from-blue-100", to: "to-cyan-50", accent: "bg-blue-200" },
  Gourmand: { from: "from-amber-100", to: "to-orange-50", accent: "bg-amber-200" },
  Aromatic: { from: "from-green-100", to: "to-emerald-50", accent: "bg-green-200" },
  Fougère: { from: "from-emerald-100", to: "to-green-50", accent: "bg-emerald-200" },
  Chypre: { from: "from-stone-100", to: "to-amber-50", accent: "bg-stone-200" },
  Leather: { from: "from-stone-200", to: "to-amber-100", accent: "bg-stone-300" },
  Powdery: { from: "from-pink-50", to: "to-purple-50", accent: "bg-pink-100" },
  Spicy: { from: "from-red-100", to: "to-orange-50", accent: "bg-red-200" },
  Green: { from: "from-green-100", to: "to-lime-50", accent: "bg-green-200" },
  Fruity: { from: "from-pink-100", to: "to-orange-50", accent: "bg-pink-200" },
  Musky: { from: "from-stone-100", to: "to-slate-50", accent: "bg-stone-200" },
  Tobacco: { from: "from-amber-200", to: "to-stone-100", accent: "bg-amber-300" },
  Oud: { from: "from-amber-200", to: "to-stone-100", accent: "bg-amber-300" },
}

export function getScentFamilyGradient(family: string) {
  return scentFamilyGradients[family] || { from: "from-muted", to: "to-muted/50", accent: "bg-muted" }
}

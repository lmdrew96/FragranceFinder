"use client"

import { useState } from "react"
import { Heart, Scale, Star, Droplets, Wind } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Fragrance } from "@/lib/fragrance-data"
import { useFragranceStore } from "@/lib/fragrance-store"

interface FragranceCardProps {
  fragrance: Fragrance
  onClick?: () => void
  variant?: "default" | "compact"
}

const scentFamilyColors: Record<string, { bg: string; accent: string }> = {
  Floral: { bg: "from-rose-50 to-rose-100", accent: "bg-rose-200" },
  Woody: { bg: "from-amber-50 to-amber-100", accent: "bg-amber-200" },
  Oriental: { bg: "from-orange-50 to-orange-100", accent: "bg-orange-200" },
  Fresh: { bg: "from-cyan-50 to-cyan-100", accent: "bg-cyan-200" },
  Citrus: { bg: "from-yellow-50 to-yellow-100", accent: "bg-yellow-200" },
  Aquatic: { bg: "from-sky-50 to-sky-100", accent: "bg-sky-200" },
  Gourmand: { bg: "from-pink-50 to-pink-100", accent: "bg-pink-200" },
  Aromatic: { bg: "from-green-50 to-green-100", accent: "bg-green-200" },
  Leather: { bg: "from-stone-100 to-stone-200", accent: "bg-stone-300" },
  Powdery: { bg: "from-violet-50 to-violet-100", accent: "bg-violet-200" },
  Musky: { bg: "from-neutral-100 to-neutral-200", accent: "bg-neutral-300" },
  Spicy: { bg: "from-red-50 to-red-100", accent: "bg-red-200" },
}

export function FragranceCard({ fragrance, onClick, variant = "default" }: FragranceCardProps) {
  const { toggleFavorite, isFavorite, addToComparison, isInComparison } = useFragranceStore()
  const [isHovered, setIsHovered] = useState(false)

  const favorite = isFavorite(fragrance.id)
  const inComparison = isInComparison(fragrance.id)
  const colors = scentFamilyColors[fragrance.scentFamily] || scentFamilyColors.Fresh

  const genderColors = {
    masculine: "bg-blue-100 text-blue-800",
    feminine: "bg-pink-100 text-pink-800",
    unisex: "bg-amber-100 text-amber-800",
  }

  if (variant === "compact") {
    return (
      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg" onClick={onClick}>
        <CardContent className="flex items-center gap-3 p-3">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
              colors.bg,
            )}
          >
            <span className="font-serif text-lg font-bold text-foreground/70">{fragrance.brand.charAt(0)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{fragrance.name}</p>
            <p className="truncate text-xs text-muted-foreground">{fragrance.brand}</p>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {fragrance.rating.toFixed(1)}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className="group relative cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="absolute right-2 top-2 z-10 flex gap-1">
        <Button
          size="icon"
          variant="secondary"
          className={cn("h-8 w-8 opacity-0 transition-all group-hover:opacity-100", favorite && "opacity-100")}
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(fragrance.id)
          }}
        >
          <Heart className={cn("h-4 w-4", favorite && "fill-red-500 text-red-500")} />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className={cn("h-8 w-8 opacity-0 transition-all group-hover:opacity-100", inComparison && "opacity-100")}
          onClick={(e) => {
            e.stopPropagation()
            addToComparison(fragrance.id)
          }}
        >
          <Scale className={cn("h-4 w-4", inComparison && "text-primary")} />
        </Button>
      </div>

      {/* Clean header area with gradient background */}
      <div className={cn("relative flex flex-col items-center justify-center bg-gradient-to-br px-4 py-8", colors.bg)}>
        <div className={cn("absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-40", colors.accent)} />
        <div className={cn("absolute -bottom-6 -left-6 h-20 w-20 rounded-full opacity-30", colors.accent)} />

        <span
          className={cn(
            "relative z-10 font-serif text-4xl font-bold text-foreground/20 transition-transform duration-300",
            isHovered && "scale-110",
          )}
        >
          {fragrance.brand.charAt(0)}
        </span>
        <Badge variant="secondary" className="relative z-10 mt-3 border-0 font-medium">
          {fragrance.scentFamily}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-serif text-lg font-semibold">{fragrance.name}</h3>
            <p className="text-sm text-muted-foreground">{fragrance.brand}</p>
          </div>
          <Badge className={cn("shrink-0 text-xs", genderColors[fragrance.gender])}>{fragrance.gender}</Badge>
        </div>

        <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{fragrance.rating.toFixed(1)}</span>
            <span>({fragrance.reviewCount.toLocaleString()})</span>
          </div>
          <span className="font-semibold text-primary">{fragrance.priceRange}</span>
        </div>

        {/* Top notes display */}
        <div className="mb-3">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Top Notes</p>
          <div className="flex flex-wrap gap-1">
            {fragrance.notes.top.slice(0, 4).map((note) => (
              <Badge key={note} variant="outline" className="text-xs">
                {note}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Droplets className="h-3 w-3" />
            <span>Longevity: {fragrance.longevity}/10</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="h-3 w-3" />
            <span>Sillage: {fragrance.sillage}/10</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {fragrance.concentration}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

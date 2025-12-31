"use client"

import { Heart, Scale, Share2, Star, Droplets, Wind, Calendar, Clock, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Fragrance } from "@/lib/fragrance-data"
import { useFragranceStore } from "@/lib/fragrance-store"
import { NoteVisualization } from "./note-visualization"

interface FragranceDetailModalProps {
  fragrance: Fragrance | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewSimilar?: (fragrance: Fragrance) => void
}

export function FragranceDetailModal({ fragrance, open, onOpenChange, onViewSimilar }: FragranceDetailModalProps) {
  const { toggleFavorite, isFavorite, addToComparison, isInComparison } = useFragranceStore()

  if (!fragrance) return null

  const favorite = isFavorite(fragrance.id)
  const inComparison = isInComparison(fragrance.id)

  const genderColors = {
    masculine: "bg-blue-100 text-blue-800",
    feminine: "bg-pink-100 text-pink-800",
    unisex: "bg-amber-100 text-amber-800",
  }

  const seasonIcons = {
    spring: "🌸",
    summer: "☀️",
    fall: "🍂",
    winter: "❄️",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{fragrance.name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Image Section */}
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-b from-muted/50 to-muted">
              <img
                src={fragrance.image || "/placeholder.svg"}
                alt={fragrance.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute right-3 top-3 flex gap-2">
              <Button size="icon" variant="secondary" onClick={() => toggleFavorite(fragrance.id)}>
                <Heart className={cn("h-5 w-5", favorite && "fill-red-500 text-red-500")} />
              </Button>
              <Button size="icon" variant="secondary" onClick={() => addToComparison(fragrance.id)}>
                <Scale className={cn("h-5 w-5", inComparison && "text-primary")} />
              </Button>
              <Button size="icon" variant="secondary">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{fragrance.brand}</p>
              <h2 className="font-serif text-3xl font-bold">{fragrance.name}</h2>
              <div className="mt-2 flex items-center gap-3">
                <Badge className={cn(genderColors[fragrance.gender])}>{fragrance.gender}</Badge>
                <Badge variant="outline">{fragrance.concentration}</Badge>
                <Badge variant="outline">{fragrance.year}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="text-xl font-bold">{fragrance.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">
                  ({fragrance.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
              <span className="text-2xl font-bold text-primary">{fragrance.priceRange}</span>
            </div>

            <p className="text-muted-foreground">{fragrance.description}</p>

            <Separator />

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  Longevity
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${fragrance.longevity * 10}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{fragrance.longevity}/10</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Wind className="h-4 w-4 text-teal-500" />
                  Sillage
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-teal-500 transition-all"
                      style={{ width: `${fragrance.sillage * 10}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{fragrance.sillage}/10</span>
                </div>
              </div>
            </div>

            {/* Seasons & Occasions */}
            <div className="space-y-3">
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Best Seasons
                </h4>
                <div className="flex gap-2">
                  {(["spring", "summer", "fall", "winter"] as const).map((season) => (
                    <span
                      key={season}
                      className={cn(
                        "rounded-full px-3 py-1 text-sm capitalize",
                        fragrance.seasons.includes(season)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {seasonIcons[season]} {season}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  Occasions
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {fragrance.occasions.map((occasion) => (
                    <Badge key={occasion} variant="secondary">
                      {occasion}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Scent Family */}
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">Scent Family:</span>
                <Badge variant="outline" className="text-base">
                  {fragrance.scentFamily}
                </Badge>
              </div>
              <div className="mt-2 flex gap-2">
                {fragrance.subfamilies.map((sub) => (
                  <Badge key={sub} variant="secondary" className="text-xs">
                    {sub}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <Separator className="my-4" />

        <Tabs defaultValue="pyramid">
          <TabsList className="mb-4">
            <TabsTrigger value="pyramid">Note Pyramid</TabsTrigger>
            <TabsTrigger value="linear">Linear View</TabsTrigger>
          </TabsList>
          <TabsContent value="pyramid">
            <NoteVisualization fragrance={fragrance} variant="pyramid" />
          </TabsContent>
          <TabsContent value="linear">
            <NoteVisualization fragrance={fragrance} variant="linear" />
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            className="flex-1"
            onClick={() => {
              onOpenChange(false)
              onViewSimilar?.(fragrance)
            }}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Find Similar Fragrances
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => addToComparison(fragrance.id)}
            disabled={inComparison}
          >
            <Scale className="mr-2 h-4 w-4" />
            {inComparison ? "Added to Compare" : "Add to Compare"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

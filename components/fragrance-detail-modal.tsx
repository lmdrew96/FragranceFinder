"use client"

import { Heart, Scale, Share2, Star, Droplets, Wind, Calendar, Clock, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Fragrance } from "@/lib/types"
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
            <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-muted/50 to-muted">
              <span className="font-serif text-8xl font-bold text-muted-foreground/20">
                {fragrance.brand.charAt(0)}
              </span>
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
                <Badge variant="outline">{fragrance.concentration ?? "N/A"}</Badge>
                <Badge variant="outline">{fragrance.year ?? "N/A"}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="text-xl font-bold">{fragrance.rating?.toFixed(1) ?? "N/A"}</span>
                <span className="text-sm text-muted-foreground">
                  ({fragrance.reviewCount?.toLocaleString() ?? 0} reviews)
                </span>
              </div>
              <span className="text-2xl font-bold text-primary">{fragrance.priceRange}</span>
            </div>

            {fragrance.description && (
              <p className="text-muted-foreground">{fragrance.description}</p>
            )}

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
                      style={{ width: `${(fragrance.longevity ?? 0) * 10}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{fragrance.longevity ?? "?"}/10</span>
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
                      style={{ width: `${(fragrance.sillage ?? 0) * 10}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{fragrance.sillage ?? "?"}/10</span>
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
                        fragrance.seasons?.includes(season)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {seasonIcons[season]} {season}
                    </span>
                  ))}
                </div>
              </div>

              {fragrance.occasions && fragrance.occasions.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Best Occasions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {fragrance.occasions.map((occasion) => (
                      <Badge key={occasion} variant="outline">
                        {occasion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <Separator className="my-6" />

        <Tabs defaultValue="pyramid" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pyramid">
              <Sparkles className="mr-2 h-4 w-4" />
              Note Pyramid
            </TabsTrigger>
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
          {fragrance.url && (
            <Button asChild className="flex-1">
              <a href={fragrance.url} target="_blank" rel="noopener noreferrer">
                View on Fragrantica
              </a>
            </Button>
          )}
          {onViewSimilar && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onViewSimilar(fragrance)
                onOpenChange(false)
              }}
            >
              Find Similar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

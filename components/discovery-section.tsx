"use client"

import { useMemo } from "react"
import { Sparkles, Heart, TrendingUp, Clock, Shuffle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFragrances, useFragrancesByIds } from "@/lib/api"
import { scentFamilies, type Fragrance } from "@/lib/types"
import { useFragranceStore } from "@/lib/fragrance-store"
import { FragranceCard } from "./fragrance-card"

interface DiscoverySectionProps {
  onSelectFragrance: (fragrance: Fragrance) => void
}

export function DiscoverySection({ onSelectFragrance }: DiscoverySectionProps) {
  const { favorites, recentlyViewed } = useFragranceStore()
  
  // Fetch favorite fragrances
  const { fragrances: favoriteFragrances, isLoading: favoritesLoading } = useFragrancesByIds(favorites)
  
  // Fetch recently viewed fragrances
  const { fragrances: recentFragrances, isLoading: recentLoading } = useFragrancesByIds(recentlyViewed)
  
  // Fetch trending (high rated)
  const { fragrances: trendingFragrances, isLoading: trendingLoading } = useFragrances({
    sortBy: "rating",
    sortOrder: "desc",
    limit: 8,
  })

  // Analyze user preferences based on favorites
  const userPreferences = useMemo(() => {
    if (favoriteFragrances.length === 0) return null

    const familyCount: Record<string, number> = {}
    const noteCount: Record<string, number> = {}

    favoriteFragrances.forEach((frag) => {
      familyCount[frag.scentFamily] = (familyCount[frag.scentFamily] || 0) + 1
      ;[...frag.notes.top, ...frag.notes.middle, ...frag.notes.base].forEach((note) => {
        noteCount[note] = (noteCount[note] || 0) + 1
      })
    })

    const topFamilies = Object.entries(familyCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([f]) => f)

    const topNotes = Object.entries(noteCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([n]) => n)

    return { topFamilies, topNotes }
  }, [favoriteFragrances])

  // Get the top preferred family for recommendations
  const recommendedFamily = userPreferences?.topFamilies[0]
  
  // Fetch recommendations based on preferences
  const { fragrances: recommendations, isLoading: recommendationsLoading } = useFragrances(
    recommendedFamily 
      ? { scentFamily: recommendedFamily, sortBy: "rating", sortOrder: "desc", limit: 8 }
      : { sortBy: "reviewCount", sortOrder: "desc", limit: 8 }
  )

  // Filter out favorites from recommendations
  const filteredRecommendations = recommendations.filter(
    (f) => !favorites.includes(f.id)
  ).slice(0, 8)

  return (
    <div className="space-y-8">
      {/* User Profile Summary */}
      {userPreferences && favoriteFragrances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Heart className="h-5 w-5 text-red-500" />
              Your Scent Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Favorite Scent Families
                </h4>
                <div className="flex flex-wrap gap-2">
                  {userPreferences.topFamilies.map((family) => {
                    const familyData = scentFamilies.find((f) => f.name === family)
                    return (
                      <Badge
                        key={family}
                        className="gap-1.5 px-3 py-1"
                        style={{
                          backgroundColor: familyData?.color,
                          color: "white",
                        }}
                      >
                        {family}
                      </Badge>
                    )
                  })}
                </div>
              </div>
              <div>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Notes You Love
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {userPreferences.topNotes.map((note) => (
                    <Badge key={note} variant="secondary">
                      {note}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-serif text-xl font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            {userPreferences ? "Recommended For You" : "Popular Fragrances"}
          </h3>
        </div>
        {recommendationsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredRecommendations.map((fragrance) => (
              <FragranceCard
                key={fragrance.id}
                fragrance={fragrance}
                onClick={() => onSelectFragrance(fragrance)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trending */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h3 className="font-serif text-xl font-semibold">Trending Now</h3>
        </div>
        {trendingLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trendingFragrances.map((fragrance) => (
              <FragranceCard
                key={fragrance.id}
                fragrance={fragrance}
                onClick={() => onSelectFragrance(fragrance)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="font-serif text-xl font-semibold">Recently Viewed</h3>
          </div>
          {recentLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentFragrances.slice(0, 4).map((fragrance) => (
                <FragranceCard
                  key={fragrance.id}
                  fragrance={fragrance}
                  onClick={() => onSelectFragrance(fragrance)}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

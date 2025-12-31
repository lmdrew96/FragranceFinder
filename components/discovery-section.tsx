"use client"

import { useState, useMemo } from "react"
import { Sparkles, Heart, TrendingUp, Clock, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fragrances, scentFamilies, type Fragrance } from "@/lib/fragrance-data"
import { useFragranceStore } from "@/lib/fragrance-store"
import { FragranceCard } from "./fragrance-card"

interface DiscoverySectionProps {
  onSelectFragrance: (fragrance: Fragrance) => void
}

export function DiscoverySection({ onSelectFragrance }: DiscoverySectionProps) {
  const { favorites, recentlyViewed } = useFragranceStore()
  const [randomSeed, setRandomSeed] = useState(Date.now())

  // Get favorite fragrances
  const favoriteFragrances = useMemo(
    () => favorites.map((id) => fragrances.find((f) => f.id === id)).filter(Boolean) as Fragrance[],
    [favorites],
  )

  // Analyze user preferences based on favorites
  const userPreferences = useMemo(() => {
    if (favoriteFragrances.length === 0) return null

    const familyCount: Record<string, number> = {}
    const noteCount: Record<string, number> = {}
    const brandCount: Record<string, number> = {}

    favoriteFragrances.forEach((frag) => {
      familyCount[frag.scentFamily] = (familyCount[frag.scentFamily] || 0) + 1
      brandCount[frag.brand] = (brandCount[frag.brand] || 0) + 1
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

    return { topFamilies, topNotes, familyCount, noteCount }
  }, [favoriteFragrances])

  // Generate recommendations based on favorites
  const recommendations = useMemo(() => {
    if (!userPreferences) {
      // Random recommendations for new users
      return fragrances.sort(() => Math.random() - 0.5).slice(0, 8)
    }

    const scored = fragrances
      .filter((f) => !favorites.includes(f.id))
      .map((frag) => {
        let score = 0

        // Family match
        if (userPreferences.topFamilies.includes(frag.scentFamily)) {
          score += 10
        }

        // Note matches
        const allNotes = [...frag.notes.top, ...frag.notes.middle, ...frag.notes.base]
        allNotes.forEach((note) => {
          if (userPreferences.topNotes.includes(note)) {
            score += 2
          }
        })

        // Rating bonus
        score += frag.rating

        return { fragrance: frag, score }
      })
      .sort((a, b) => b.score - a.score)

    return scored.slice(0, 8).map((s) => s.fragrance)
  }, [userPreferences, favorites, randomSeed])

  // Trending fragrances (high rating + high review count)
  const trending = useMemo(
    () => fragrances.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount).slice(0, 8),
    [],
  )

  // Recently viewed
  const recent = useMemo(
    () => recentlyViewed.map((id) => fragrances.find((f) => f.id === id)).filter(Boolean) as Fragrance[],
    [recentlyViewed],
  )

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
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-serif text-2xl font-bold">
            <Sparkles className="h-6 w-6 text-primary" />
            {userPreferences ? "Recommended For You" : "Discover New Fragrances"}
          </h2>
          <Button variant="outline" size="sm" onClick={() => setRandomSeed(Date.now())}>
            <Shuffle className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommendations.slice(0, 4).map((fragrance) => (
            <FragranceCard key={fragrance.id} fragrance={fragrance} onClick={() => onSelectFragrance(fragrance)} />
          ))}
        </div>
      </div>

      {/* Trending */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl font-bold">
          <TrendingUp className="h-6 w-6 text-primary" />
          Trending Now
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trending.slice(0, 4).map((fragrance) => (
            <FragranceCard key={fragrance.id} fragrance={fragrance} onClick={() => onSelectFragrance(fragrance)} />
          ))}
        </div>
      </div>

      {/* Recently Viewed */}
      {recent.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl font-bold">
            <Clock className="h-6 w-6 text-primary" />
            Recently Viewed
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recent.slice(0, 4).map((fragrance) => (
              <FragranceCard key={fragrance.id} fragrance={fragrance} onClick={() => onSelectFragrance(fragrance)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

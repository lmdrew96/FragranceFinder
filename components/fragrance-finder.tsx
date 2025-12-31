"use client"

import { useState, useMemo, useCallback } from "react"
import { Search, Sparkles, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fragrances, type Fragrance } from "@/lib/fragrance-data"
import { useFragranceStore } from "@/lib/fragrance-store"
import { FragranceCard } from "@/components/fragrance-card"
import { SearchFilters, type Filters } from "@/components/search-filters"
import { FragranceDetailModal } from "@/components/fragrance-detail-modal"
import { ComparisonPanel } from "@/components/comparison-panel"
import { DiscoverySection } from "@/components/discovery-section"
import { FavoritesSidebar } from "@/components/favorites-sidebar"
import { ScentWheel } from "@/components/scent-wheel"

const initialFilters: Filters = {
  search: "",
  scentFamilies: [],
  brands: [],
  gender: [],
  concentration: [],
  priceRange: [],
  notes: [],
  occasions: [],
  seasons: [],
  longevityMin: 0,
  sillageMin: 0,
  ratingMin: 0,
  sortBy: "popularity",
}

export function FragranceFinder() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [selectedFragrance, setSelectedFragrance] = useState<Fragrance | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("browse")

  const { comparisonList, addToRecentlyViewed } = useFragranceStore()

  // Filter and sort fragrances
  const filteredFragrances = useMemo(() => {
    let result = [...fragrances]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(searchLower) ||
          f.brand.toLowerCase().includes(searchLower) ||
          [...f.notes.top, ...f.notes.middle, ...f.notes.base].some((n) => n.toLowerCase().includes(searchLower)),
      )
    }

    // Scent family filter
    if (filters.scentFamilies.length > 0) {
      result = result.filter((f) => filters.scentFamilies.includes(f.scentFamily))
    }

    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter((f) => filters.brands.includes(f.brand))
    }

    // Gender filter
    if (filters.gender.length > 0) {
      result = result.filter((f) => filters.gender.includes(f.gender))
    }

    // Concentration filter
    if (filters.concentration.length > 0) {
      result = result.filter((f) => filters.concentration.includes(f.concentration))
    }

    // Price range filter
    if (filters.priceRange.length > 0) {
      result = result.filter((f) => filters.priceRange.includes(f.priceRange))
    }

    // Notes filter
    if (filters.notes.length > 0) {
      result = result.filter((f) => {
        const allNotes = [...f.notes.top, ...f.notes.middle, ...f.notes.base]
        return filters.notes.some((note) => allNotes.includes(note))
      })
    }

    // Occasions filter
    if (filters.occasions.length > 0) {
      result = result.filter((f) => filters.occasions.some((occ) => f.occasions.includes(occ)))
    }

    // Seasons filter
    if (filters.seasons.length > 0) {
      result = result.filter((f) => filters.seasons.some((season) => f.seasons.includes(season as any)))
    }

    // Longevity filter
    if (filters.longevityMin > 0) {
      result = result.filter((f) => f.longevity >= filters.longevityMin)
    }

    // Sillage filter
    if (filters.sillageMin > 0) {
      result = result.filter((f) => f.sillage >= filters.sillageMin)
    }

    // Rating filter
    if (filters.ratingMin > 0) {
      result = result.filter((f) => f.rating >= filters.ratingMin)
    }

    // Sort
    switch (filters.sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        result.sort((a, b) => b.year - a.year)
        break
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "price-low":
        result.sort((a, b) => a.priceRange.length - b.priceRange.length)
        break
      case "price-high":
        result.sort((a, b) => b.priceRange.length - a.priceRange.length)
        break
      default: // popularity
        result.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    return result
  }, [filters])

  const handleSelectFragrance = useCallback(
    (fragrance: Fragrance) => {
      setSelectedFragrance(fragrance)
      setIsDetailOpen(true)
      addToRecentlyViewed(fragrance.id)
    },
    [addToRecentlyViewed],
  )

  const handleViewSimilar = useCallback((fragrance: Fragrance) => {
    setFilters({
      ...initialFilters,
      scentFamilies: [fragrance.scentFamily],
    })
    setActiveTab("browse")
  }, [])

  const handleScentWheelSelect = useCallback((family: string) => {
    setFilters({
      ...initialFilters,
      scentFamilies: [family],
    })
    setActiveTab("browse")
  }, [])

  const [displayCount, setDisplayCount] = useState(24)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="font-serif text-2xl font-bold">Scentoria</h1>
          </div>
          <div className="flex items-center gap-3">
            <FavoritesSidebar onSelectFragrance={handleSelectFragrance} />
            <Button
              variant="outline"
              className="relative bg-transparent"
              onClick={() => setIsComparisonOpen(true)}
              disabled={comparisonList.length === 0}
            >
              <Scale className="mr-2 h-4 w-4" />
              Compare
              {comparisonList.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {comparisonList.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">Discover Your Perfect Scent</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Explore over 1,500 fragrances. Compare notes, find your scent family, and discover perfumes tailored to your
            preferences.
          </p>
        </section>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="mx-auto grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="browse" className="gap-2">
              <Search className="h-4 w-4" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="discover" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="wheel" className="gap-2">
              Scent Wheel
            </TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-6">
            <SearchFilters filters={filters} onFiltersChange={setFilters} resultCount={filteredFragrances.length} />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min(displayCount, filteredFragrances.length)} of{" "}
                {filteredFragrances.length.toLocaleString()} fragrances
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredFragrances.slice(0, displayCount).map((fragrance) => (
                <FragranceCard
                  key={fragrance.id}
                  fragrance={fragrance}
                  onClick={() => handleSelectFragrance(fragrance)}
                />
              ))}
            </div>

            {displayCount < filteredFragrances.length && (
              <div className="flex justify-center pt-8">
                <Button variant="outline" size="lg" onClick={() => setDisplayCount((prev) => prev + 24)}>
                  Load More Fragrances
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Discover Tab */}
          <TabsContent value="discover">
            <DiscoverySection onSelectFragrance={handleSelectFragrance} />
          </TabsContent>

          {/* Scent Wheel Tab */}
          <TabsContent value="wheel" className="space-y-8">
            <div className="mx-auto max-w-2xl text-center">
              <h3 className="font-serif text-2xl font-bold">Explore by Scent Family</h3>
              <p className="mt-2 text-muted-foreground">
                Click on a scent family to explore fragrances within that category
              </p>
            </div>
            <div className="flex justify-center">
              <ScentWheel size="lg" onSelect={handleScentWheelSelect} selectedFamily={filters.scentFamilies[0]} />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Detail Modal */}
      <FragranceDetailModal
        fragrance={selectedFragrance}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onViewSimilar={handleViewSimilar}
      />

      {/* Comparison Panel */}
      <ComparisonPanel open={isComparisonOpen} onOpenChange={setIsComparisonOpen} />
    </div>
  )
}

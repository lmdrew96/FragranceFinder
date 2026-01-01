"use client"

import { useState, useCallback } from "react"
import { Search, Sparkles, Scale, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useInfiniteFragrances } from "@/lib/api"
import type { Fragrance } from "@/lib/types"
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
  priceRange: [],
  notes: [],
  occasions: [],
  seasons: [],
  longevityMin: 0,
  sillageMin: 0,
  ratingMin: 0,
  sortBy: "popularity",
}

// Map UI sort options to API sort options
function mapSortBy(sortBy: string): { sortBy: "rating" | "reviewCount" | "year" | "name"; sortOrder: "asc" | "desc" } {
  switch (sortBy) {
    case "rating":
      return { sortBy: "rating", sortOrder: "desc" }
    case "newest":
      return { sortBy: "year", sortOrder: "desc" }
    case "name":
      return { sortBy: "name", sortOrder: "asc" }
    case "price-low":
    case "price-high":
      // Price sorting would need to be handled differently since priceRange is categorical
      return { sortBy: "rating", sortOrder: "desc" }
    default: // popularity
      return { sortBy: "reviewCount", sortOrder: "desc" }
  }
}

export function FragranceFinder() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [selectedFragrance, setSelectedFragrance] = useState<Fragrance | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("browse")

  const { comparisonList, addToRecentlyViewed } = useFragranceStore()

  // Build API filters from UI filters
  const apiFilters = {
    search: filters.search || undefined,
    gender: filters.gender.length === 1 ? filters.gender[0] : undefined,
    priceRange: filters.priceRange.length === 1 ? filters.priceRange[0] : undefined,
    scentFamily: filters.scentFamilies.length === 1 ? filters.scentFamilies[0] : undefined,
    season: filters.seasons.length === 1 ? filters.seasons[0] : undefined,
    occasion: filters.occasions.length === 1 ? filters.occasions[0] : undefined,
    brand: filters.brands.length === 1 ? filters.brands[0] : undefined,
    note: filters.notes.length === 1 ? filters.notes[0] : undefined,
    minRating: filters.ratingMin > 0 ? filters.ratingMin : undefined,
    ...mapSortBy(filters.sortBy),
  }

  const { fragrances, total, hasMore, isLoading, isLoadingMore, loadMore } = useInfiniteFragrances(apiFilters, 24)

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
            Explore over 13,000 fragrances. Compare notes, find your scent family, and discover perfumes tailored to your
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
            <SearchFilters filters={filters} onFiltersChange={setFilters} resultCount={total} />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  <>
                    Showing {fragrances.length.toLocaleString()} of {total.toLocaleString()} fragrances
                  </>
                )}
              </p>
            </div>

            {isLoading && fragrances.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {fragrances.map((fragrance) => (
                    <FragranceCard
                      key={fragrance.id}
                      fragrance={fragrance}
                      onClick={() => handleSelectFragrance(fragrance)}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center pt-8">
                    <Button variant="outline" size="lg" onClick={loadMore} disabled={isLoadingMore}>
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More Fragrances"
                      )}
                    </Button>
                  </div>
                )}
              </>
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

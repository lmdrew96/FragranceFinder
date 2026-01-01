"use client"

import type React from "react"
import { useState } from "react"
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { scentFamilies } from "@/lib/types"
import { useFilters } from "@/lib/api"

export interface Filters {
  search: string
  scentFamilies: string[]
  brands: string[]
  gender: string[]
  priceRange: string[]
  notes: string[]
  occasions: string[]
  seasons: string[]
  longevityMin: number
  sillageMin: number
  ratingMin: number
  sortBy: string
}

interface SearchFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  resultCount: number
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
        <span className="text-sm font-semibold">{title}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">{children}</CollapsibleContent>
    </Collapsible>
  )
}

export function SearchFilters({ filters, onFiltersChange, resultCount }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { filters: apiFilters } = useFilters()

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: keyof Filters, value: string) => {
    const current = filters[key] as string[]
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    updateFilter(key, updated)
  }

  const clearFilters = () => {
    onFiltersChange({
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
    })
  }

  const activeFilterCount = [
    filters.scentFamilies.length,
    filters.brands.length,
    filters.gender.length,
    filters.priceRange.length,
    filters.notes.length,
    filters.occasions.length,
    filters.seasons.length,
    filters.longevityMin > 0 ? 1 : 0,
    filters.sillageMin > 0 ? 1 : 0,
    filters.ratingMin > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  // Use API filter data if available, otherwise fallbacks
  const brands = apiFilters?.brands ?? []
  const notes = apiFilters?.notes ?? []
  const occasions = apiFilters?.occasions ?? ["Casual", "Daily Wear", "Date Night", "Evening Out", "Formal", "Office", "Special Occasion"]
  const seasons = apiFilters?.seasons ?? ["spring", "summer", "fall", "winter"]
  const genders = ["masculine", "feminine", "unisex"]
  const priceRanges = ["$", "$$", "$$$", "$$$$"]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search fragrances, brands, notes..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.sortBy} onValueChange={(v) => updateFilter("sortBy", v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">{activeFilterCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full overflow-y-auto sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter Fragrances</SheetTitle>
              <SheetDescription>{resultCount.toLocaleString()} fragrances found</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Scent Families */}
              <FilterSection title="Scent Family">
                <div className="flex flex-wrap gap-2">
                  {scentFamilies.map((family) => (
                    <button
                      key={family.name}
                      onClick={() => toggleArrayFilter("scentFamilies", family.name)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
                        filters.scentFamilies.includes(family.name)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                      )}
                    >
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: family.color }} />
                      {family.name}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Gender */}
              <FilterSection title="Gender">
                <div className="flex flex-wrap gap-2">
                  {genders.map((gender) => (
                    <button
                      key={gender}
                      onClick={() => toggleArrayFilter("gender", gender)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-all",
                        filters.gender.includes(gender)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                      )}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Price Range */}
              <FilterSection title="Price Range">
                <div className="flex gap-2">
                  {priceRanges.map((price) => (
                    <button
                      key={price}
                      onClick={() => toggleArrayFilter("priceRange", price)}
                      className={cn(
                        "flex-1 rounded-lg py-2 text-sm font-semibold transition-all",
                        filters.priceRange.includes(price)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                      )}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Seasons */}
              <FilterSection title="Seasons">
                <div className="flex gap-2">
                  {seasons.map((season) => (
                    <button
                      key={season}
                      onClick={() => toggleArrayFilter("seasons", season)}
                      className={cn(
                        "flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-all",
                        filters.seasons.includes(season)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                      )}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Occasions */}
              <FilterSection title="Occasions">
                <div className="flex flex-wrap gap-2">
                  {occasions.map((occasion) => (
                    <button
                      key={occasion}
                      onClick={() => toggleArrayFilter("occasions", occasion)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-sm font-medium transition-all",
                        filters.occasions.includes(occasion)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                      )}
                    >
                      {occasion}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Rating */}
              <FilterSection title="Minimum Rating">
                <div className="px-2">
                  <Slider
                    value={[filters.ratingMin]}
                    onValueChange={([v]) => updateFilter("ratingMin", v)}
                    min={0}
                    max={5}
                    step={0.5}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Any</span>
                    <span>{filters.ratingMin > 0 ? `${filters.ratingMin}+ stars` : "All ratings"}</span>
                  </div>
                </div>
              </FilterSection>

              {/* Brands - collapsible list */}
              <FilterSection title="Brands">
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {brands.slice(0, 50).map((brand) => (
                    <label key={brand} className="flex items-center gap-2">
                      <Checkbox
                        checked={filters.brands.includes(brand)}
                        onCheckedChange={() => toggleArrayFilter("brands", brand)}
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.scentFamilies.map((f) => (
            <Badge key={f} variant="secondary" className="gap-1">
              {f}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("scentFamilies", f)} />
            </Badge>
          ))}
          {filters.gender.map((g) => (
            <Badge key={g} variant="secondary" className="gap-1 capitalize">
              {g}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("gender", g)} />
            </Badge>
          ))}
          {filters.priceRange.map((p) => (
            <Badge key={p} variant="secondary" className="gap-1">
              {p}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("priceRange", p)} />
            </Badge>
          ))}
          {filters.brands.map((b) => (
            <Badge key={b} variant="secondary" className="gap-1">
              {b}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("brands", b)} />
            </Badge>
          ))}
          {filters.seasons.map((s) => (
            <Badge key={s} variant="secondary" className="gap-1 capitalize">
              {s}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("seasons", s)} />
            </Badge>
          ))}
          {filters.occasions.map((o) => (
            <Badge key={o} variant="secondary" className="gap-1">
              {o}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("occasions", o)} />
            </Badge>
          ))}
          {filters.ratingMin > 0 && (
            <Badge variant="secondary" className="gap-1">
              {filters.ratingMin}+ stars
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("ratingMin", 0)} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

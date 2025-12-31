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
import { scentFamilies, allBrands, allNotes } from "@/lib/fragrance-data"

export interface Filters {
  search: string
  scentFamilies: string[]
  brands: string[]
  gender: string[]
  concentration: string[]
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

export function SearchFilters({ filters, onFiltersChange, resultCount }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

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
      concentration: [],
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
    filters.concentration.length,
    filters.priceRange.length,
    filters.notes.length,
    filters.occasions.length,
    filters.seasons.length,
    filters.longevityMin > 0 ? 1 : 0,
    filters.sillageMin > 0 ? 1 : 0,
    filters.ratingMin > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

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
                <div className="flex gap-2">
                  {["masculine", "feminine", "unisex"].map((g) => (
                    <Button
                      key={g}
                      variant={filters.gender.includes(g) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayFilter("gender", g)}
                      className="capitalize"
                    >
                      {g}
                    </Button>
                  ))}
                </div>
              </FilterSection>

              {/* Concentration */}
              <FilterSection title="Concentration">
                <div className="flex flex-wrap gap-2">
                  {["EDT", "EDP", "Parfum", "Cologne", "Intense"].map((c) => (
                    <Button
                      key={c}
                      variant={filters.concentration.includes(c) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayFilter("concentration", c)}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </FilterSection>

              {/* Price Range */}
              <FilterSection title="Price Range">
                <div className="flex gap-2">
                  {["$", "$$", "$$$", "$$$$"].map((p) => (
                    <Button
                      key={p}
                      variant={filters.priceRange.includes(p) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayFilter("priceRange", p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </FilterSection>

              {/* Seasons */}
              <FilterSection title="Season">
                <div className="flex gap-2">
                  {["spring", "summer", "fall", "winter"].map((s) => (
                    <Button
                      key={s}
                      variant={filters.seasons.includes(s) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayFilter("seasons", s)}
                      className="capitalize"
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </FilterSection>

              {/* Longevity */}
              <FilterSection title={`Minimum Longevity: ${filters.longevityMin}/10`}>
                <Slider
                  value={[filters.longevityMin]}
                  onValueChange={([v]) => updateFilter("longevityMin", v)}
                  max={10}
                  step={1}
                  className="py-2"
                />
              </FilterSection>

              {/* Sillage */}
              <FilterSection title={`Minimum Sillage: ${filters.sillageMin}/10`}>
                <Slider
                  value={[filters.sillageMin]}
                  onValueChange={([v]) => updateFilter("sillageMin", v)}
                  max={10}
                  step={1}
                  className="py-2"
                />
              </FilterSection>

              {/* Rating */}
              <FilterSection title={`Minimum Rating: ${filters.ratingMin.toFixed(1)}`}>
                <Slider
                  value={[filters.ratingMin]}
                  onValueChange={([v]) => updateFilter("ratingMin", v)}
                  max={5}
                  step={0.5}
                  className="py-2"
                />
              </FilterSection>

              {/* Brands */}
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-semibold">
                  Brands ({filters.brands.length} selected)
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="max-h-48 space-y-2 overflow-y-auto">
                    {allBrands.map((brand) => (
                      <div key={brand} className="flex items-center gap-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={filters.brands.includes(brand)}
                          onCheckedChange={() => toggleArrayFilter("brands", brand)}
                        />
                        <Label htmlFor={`brand-${brand}`} className="text-sm">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Notes */}
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-semibold">
                  Notes ({filters.notes.length} selected)
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto">
                    {allNotes.map((note) => (
                      <button
                        key={note}
                        onClick={() => toggleArrayFilter("notes", note)}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium transition-all",
                          filters.notes.includes(note)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                        )}
                      >
                        {note}
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Clear All */}
              {activeFilterCount > 0 && (
                <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.scentFamilies.map((f) => (
            <Badge key={f} variant="secondary" className="gap-1">
              {f}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("scentFamilies", f)} />
            </Badge>
          ))}
          {filters.brands.map((b) => (
            <Badge key={b} variant="secondary" className="gap-1">
              {b}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("brands", b)} />
            </Badge>
          ))}
          {filters.gender.map((g) => (
            <Badge key={g} variant="secondary" className="gap-1 capitalize">
              {g}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("gender", g)} />
            </Badge>
          ))}
          {filters.notes.slice(0, 5).map((n) => (
            <Badge key={n} variant="secondary" className="gap-1">
              {n}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter("notes", n)} />
            </Badge>
          ))}
          {filters.notes.length > 5 && <Badge variant="secondary">+{filters.notes.length - 5} more</Badge>}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs">
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold">{title}</h4>
      {children}
    </div>
  )
}

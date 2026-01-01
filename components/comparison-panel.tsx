"use client"

import { X, Scale, Star, Droplets, Wind, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useFragrancesByIds } from "@/lib/api"
import { useFragranceStore } from "@/lib/fragrance-store"

interface ComparisonPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ComparisonPanel({ open, onOpenChange }: ComparisonPanelProps) {
  const { comparisonList, removeFromComparison, clearComparison } = useFragranceStore()
  const { fragrances: fragrancesToCompare, isLoading } = useFragrancesByIds(comparisonList)

  if (!open || comparisonList.length === 0) return null

  const allNotes = [
    ...new Set(fragrancesToCompare.flatMap((f) => [...f.notes.top, ...f.notes.middle, ...f.notes.base])),
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-2xl">
      <div className="container py-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="h-5 w-5 text-primary" />
            <h3 className="font-serif text-lg font-semibold">Compare Fragrances ({comparisonList.length}/4)</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={clearComparison}>
              Clear All
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {fragrancesToCompare.map((fragrance) => (
                <Card key={fragrance.id} className="w-[280px] shrink-0">
                  <CardHeader className="relative pb-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-2 h-6 w-6"
                      onClick={() => removeFromComparison(fragrance.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-3">
                      <div className="flex h-20 w-16 items-center justify-center rounded-md bg-muted">
                        <span className="font-serif text-2xl font-bold text-muted-foreground">
                          {fragrance.brand.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="truncate text-sm">{fragrance.name}</CardTitle>
                        <p className="truncate text-xs text-muted-foreground">{fragrance.brand}</p>
                        <div className="mt-1 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium">{fragrance.rating?.toFixed(1) ?? "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        {fragrance.scentFamily}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {fragrance.concentration ?? "N/A"}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Droplets className="h-3 w-3" /> Longevity
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{ width: `${(fragrance.longevity ?? 0) * 10}%` }}
                            />
                          </div>
                          <span className="w-6 text-right font-medium">{fragrance.longevity ?? "?"}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Wind className="h-3 w-3" /> Sillage
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-teal-500"
                              style={{ width: `${(fragrance.sillage ?? 0) * 10}%` }}
                            />
                          </div>
                          <span className="w-6 text-right font-medium">{fragrance.sillage ?? "?"}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Notes</p>
                      <div className="flex flex-wrap gap-1">
                        {[...fragrance.notes.top.slice(0, 2), ...fragrance.notes.middle.slice(0, 1)].map((note) => (
                          <Badge key={note} variant="secondary" className="text-xs">
                            {note}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </div>
    </div>
  )
}

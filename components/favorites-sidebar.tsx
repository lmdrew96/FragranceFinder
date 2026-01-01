"use client"

import { Heart, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useFragrancesByIds } from "@/lib/api"
import type { Fragrance } from "@/lib/types"
import { useFragranceStore } from "@/lib/fragrance-store"
import { FragranceCard } from "./fragrance-card"

interface FavoritesSidebarProps {
  onSelectFragrance: (fragrance: Fragrance) => void
}

export function FavoritesSidebar({ onSelectFragrance }: FavoritesSidebarProps) {
  const { favorites, removeFavorite } = useFragranceStore()
  const { fragrances: favoriteFragrances, isLoading } = useFragrancesByIds(favorites)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative bg-transparent">
          <Heart className="mr-2 h-4 w-4" />
          Favorites
          {favorites.length > 0 && (
            <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs">{favorites.length}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Your Favorites
          </SheetTitle>
          <SheetDescription>
            {favorites.length === 0
              ? "Save fragrances you love to build your collection"
              : `${favorites.length} fragrances saved`}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-6 h-[calc(100vh-180px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : favoriteFragrances.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Heart className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                No favorites yet.
                <br />
                Click the heart icon on any fragrance to save it!
              </p>
            </div>
          ) : (
            <div className="space-y-3 pr-4">
              {favoriteFragrances.map((fragrance) => (
                <div key={fragrance.id} className="group relative">
                  <FragranceCard fragrance={fragrance} variant="compact" onClick={() => onSelectFragrance(fragrance)} />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFavorite(fragrance.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

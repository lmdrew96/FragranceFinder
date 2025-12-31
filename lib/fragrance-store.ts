"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FragranceStore {
  favorites: string[]
  comparisonList: string[]
  recentlyViewed: string[]

  addFavorite: (id: string) => void
  removeFavorite: (id: string) => void
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean

  addToComparison: (id: string) => void
  removeFromComparison: (id: string) => void
  clearComparison: () => void
  isInComparison: (id: string) => boolean

  addToRecentlyViewed: (id: string) => void
}

export const useFragranceStore = create<FragranceStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      comparisonList: [],
      recentlyViewed: [],

      addFavorite: (id) =>
        set((state) => ({
          favorites: [...state.favorites, id],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f !== id),
        })),
      toggleFavorite: (id) => {
        const { favorites } = get()
        if (favorites.includes(id)) {
          set({ favorites: favorites.filter((f) => f !== id) })
        } else {
          set({ favorites: [...favorites, id] })
        }
      },
      isFavorite: (id) => get().favorites.includes(id),

      addToComparison: (id) =>
        set((state) => {
          if (state.comparisonList.length >= 4) return state
          if (state.comparisonList.includes(id)) return state
          return { comparisonList: [...state.comparisonList, id] }
        }),
      removeFromComparison: (id) =>
        set((state) => ({
          comparisonList: state.comparisonList.filter((f) => f !== id),
        })),
      clearComparison: () => set({ comparisonList: [] }),
      isInComparison: (id) => get().comparisonList.includes(id),

      addToRecentlyViewed: (id) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((f) => f !== id)
          return { recentlyViewed: [id, ...filtered].slice(0, 20) }
        }),
    }),
    {
      name: "fragrance-storage",
    },
  ),
)

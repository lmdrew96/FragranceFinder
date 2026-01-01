"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FragranceStore {
  favorites: number[]
  comparisonList: number[]
  recentlyViewed: number[]

  addFavorite: (id: number) => void
  removeFavorite: (id: number) => void
  toggleFavorite: (id: number) => void
  isFavorite: (id: number) => boolean

  addToComparison: (id: number) => void
  removeFromComparison: (id: number) => void
  clearComparison: () => void
  isInComparison: (id: number) => boolean

  addToRecentlyViewed: (id: number) => void
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
      name: "fragrance-storage-v2", // New key to avoid conflicts with old string-based storage
    },
  ),
)

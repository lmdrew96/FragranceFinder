"use client"

import { cn } from "@/lib/utils"
import type { Fragrance } from "@/lib/types"

interface NoteVisualizationProps {
  fragrance: Fragrance
  variant?: "pyramid" | "linear"
}

export function NoteVisualization({ fragrance, variant = "pyramid" }: NoteVisualizationProps) {
  const noteCategories = [
    {
      key: "top",
      label: "Top Notes",
      description: "First impression, lasts 15-30 min",
      color: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      key: "middle",
      label: "Heart Notes",
      description: "The core, emerges after 30 min",
      color: "bg-rose-100 text-rose-800 border-rose-200",
    },
    {
      key: "base",
      label: "Base Notes",
      description: "The foundation, lasts hours",
      color: "bg-stone-200 text-stone-800 border-stone-300",
    },
  ] as const

  if (variant === "linear") {
    return (
      <div className="space-y-4">
        {noteCategories.map(({ key, label, description, color }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{label}</h4>
              <span className="text-xs text-muted-foreground">{description}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {fragrance.notes[key].length > 0 ? (
                fragrance.notes[key].map((note) => (
                  <span key={note} className={cn("rounded-full border px-3 py-1 text-sm font-medium", color)}>
                    {note}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No notes listed</span>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Pyramid visualization */}
      <div className="space-y-3">
        {noteCategories.map(({ key, label, description, color }, index) => (
          <div
            key={key}
            className={cn("rounded-lg border p-4 transition-all hover:shadow-md", color)}
            style={{
              marginLeft: `${(2 - index) * 8}%`,
              marginRight: `${(2 - index) * 8}%`,
            }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
              <span className="text-xs opacity-75">{description}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {fragrance.notes[key].length > 0 ? (
                fragrance.notes[key].map((note) => (
                  <span key={note} className="rounded-md bg-white/50 px-2 py-0.5 text-sm font-medium">
                    {note}
                  </span>
                ))
              ) : (
                <span className="text-sm opacity-75">No notes listed</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

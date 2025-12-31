"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { scentFamilies } from "@/lib/fragrance-data"

interface ScentWheelProps {
  selectedFamily?: string
  onSelect?: (family: string) => void
  size?: "sm" | "md" | "lg"
  showLabels?: boolean
}

export function ScentWheel({ selectedFamily, onSelect, size = "md", showLabels = true }: ScentWheelProps) {
  const [hoveredFamily, setHoveredFamily] = useState<string | null>(null)

  const sizeClasses = {
    sm: "w-48 h-48",
    md: "w-64 h-64",
    lg: "w-80 h-80",
  }

  const segmentAngle = 360 / scentFamilies.length

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className={cn("relative", sizeClasses[size])}>
        <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-lg">
          {scentFamilies.map((family, index) => {
            const startAngle = index * segmentAngle - 90
            const endAngle = startAngle + segmentAngle
            const midAngle = (startAngle + endAngle) / 2

            const startRad = (startAngle * Math.PI) / 180
            const endRad = (endAngle * Math.PI) / 180
            const midRad = (midAngle * Math.PI) / 180

            const outerRadius = 95
            const innerRadius = 40

            const x1Outer = 100 + outerRadius * Math.cos(startRad)
            const y1Outer = 100 + outerRadius * Math.sin(startRad)
            const x2Outer = 100 + outerRadius * Math.cos(endRad)
            const y2Outer = 100 + outerRadius * Math.sin(endRad)

            const x1Inner = 100 + innerRadius * Math.cos(startRad)
            const y1Inner = 100 + innerRadius * Math.sin(startRad)
            const x2Inner = 100 + innerRadius * Math.cos(endRad)
            const y2Inner = 100 + innerRadius * Math.sin(endRad)

            const labelRadius = 70
            const labelX = 100 + labelRadius * Math.cos(midRad)
            const labelY = 100 + labelRadius * Math.sin(midRad)

            const isSelected = selectedFamily === family.name
            const isHovered = hoveredFamily === family.name

            const pathData = `
              M ${x1Inner} ${y1Inner}
              L ${x1Outer} ${y1Outer}
              A ${outerRadius} ${outerRadius} 0 0 1 ${x2Outer} ${y2Outer}
              L ${x2Inner} ${y2Inner}
              A ${innerRadius} ${innerRadius} 0 0 0 ${x1Inner} ${y1Inner}
              Z
            `

            return (
              <g
                key={family.name}
                className="cursor-pointer transition-all"
                onClick={() => onSelect?.(family.name)}
                onMouseEnter={() => setHoveredFamily(family.name)}
                onMouseLeave={() => setHoveredFamily(null)}
              >
                <path
                  d={pathData}
                  fill={family.color}
                  stroke="white"
                  strokeWidth="2"
                  className={cn(
                    "transition-all duration-200",
                    (isSelected || isHovered) && "opacity-100",
                    !isSelected && !isHovered && "opacity-75",
                  )}
                  style={{
                    transform: isSelected || isHovered ? "scale(1.02)" : "scale(1)",
                    transformOrigin: "100px 100px",
                  }}
                />
                {showLabels && size !== "sm" && (
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none fill-white text-[8px] font-semibold drop-shadow-md"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                  >
                    {family.name}
                  </text>
                )}
              </g>
            )
          })}

          {/* Center circle */}
          <circle cx="100" cy="100" r="35" fill="white" stroke="#e5e5e5" strokeWidth="1" />
          <text
            x="100"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-[7px] font-medium"
          >
            {hoveredFamily || selectedFamily || "Select"}
          </text>
        </svg>
      </div>

      {showLabels && (
        <div className="flex flex-wrap justify-center gap-2">
          {scentFamilies.map((family) => (
            <button
              key={family.name}
              onClick={() => onSelect?.(family.name)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
                selectedFamily === family.name ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
              )}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: family.color }} />
              {family.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

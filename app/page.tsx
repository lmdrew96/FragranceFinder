import { Suspense } from "react"
import { FragranceFinder } from "@/components/fragrance-finder"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FragranceFinder />
    </Suspense>
  )
}

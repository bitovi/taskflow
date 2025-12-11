"use client"

import { Search } from "lucide-react"
import { poppins } from "@/lib/fonts"

export function EmptySearchState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Search className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${poppins.className}`}>
        No tasks found
      </h3>
      <p className="text-muted-foreground max-w-md">
        No tasks match your current search and filter criteria. Try adjusting your search terms or filter settings.
      </p>
    </div>
  )
}

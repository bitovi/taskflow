"use client"

import { Search } from "lucide-react"

export function TaskEmptyState() {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <Search className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No tasks found</h3>
      <p className="text-muted-foreground">
        No tasks match your current search and filter criteria. Try adjusting your search terms or filter settings.
      </p>
    </div>
  )
}
import { Search } from "lucide-react"

export function NoTasksFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold text-muted-foreground mb-2">
        No tasks match the current search and filter criteria
      </h3>
      <p className="text-sm text-muted-foreground">
        Try adjusting your search terms or filter settings to find what you&apos;re looking for.
      </p>
    </div>
  )
}
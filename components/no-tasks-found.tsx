import { Search } from "lucide-react"

export function NoTasksFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Search className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-2xl font-semibold mb-2">No tasks found</h3>
      <p className="text-muted-foreground max-w-md">
        No tasks match your current search and filter criteria. Try adjusting your search terms or filter settings
      </p>
    </div>
  )
}

import { Search } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center" data-testid="empty-state">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">No tasks found</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        No tasks match your current search and filter criteria. Try adjusting your search terms or filter settings.
      </p>
    </div>
  )
}

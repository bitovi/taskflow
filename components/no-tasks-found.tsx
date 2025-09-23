import { Search } from "lucide-react"

interface NoTasksFoundProps {
  hasFilters: boolean
  searchText?: string
}

export function NoTasksFound({ hasFilters, searchText }: NoTasksFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Search className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
      <p className="text-muted-foreground max-w-md">
        {hasFilters
          ? searchText
            ? `No tasks match "${searchText}" with the current filter criteria. Try adjusting your search terms or filters.`
            : "No tasks match the current filter criteria. Try adjusting your filters."
          : "No tasks have been created yet. Create your first task to get started."
        }
      </p>
    </div>
  )
}
import { Search } from "lucide-react"

export function EmptySearchState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Search className="h-24 w-24 text-white mb-8 stroke-[1.5]" />
      <h3 className="text-4xl font-normal text-white mb-4">
        No tasks found
      </h3>
      <p className="text-4xl font-normal text-white max-w-[795px] leading-normal">
        No tasks match your current search and filter criteria. Try adjusting your search terms or filter settings
      </p>
    </div>
  )
}

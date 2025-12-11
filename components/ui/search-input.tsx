import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SearchInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  onClear?: () => void
  showClearButton?: boolean
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, showClearButton = false, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white" />
        <input
          type="text"
          className={cn(
            "flex h-[68px] w-full rounded-[10px] border-2 border-white bg-background-dark px-12 py-2 text-[32px] text-white ring-offset-background placeholder:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {showClearButton && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:opacity-80 transition-opacity"
            aria-label="Clear search"
          >
            <X className="h-8 w-8" />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }

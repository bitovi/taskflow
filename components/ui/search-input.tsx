import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SearchInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
  onValueChange?: (value: string) => void
  onClear?: () => void
  showClearButton?: boolean
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onValueChange, onClear, showClearButton = true, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(props.value || "")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInternalValue(newValue)
      onValueChange?.(newValue)
    }

    const handleClear = () => {
      setInternalValue("")
      onValueChange?.("")
      onClear?.()
    }

    React.useEffect(() => {
      if (props.value !== undefined) {
        setInternalValue(props.value)
      }
    }, [props.value])

    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-9 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          value={internalValue}
          onChange={handleChange}
          {...props}
        />
        {showClearButton && internalValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }

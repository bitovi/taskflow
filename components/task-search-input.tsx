"use client"

import { Input } from "@/components/ui/input"
import { Search, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useTransition } from "react"

interface TaskSearchInputProps {
  onSearchChange?: (query: string) => void
}

export function TaskSearchInput({ onSearchChange }: TaskSearchInputProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const currentQuery = searchParams.get("search") || ""
    setSearchQuery(currentQuery)
  }, [searchParams])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (value && value.length >= 3) {
        params.set("search", value)
      } else {
        params.delete("search")
      }
      
      const newUrl = params.toString() ? `?${params.toString()}` : "/tasks"
      router.push(newUrl, { scroll: false })
    })

    if (onSearchChange) {
      onSearchChange(value)
    }
  }

  const handleClear = () => {
    setSearchQuery("")
    startTransition(() => {
      router.push("/tasks", { scroll: false })
    })
    
    if (onSearchChange) {
      onSearchChange("")
    }
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {isPending && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2" role="status" aria-label="Searching...">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
      <Button variant="outline" size="icon" aria-label="Filter tasks" disabled>
        <Filter className="h-5 w-5" />
      </Button>
    </div>
  )
}

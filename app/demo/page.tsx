"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Clock } from "lucide-react"
import { SearchAndFilter, type FilterState } from "@/components/search-and-filter"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { poppins } from "@/lib/fonts"

const mockTasks = [
  {
    id: 1,
    name: "Design user interface mockups",
    description: "Create wireframes and mockups for the new dashboard interface",
    priority: "high",
    status: "todo",
    dueDate: new Date("2024-02-15"),
    assigneeId: 1,
    creatorId: 1,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    assignee: { name: "Alice Johnson" }
  },
  {
    id: 2,
    name: "Implement authentication system",
    description: "Build secure login and registration functionality",
    priority: "high",
    status: "in_progress",
    dueDate: new Date("2024-02-20"),
    assigneeId: 2,
    creatorId: 1,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-10"),
    assignee: { name: "Bob Smith" }
  },
  {
    id: 3,
    name: "Write unit tests for API endpoints",
    description: "Ensure all API endpoints have comprehensive test coverage",
    priority: "medium",
    status: "review",
    dueDate: new Date("2024-02-25"),
    assigneeId: 3,
    creatorId: 2,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-15"),
    assignee: { name: "Charlie Brown" }
  },
  {
    id: 4,
    name: "Optimize database queries",
    description: "Review and optimize slow database queries for better performance",
    priority: "medium",
    status: "done",
    dueDate: new Date("2024-01-30"),
    assigneeId: 4,
    creatorId: 2,
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-20"),
    assignee: { name: "Diana Prince" }
  },
  {
    id: 5,
    name: "Update documentation",
    description: "Update API documentation with latest changes and examples",
    priority: "low",
    status: "will_not_do",
    dueDate: null,
    assigneeId: null,
    creatorId: 1,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    assignee: null
  },
  {
    id: 6,
    name: "Fix mobile responsive issues", 
    description: "Address layout problems on mobile devices",
    priority: "high",
    status: "todo",
    dueDate: new Date("2024-03-01"),
    assigneeId: 1,
    creatorId: 3,
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-01-06"),
    assignee: { name: "Alice Johnson" }
  }
];

function formatDateForDisplay(date: Date) {
  return date.toLocaleDateString()
}

function getInitials(name: string | null) {
  if (!name) return "??"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function DemoPage() {
  const [searchValue, setSearchValue] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    status: ["todo", "in_progress", "review", "done", "will_not_do"],
    priority: ["high", "medium", "low"]
  })

  const filteredTasks = useMemo(() => {
    return mockTasks.filter(task => {
      // Filter by search text (name and description)
      const searchLower = searchValue.toLowerCase()
      const matchesSearch = searchValue === "" || 
        task.name.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)

      // Filter by status
      const matchesStatus = filters.status.includes(task.status)

      // Filter by priority
      const matchesPriority = filters.priority.includes(task.priority.toLowerCase())

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [searchValue, filters])

  const hasActiveFilters = searchValue !== "" || 
    filters.status.length < 5 || 
    filters.priority.length < 3

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold tracking-tight ${poppins.className}`}>Tasks Demo</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <SearchAndFilter
        onSearchChange={setSearchValue}
        onFiltersChange={setFilters}
        searchValue={searchValue}
        filters={filters}
      />

      <div className="space-y-4">
        {filteredTasks.length === 0 && hasActiveFilters ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4">
              <Search className="h-12 w-12 text-muted-foreground mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
            <p className="text-muted-foreground max-w-md">
              No tasks match your current search and filter criteria. Try adjusting your search terms or filter settings.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className={task.status === "done" ? "bg-muted/50" : ""}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={task.status === "done"}
                      className="mt-1 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3
                          className={`font-semibold ${poppins.className} ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}
                        >
                          {task.name}
                        </h3>
                        <Badge variant="outline" className="text-xs text-foreground-muted">
                          TASK-{task.id}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-7 w-7 border-2 border-border">
                            <AvatarFallback className="text-xs font-medium">{getInitials(task.assignee?.name || null)}</AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">{task.assignee?.name || "Unassigned"}</span>
                        </div>
                        <Badge className="capitalize">
                          {task.status.replace("_", " ")}
                        </Badge>
                        <Badge className="capitalize">
                          {task.priority}
                        </Badge>
                        {task.dueDate && (
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{formatDateForDisplay(task.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Demo Features:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Search tasks by name or description</li>
          <li>• Filter by status: Todo, In progress, Review, Done, Will not do</li>
          <li>• Filter by priority: High, Medium, Low</li>
          <li>• Clear search with X button</li>
          <li>• All filters start selected</li>
          <li>• "No tasks found" message when no matches</li>
        </ul>
      </div>
    </div>
  )
}
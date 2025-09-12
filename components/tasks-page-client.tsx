"use client"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { TaskList } from "@/components/task-list"
import { searchAndFilterTasks } from "@/app/(dashboard)/tasks/actions"

import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

interface TasksPageClientProps {
    initialTasks: TaskWithProfile[];
}

const STATUS_OPTIONS = [
    { value: "todo", label: "Todo" },
    { value: "in_progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" }
];

const PRIORITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
];

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
    const [tasks, setTasks] = useState<TaskWithProfile[]>(initialTasks);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilters, setStatusFilters] = useState<string[]>([]);
    const [priorityFilters, setPriorityFilters] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const performSearch = async () => {
        startTransition(async () => {
            const { tasks: searchResults, error } = await searchAndFilterTasks(
                searchQuery,
                statusFilters.length > 0 ? statusFilters : undefined,
                priorityFilters.length > 0 ? priorityFilters : undefined
            );
            
            if (!error) {
                setTasks(searchResults || []);
            }
        });
    };

    // Perform search when filters change
    useEffect(() => {
        performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, statusFilters, priorityFilters]);

    const clearSearch = () => {
        setSearchQuery("");
    };

    const toggleStatusFilter = (status: string) => {
        setStatusFilters(prev => 
            prev.includes(status) 
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    const togglePriorityFilter = (priority: string) => {
        setPriorityFilters(prev => 
            prev.includes(priority) 
                ? prev.filter(p => p !== priority)
                : [...prev, priority]
        );
    };

    const hasActiveFilters = statusFilters.length > 0 || priorityFilters.length > 0;

    return (
        <>
            {/* Search and Filter Bar */}
            <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                            onClick={clearSearch}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className={hasActiveFilters ? "border-primary" : ""}>
                            <Filter className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <div className="p-2 space-y-2">
                            {STATUS_OPTIONS.map((status) => (
                                <div key={status.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`status-${status.value}`}
                                        checked={statusFilters.includes(status.value)}
                                        onCheckedChange={() => toggleStatusFilter(status.value)}
                                    />
                                    <label
                                        htmlFor={`status-${status.value}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {status.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                        <div className="p-2 space-y-2">
                            {PRIORITY_OPTIONS.map((priority) => (
                                <div key={priority.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`priority-${priority.value}`}
                                        checked={priorityFilters.includes(priority.value)}
                                        onCheckedChange={() => togglePriorityFilter(priority.value)}
                                    />
                                    <label
                                        htmlFor={`priority-${priority.value}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {priority.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Task List */}
            <div className={isPending ? "opacity-50 transition-opacity" : ""}>
                <TaskList initialTasks={tasks} />
            </div>
        </>
    );
}
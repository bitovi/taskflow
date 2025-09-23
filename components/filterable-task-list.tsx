"use client"

import { useState, useCallback, useTransition } from "react"
import { TaskList } from "@/components/task-list"
import { TaskSearchFilter } from "@/components/task-search-filter"
import { getFilteredTasks } from "@/app/(dashboard)/tasks/actions"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

type FilterState = {
  search: string;
  statuses: string[];
  priorities: string[];
}

export function FilterableTaskList({ initialTasks }: { initialTasks: TaskWithProfile[] }) {
  const [tasks, setTasks] = useState<TaskWithProfile[]>(initialTasks);
  const [isPending, startTransition] = useTransition();

  const handleFiltersChange = useCallback((filters: FilterState) => {
    startTransition(async () => {
      try {
        const { tasks: filteredTasks, error } = await getFilteredTasks(filters);
        
        if (error) {
          console.error("Error filtering tasks:", error);
          return;
        }
        
        setTasks(filteredTasks || []);
      } catch (err) {
        console.error("Error in filtering:", err);
      }
    });
  }, []);

  return (
    <div>
      <TaskSearchFilter onFiltersChange={handleFiltersChange} isLoading={isPending} />
      
      {tasks.length === 0 && !isPending ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">No tasks found</div>
          <div className="text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </div>
        </div>
      ) : (
        <TaskList initialTasks={tasks} />
      )}
    </div>
  );
}
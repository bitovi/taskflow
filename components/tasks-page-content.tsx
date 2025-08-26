"use client"

import { useState, useMemo } from "react"
import { TaskList } from "@/components/task-list"
import { SearchAndFilter } from "@/components/search-and-filter"
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
}

interface TasksPageContentProps {
  initialTasks: TaskWithProfile[]
}

export function TasksPageContent({ initialTasks }: TasksPageContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredTasks = useMemo(() => {
    return initialTasks.filter((task) => {
      // Search filter - check both name and description
      const matchesSearch = searchTerm === "" || 
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))

      // Priority filter
      const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority

      // Status filter
      const matchesStatus = selectedStatus === "all" || task.status === selectedStatus

      return matchesSearch && matchesPriority && matchesStatus
    })
  }, [initialTasks, searchTerm, selectedPriority, selectedStatus])

  return (
    <>
      <SearchAndFilter
        onSearch={setSearchTerm}
        onFilterPriority={setSelectedPriority}
        onFilterStatus={setSelectedStatus}
        searchTerm={searchTerm}
        selectedPriority={selectedPriority}
        selectedStatus={selectedStatus}
      />
      <TaskList initialTasks={filteredTasks} />
    </>
  )
}
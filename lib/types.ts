import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskStatus = "todo" | "in_progress" | "review" | "done";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

export type KanbanColumn = {
  id: "todo" | "in_progress" | "review" | "done"
  title: string
  tasks: TaskWithProfile[]
}

export type KanbanData = {
  [key in "todo" | "in_progress" | "review" | "done"]: KanbanColumn
}
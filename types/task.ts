import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

export type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};
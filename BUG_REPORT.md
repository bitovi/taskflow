# Bug Report: Missing Tasks on Kanban Board

## 📝 Description

Tasks are disappearing from the Kanban board view. Users report that when they navigate to `/board`, they only see a fraction of their tasks, even though the complete list is visible on the `/tasks` page.

## 🔴 Severity

**High** - This significantly impacts user experience and makes the board view nearly unusable.

## 📍 Location

- **Page:** `/board` (Kanban Board)
- **Component:** `components/kanban-board.tsx`
- **Related:** `app/(dashboard)/board/page.tsx`

## 🪜 Steps to Reproduce

1. Navigate to the Tasks page at `/tasks`
2. Note the total number of tasks displayed (should be 30)
3. Navigate to the Board page at `/board`
4. Observe that only a small subset of tasks appear on the board
5. Count the tasks on each column - the total is much less than expected

## ✅ Expected Behavior

All 30 tasks should be distributed across the four Kanban columns:

- **To Do** - Tasks with status "todo"
- **In Progress** - Tasks with status "in_progress"
- **Review** - Tasks with status "review"
- **Done** - Tasks with status "done"

The total count across all columns should match the total tasks in the database.

## ❌ Actual Behavior

Only approximately 7 tasks appear on the Kanban board, while 23 tasks are missing. The task counts on the board columns are significantly lower than expected.

## 🔍 Initial Observations

1. The tasks DO exist in the database (visible on `/tasks` page)
2. The issue seems to be with how tasks are being filtered or queried for the board
3. No errors are shown in the console or logs
4. The issue is consistent across all users

## IMPORTANT Considerations

- The PostgreSQL database can be queried using the corrisponding MCP server.

/**
 * Mock task data for testing the search and filter functionality
 */

export const mockTasks = [
  {
    id: 1,
    name: "Fix login bug",
    description: "Resolve authentication issues on the login page",
    priority: "high",
    status: "todo",
    dueDate: new Date("2024-09-15"),
    assigneeId: 1,
    creatorId: 2,
    createdAt: new Date("2024-08-20"),
    updatedAt: new Date("2024-08-20"),
    assignee: { name: "Alice Johnson" },
  },
  {
    id: 2,
    name: "Update documentation",
    description: "Update API documentation with new endpoints",
    priority: "medium",
    status: "in_progress",
    dueDate: new Date("2024-09-20"),
    assigneeId: 2,
    creatorId: 1,
    createdAt: new Date("2024-08-21"),
    updatedAt: new Date("2024-08-21"),
    assignee: { name: "Bob Smith" },
  },
  {
    id: 3,
    name: "Design user interface",
    description: "Create mockups for the new dashboard interface",
    priority: "high",
    status: "review",
    dueDate: new Date("2024-09-10"),
    assigneeId: 3,
    creatorId: 1,
    createdAt: new Date("2024-08-19"),
    updatedAt: new Date("2024-08-22"),
    assignee: { name: "Charlie Brown" },
  },
  {
    id: 4,
    name: "Optimize database queries",
    description: "Improve performance of slow database queries",
    priority: "low",
    status: "done",
    dueDate: new Date("2024-08-25"),
    assigneeId: 1,
    creatorId: 3,
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date("2024-08-25"),
    assignee: { name: "Alice Johnson" },
  },
  {
    id: 5,
    name: "Implement search functionality",
    description: "Add search and filter capabilities to task management",
    priority: "high",
    status: "in_progress",
    dueDate: new Date("2024-09-12"),
    assigneeId: 2,
    creatorId: 1,
    createdAt: new Date("2024-08-22"),
    updatedAt: new Date("2024-08-23"),
    assignee: { name: "Bob Smith" },
  },
];

/**
 * Test scenarios for the search and filter functionality
 */
export const testScenarios = [
  {
    name: "Search by task name",
    searchQuery: "login",
    expectedResults: 1, // Should find "Fix login bug"
  },
  {
    name: "Search by description",
    searchQuery: "documentation",
    expectedResults: 1, // Should find task with "documentation" in description
  },
  {
    name: "Filter by high priority",
    priorityFilter: "high",
    expectedResults: 3, // Should find 3 high priority tasks
  },
  {
    name: "Filter by done status",
    statusFilter: "done",
    expectedResults: 1, // Should find 1 completed task
  },
  {
    name: "Combined search and filter",
    searchQuery: "interface",
    priorityFilter: "high",
    expectedResults: 1, // Should find "Design user interface" which is high priority
  },
];
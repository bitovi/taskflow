// Mock the entire Prisma module
const mockFindMany = jest.fn()

jest.mock("@/app/generated/prisma", () => {
  const mockFn = jest.fn()
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      task: {
        findMany: mockFn,
      },
    })),
    __mockFindMany: mockFn,
  }
})

// Mock getCurrentUser
jest.mock("@/app/login/actions", () => ({
  getCurrentUser: jest.fn().mockResolvedValue({ id: 1, name: "Test User" }),
}))

import { searchTasks } from "@/app/(dashboard)/tasks/actions"
import { PrismaClient } from "@/app/generated/prisma"

const prismaModule = require("@/app/generated/prisma") as any
const mockedFindMany = prismaModule.__mockFindMany

const mockTasks = [
  {
    id: 1,
    name: "Task 1",
    description: "Description 1",
    status: "todo",
    priority: "high",
    dueDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 1,
    assigneeId: 1,
    assignee: { id: 1, name: "John Doe", email: "john@example.com", password: "hashed" },
    creator: { id: 1, name: "John Doe", email: "john@example.com", password: "hashed" },
  },
  {
    id: 2,
    name: "Add video feature",
    description: "Add video upload functionality",
    status: "in_progress",
    priority: "medium",
    dueDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 1,
    assigneeId: 1,
    assignee: { id: 1, name: "Jane Smith", email: "jane@example.com", password: "hashed" },
    creator: { id: 1, name: "Jane Smith", email: "jane@example.com", password: "hashed" },
  },
]

describe("searchTasks", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns all tasks when query is empty", async () => {
    mockedFindMany.mockResolvedValue(mockTasks)
    
    const result = await searchTasks("")
    
    expect(result.tasks).toHaveLength(2)
    expect(result.error).toBeNull()
  })

  it("returns all tasks when query is less than 3 characters", async () => {
    mockedFindMany.mockResolvedValue(mockTasks)
    
    const result = await searchTasks("ab")
    
    expect(result.tasks).toHaveLength(2)
    expect(result.error).toBeNull()
  })

  it("searches tasks with 3 or more characters", async () => {
    const filteredTasks = [mockTasks[1]]
    mockedFindMany.mockResolvedValue(filteredTasks)
    
    const result = await searchTasks("Add vide")
    
    expect(mockedFindMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: "Add vide", mode: "insensitive" } },
          { description: { contains: "Add vide", mode: "insensitive" } },
        ],
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, password: true } },
        creator: { select: { id: true, name: true, email: true, password: true } },
      },
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
    })
    expect(result.tasks).toHaveLength(1)
    expect(result.error).toBeNull()
  })

  it("handles search errors gracefully", async () => {
    mockedFindMany.mockRejectedValue(new Error("Database error"))
    
    const result = await searchTasks("test")
    
    expect(result.tasks).toEqual([])
    expect(result.error).toBe("Failed to search tasks.")
  })
})

import { PrismaClient } from "@/app/generated/prisma"

// Mock next/cache before importing actions
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

// Mock getCurrentUser
jest.mock("@/app/login/actions", () => ({
  getCurrentUser: jest.fn(),
}))

// Mock Prisma Client
jest.mock("@/app/generated/prisma", () => {
  const mockPrisma = {
    task: {
      findMany: jest.fn(),
    },
  }
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  }
})

import { searchTasks } from "@/app/(dashboard)/tasks/actions"

describe("searchTasks", () => {
  let prisma: any

  beforeEach(() => {
    prisma = new PrismaClient()
    jest.clearAllMocks()
  })

  it("returns all tasks when query is empty", async () => {
    const mockTasks = [
      { id: 1, name: "Task 1", description: "Description 1" },
      { id: 2, name: "Task 2", description: "Description 2" },
    ]
    prisma.task.findMany.mockResolvedValue(mockTasks)

    const result = await searchTasks("")

    expect(result.tasks).toEqual(mockTasks)
    expect(result.error).toBeNull()
    expect(prisma.task.findMany).toHaveBeenCalled()
  })

  it("returns all tasks when query is less than 3 characters", async () => {
    const mockTasks = [
      { id: 1, name: "Task 1", description: "Description 1" },
      { id: 2, name: "Task 2", description: "Description 2" },
    ]
    prisma.task.findMany.mockResolvedValue(mockTasks)

    const result = await searchTasks("ab")

    expect(result.tasks).toEqual(mockTasks)
    expect(result.error).toBeNull()
  })

  it("searches tasks by name when query is 3+ characters", async () => {
    const mockTasks = [
      { id: 1, name: "Add video feature", description: "Description 1" },
    ]
    prisma.task.findMany.mockResolvedValue(mockTasks)

    const result = await searchTasks("video")

    expect(result.tasks).toEqual(mockTasks)
    expect(result.error).toBeNull()
    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: "video", mode: "insensitive" } },
            { description: { contains: "video", mode: "insensitive" } },
          ],
        },
      })
    )
  })

  it("searches tasks by description when query is 3+ characters", async () => {
    const mockTasks = [
      { id: 2, name: "Task 2", description: "Fix video bug" },
    ]
    prisma.task.findMany.mockResolvedValue(mockTasks)

    const result = await searchTasks("video")

    expect(result.tasks).toEqual(mockTasks)
    expect(result.error).toBeNull()
  })

  it("returns empty array when no matches found", async () => {
    prisma.task.findMany.mockResolvedValue([])

    const result = await searchTasks("nonexistent")

    expect(result.tasks).toEqual([])
    expect(result.error).toBeNull()
  })

  it("handles database errors gracefully", async () => {
    prisma.task.findMany.mockRejectedValue(new Error("Database error"))

    const result = await searchTasks("test")

    expect(result.tasks).toEqual([])
    expect(result.error).toBe("Failed to search tasks.")
  })

  it("performs case-insensitive search", async () => {
    const mockTasks = [
      { id: 1, name: "Add VIDEO feature", description: "Description 1" },
    ]
    prisma.task.findMany.mockResolvedValue(mockTasks)

    await searchTasks("video")

    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: "video", mode: "insensitive" } },
            { description: { contains: "video", mode: "insensitive" } },
          ],
        },
      })
    )
  })
})

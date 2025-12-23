import { searchTasks } from "@/app/(dashboard)/tasks/actions"

// Mock prisma client
jest.mock("@/app/generated/prisma", () => {
  const mockFindMany = jest.fn()
  return {
    PrismaClient: jest.fn(() => ({
      task: {
        findMany: mockFindMany,
      },
      $disconnect: jest.fn(),
    })),
  }
})

// Mock revalidatePath
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }))

describe("searchTasks action", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("returns all tasks when query is empty", async () => {
    const mockTasks = [
      { id: 1, name: "Task 1", description: "Description 1" },
      { id: 2, name: "Task 2", description: "Description 2" },
    ]

    const { PrismaClient } = require("@/app/generated/prisma")
    const prismaInstance = new PrismaClient()
    prismaInstance.task.findMany.mockResolvedValue(mockTasks)

    const result = await searchTasks("")
    expect(result.tasks).toEqual(mockTasks)
    expect(result.error).toBeNull()
  })

  test("returns all tasks when query is less than 3 characters", async () => {
    const mockTasks = [
      { id: 1, name: "Task 1", description: "Description 1" },
    ]

    const { PrismaClient } = require("@/app/generated/prisma")
    const prismaInstance = new PrismaClient()
    prismaInstance.task.findMany.mockResolvedValue(mockTasks)

    const result = await searchTasks("ab")
    expect(result.tasks).toEqual(mockTasks)
  })

  test("searches tasks by name when query is 3+ characters", async () => {
    const mockTasks = [
      { id: 1, name: "Add video", description: "Description" },
    ]

    const { PrismaClient } = require("@/app/generated/prisma")
    const prismaInstance = new PrismaClient()
    prismaInstance.task.findMany.mockResolvedValue(mockTasks)

    const result = await searchTasks("Add vide")
    
    expect(prismaInstance.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({
              name: expect.objectContaining({
                contains: "Add vide",
                mode: "insensitive",
              }),
            }),
          ]),
        }),
      })
    )
    expect(result.tasks).toEqual(mockTasks)
  })

  test("searches tasks by description", async () => {
    const mockTasks = [
      { id: 1, name: "Task", description: "Add video feature" },
    ]

    const { PrismaClient } = require("@/app/generated/prisma")
    const prismaInstance = new PrismaClient()
    prismaInstance.task.findMany.mockResolvedValue(mockTasks)

    const result = await searchTasks("video")
    
    expect(prismaInstance.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({
              description: expect.objectContaining({
                contains: "video",
                mode: "insensitive",
              }),
            }),
          ]),
        }),
      })
    )
  })

  test("handles errors gracefully", async () => {
    const { PrismaClient } = require("@/app/generated/prisma")
    const prismaInstance = new PrismaClient()
    prismaInstance.task.findMany.mockRejectedValue(new Error("Database error"))

    const result = await searchTasks("test")
    expect(result.tasks).toEqual([])
    expect(result.error).toBe("Failed to search tasks.")
  })

  test("trims whitespace from query", async () => {
    const { PrismaClient } = require("@/app/generated/prisma")
    const prismaInstance = new PrismaClient()
    prismaInstance.task.findMany.mockResolvedValue([])

    await searchTasks("  test  ")
    
    expect(prismaInstance.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({
              name: expect.objectContaining({
                contains: "test",
              }),
            }),
          ]),
        }),
      })
    )
  })
})

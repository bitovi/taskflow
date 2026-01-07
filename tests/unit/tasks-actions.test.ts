import { createTask, getTeamStats, updateTask, bulkUpdateTaskStatus, bulkDeleteTasks } from '@/app/(dashboard)/tasks/actions'

// Mock prisma client used in module
jest.mock('@/app/generated/prisma', () => {
    const m = {
        PrismaClient: jest.fn(() => ({
            task: {
                create: jest.fn().mockResolvedValue(true),
                findMany: jest.fn().mockResolvedValue([]),
                delete: jest.fn().mockResolvedValue(true),
                update: jest.fn().mockResolvedValue(true),
                updateMany: jest.fn().mockResolvedValue({ count: 2 }),
                deleteMany: jest.fn().mockResolvedValue({ count: 2 }),
                count: jest.fn().mockResolvedValue(0),
            },
            user: {
                count: jest.fn().mockResolvedValue(0),
                findFirst: jest.fn().mockResolvedValue(null),
            },
            session: { deleteMany: jest.fn() },
            $disconnect: jest.fn()
        }))
    }
    return m
})

// Mock revalidatePath
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

// Mock getCurrentUser
jest.mock('@/app/login/actions', () => ({ getCurrentUser: jest.fn(async () => ({ id: 1 })) }))

describe('tasks actions', () => {
    beforeEach(() => {
        // Reset getCurrentUser mock before each test
        const auth = require('@/app/login/actions')
        auth.getCurrentUser = jest.fn(async () => ({ id: 1 }))
    })

    test('createTask returns error when missing title', async () => {
        const res = await createTask(new FormData())
        expect(res.success).toBe(false)
        expect(res.error).toBe('Title is required.')
    })

    test('getTeamStats returns object shape', async () => {
        const res = await getTeamStats()
        expect(res).toHaveProperty('totalMembers')
        expect(res).toHaveProperty('openTasks')
        expect(res).toHaveProperty('tasksCompleted')
    })

    test('updateTask returns error when not authenticated', async () => {
        // Override getCurrentUser to return null
        const auth = require('@/app/login/actions')
        auth.getCurrentUser = jest.fn(async () => null)
        const form = new FormData()
        form.set('title', 'hi')
        const res = await updateTask(1, form)
        expect(res.success).toBe(false)
        expect(res.error).toBe('Not authenticated.')
    })

    test('bulkUpdateTaskStatus returns error when not authenticated', async () => {
        const auth = require('@/app/login/actions')
        auth.getCurrentUser = jest.fn(async () => null)
        const res = await bulkUpdateTaskStatus([1, 2], 'done')
        expect(res.success).toBe(false)
        expect(res.error).toBe('Not authenticated.')
    })

    test('bulkUpdateTaskStatus returns error when no tasks selected', async () => {
        const res = await bulkUpdateTaskStatus([], 'done')
        expect(res.success).toBe(false)
        expect(res.error).toBe('No tasks selected.')
    })

    test('bulkUpdateTaskStatus updates tasks successfully', async () => {
        const res = await bulkUpdateTaskStatus([1, 2, 3], 'done')
        expect(res.success).toBe(true)
        expect(res.message).toContain('3 task(s)')
    })

    test('bulkDeleteTasks returns error when not authenticated', async () => {
        const auth = require('@/app/login/actions')
        auth.getCurrentUser = jest.fn(async () => null)
        const res = await bulkDeleteTasks([1, 2])
        expect(res.success).toBe(false)
        expect(res.error).toBe('Not authenticated.')
    })

    test('bulkDeleteTasks returns error when no tasks selected', async () => {
        const res = await bulkDeleteTasks([])
        expect(res.success).toBe(false)
        expect(res.error).toBe('No tasks selected.')
    })

    test('bulkDeleteTasks deletes tasks successfully', async () => {
        const res = await bulkDeleteTasks([1, 2])
        expect(res.success).toBe(true)
        expect(res.message).toContain('2 task(s)')
    })
})

import { createTask, getTeamStats, updateTask } from '@/app/(dashboard)/tasks/actions'

// Mock prisma client used in module
jest.mock('@/app/generated/prisma', () => {
    const m = {
        PrismaClient: jest.fn(() => ({
            task: {
                create: jest.fn().mockResolvedValue(true),
                findMany: jest.fn().mockResolvedValue([]),
                delete: jest.fn().mockResolvedValue(true),
                update: jest.fn().mockResolvedValue(true),
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
})

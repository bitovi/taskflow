import { login } from '@/app/login/actions'

jest.mock('@/app/generated/prisma', () => ({
    PrismaClient: jest.fn(() => ({
        user: { findUnique: jest.fn().mockResolvedValue({ id: 1, password: '$2a$10$hashed' }) },
        session: { create: jest.fn().mockResolvedValue(true), deleteMany: jest.fn() },
        $disconnect: jest.fn()
    }))
}))

jest.mock('next/headers', () => ({
    cookies: jest.fn(async () => ({
        set: jest.fn(),
        get: jest.fn(() => ({ value: 'token' })),
    }))
}))

jest.mock('bcryptjs', () => ({ compare: jest.fn(async () => true) }))

jest.mock('crypto', () => ({ randomBytes: jest.fn(() => ({ toString: () => 'token' })) }))

jest.mock('next/navigation', () => ({ redirect: jest.fn() }))

describe('login actions', () => {
    test('login validates missing fields', async () => {
        const res = await login(new FormData())
        expect(res).toHaveProperty('error')
    })

    test('getCurrentUser returns null when no session', async () => {
        const actions = require('@/app/login/actions')
        const cookieModule = require('next/headers')
        cookieModule.cookies = jest.fn(async () => ({ get: () => undefined }))
        const user = await actions.getCurrentUser()
        expect(user).toBeNull()
    })
})

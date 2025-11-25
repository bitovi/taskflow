const seed = require('../../prisma/seed')

describe('seed helpers', () => {
    test('getRandomElement returns element from array', () => {
        const arr = [1, 2, 3, 4]
        const el = seed.getRandomElement(arr)
        expect(arr).toContain(el)
    })

    test('getRandomDate returns a date between start and end', () => {
        const start = new Date(2025, 0, 1)
        const end = new Date(2025, 11, 31)
        const d = seed.getRandomDate(start, end)
        expect(d.getTime()).toBeGreaterThanOrEqual(start.getTime())
        expect(d.getTime()).toBeLessThanOrEqual(end.getTime())
    })
})

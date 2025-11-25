import { parseDateString, formatDateForInput, formatDateForDisplay } from '@/lib/date-utils'

describe('date-utils', () => {
    test('parseDateString returns Date at local noon', () => {
        const d = parseDateString('2025-11-24')
        expect(d.getFullYear()).toBe(2025)
        expect(d.getMonth()).toBe(10) // November -> 10 (0-indexed)
        expect(d.getDate()).toBe(24)
        expect(d.getHours()).toBe(12)
        expect(d.getMinutes()).toBe(0)
    })

    test('formatDateForInput formats Date and string correctly', () => {
        const date = new Date(2025, 10, 5) // Nov 05
        expect(formatDateForInput(date)).toBe('2025-11-05')
        expect(formatDateForInput('2025-11-05')).toBe('2025-11-05')
    })

    test('formatDateForDisplay returns short month and padded day', () => {
        const date = new Date(2025, 7, 8) // Aug 08
        expect(formatDateForDisplay(date)).toBe('Aug 08')
    })
})

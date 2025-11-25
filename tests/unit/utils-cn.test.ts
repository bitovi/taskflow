import { cn } from '@/lib/utils'

describe('cn utility', () => {
    test('joins truthy classes', () => {
        expect(cn('a', 'b', 'c')).toBe('a b c')
    })

    test('filters falsy values', () => {
        expect(cn('a', undefined, false, null, 'b')).toBe('a b')
    })

    test('returns empty string when nothing passed', () => {
        expect(cn()).toBe('')
    })
})

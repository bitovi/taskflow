import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock server actions
jest.mock('@/app/login/actions', () => ({
    getAllUsers: jest.fn(async () => [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
    ])
}))

import { TaskFilters } from '@/components/task-filters'

describe('TaskFilters', () => {
    const mockOnFilterChange = jest.fn()

    beforeEach(() => {
        mockOnFilterChange.mockClear()
    })

    test('renders all filter controls', async () => {
        render(<TaskFilters onFilterChange={mockOnFilterChange} />)

        // Check for filter sections
        expect(screen.getByText('Filters')).toBeInTheDocument()
        expect(screen.getByLabelText(/search/i)).toBeInTheDocument()
        expect(screen.getByText('Status')).toBeInTheDocument()
        expect(screen.getByText('Priority')).toBeInTheDocument()
        expect(screen.getByText('Assignee')).toBeInTheDocument()

        // Check for status badges
        expect(screen.getByText('Todo')).toBeInTheDocument()
        expect(screen.getByText('In Progress')).toBeInTheDocument()
        expect(screen.getByText('Review')).toBeInTheDocument()
        expect(screen.getByText('Done')).toBeInTheDocument()

        // Check for priority badges
        expect(screen.getByText('Low')).toBeInTheDocument()
        expect(screen.getByText('Medium')).toBeInTheDocument()
        expect(screen.getByText('High')).toBeInTheDocument()
    })

    test('calls onFilterChange when search input changes', async () => {
        const user = userEvent.setup()
        render(<TaskFilters onFilterChange={mockOnFilterChange} />)

        const searchInput = screen.getByLabelText(/search/i)
        await user.type(searchInput, 'test task')

        await waitFor(() => {
            expect(mockOnFilterChange).toHaveBeenCalled()
        })

        // Check that the last call includes the search term
        const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0]
        expect(lastCall.search).toBe('test task')
    })

    test('toggles status filter when badge is clicked', async () => {
        const user = userEvent.setup()
        render(<TaskFilters onFilterChange={mockOnFilterChange} />)

        const todoBadge = screen.getByText('Todo')
        await user.click(todoBadge)

        await waitFor(() => {
            const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0]
            expect(lastCall.status).toContain('todo')
        })

        // Click again to deselect
        await user.click(todoBadge)

        await waitFor(() => {
            const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0]
            expect(lastCall.status).not.toContain('todo')
        })
    })

    test('toggles priority filter when badge is clicked', async () => {
        const user = userEvent.setup()
        render(<TaskFilters onFilterChange={mockOnFilterChange} />)

        const highBadge = screen.getByText('High')
        await user.click(highBadge)

        await waitFor(() => {
            const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0]
            expect(lastCall.priority).toContain('high')
        })

        // Click again to deselect
        await user.click(highBadge)

        await waitFor(() => {
            const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0]
            expect(lastCall.priority).not.toContain('high')
        })
    })

    test('allows multiple status selections', async () => {
        const user = userEvent.setup()
        render(<TaskFilters onFilterChange={mockOnFilterChange} />)

        // Select multiple statuses
        await user.click(screen.getByText('Todo'))
        await user.click(screen.getByText('Done'))

        await waitFor(() => {
            const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0]
            expect(lastCall.status).toContain('todo')
            expect(lastCall.status).toContain('done')
        })
    })

    test('allows multiple priority selections', async () => {
        const user = userEvent.setup()
        render(<TaskFilters onFilterChange={mockOnFilterChange} />)

        // Select multiple priorities
        await user.click(screen.getByText('High'))
        await user.click(screen.getByText('Low'))

        await waitFor(() => {
            const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0]
            expect(lastCall.priority).toContain('high')
            expect(lastCall.priority).toContain('low')
        })
    })

    test('clears all filters when Clear All is clicked', async () => {
        const user = userEvent.setup()
        render(<TaskFilters onFilterChange={mockOnFilterChange} />)

        // Apply some filters
        const searchInput = screen.getByLabelText(/search/i)
        await user.type(searchInput, 'test')
        await user.click(screen.getByText('Todo'))
        await user.click(screen.getByText('High'))

        // Wait for filters to be applied
        await waitFor(() => {
            const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0]
            expect(lastCall.search).toBe('test')
        })

        // Click Clear All
        const clearButton = screen.getByText(/clear all/i)
        await user.click(clearButton)

        // Verify all filters are cleared
        await waitFor(() => {
            const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0]
            expect(lastCall.search).toBe('')
            expect(lastCall.status).toHaveLength(0)
            expect(lastCall.priority).toHaveLength(0)
        })
    })
})

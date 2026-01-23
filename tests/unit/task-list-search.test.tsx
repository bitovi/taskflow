import React from 'react'
import { render, screen } from '@testing-library/react'

// Mock fonts - must be before component imports
jest.mock('@/lib/fonts', () => ({
    poppins: { className: 'mocked-poppins' }
}))

// Mock next/font/google - must be before component imports
jest.mock('next/font/google', () => ({
    Poppins: () => ({ className: 'mocked-poppins' })
}))

// Mock server actions
jest.mock('@/app/(dashboard)/tasks/actions', () => ({
    deleteTask: jest.fn(),
    updateTaskStatus: jest.fn(),
}))

import { TaskList } from '@/components/task-list'

describe('TaskList search functionality', () => {
    const mockTasks = [
        {
            id: 1,
            name: 'Build Login Page',
            description: 'Create authentication form with email and password',
            status: 'todo',
            priority: 'high',
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: null,
            creatorId: 1,
            assigneeId: 1,
            assignee: { name: 'John Doe' },
        },
        {
            id: 2,
            name: 'Fix Navigation Bug',
            description: 'Navigation menu is not responsive on mobile',
            status: 'in_progress',
            priority: 'medium',
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: null,
            creatorId: 1,
            assigneeId: 2,
            assignee: { name: 'Jane Smith' },
        },
        {
            id: 3,
            name: 'Update Documentation',
            description: 'Add API reference to developer docs',
            status: 'done',
            priority: 'low',
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: null,
            creatorId: 1,
            assigneeId: 3,
            assignee: { name: 'Bob Johnson' },
        },
    ]

    test('displays all tasks when search query is empty', () => {
        render(<TaskList initialTasks={mockTasks} searchQuery="" />)
        
        expect(screen.getByText('Build Login Page')).toBeInTheDocument()
        expect(screen.getByText('Fix Navigation Bug')).toBeInTheDocument()
        expect(screen.getByText('Update Documentation')).toBeInTheDocument()
    })

    test('filters tasks by name', () => {
        render(<TaskList initialTasks={mockTasks} searchQuery="Login" />)
        
        expect(screen.getByText('Build Login Page')).toBeInTheDocument()
        expect(screen.queryByText('Fix Navigation Bug')).not.toBeInTheDocument()
        expect(screen.queryByText('Update Documentation')).not.toBeInTheDocument()
    })

    test('filters tasks by description', () => {
        render(<TaskList initialTasks={mockTasks} searchQuery="mobile" />)
        
        expect(screen.queryByText('Build Login Page')).not.toBeInTheDocument()
        expect(screen.getByText('Fix Navigation Bug')).toBeInTheDocument()
        expect(screen.queryByText('Update Documentation')).not.toBeInTheDocument()
    })

    test('search is case-insensitive', () => {
        render(<TaskList initialTasks={mockTasks} searchQuery="NAVIGATION" />)
        
        expect(screen.getByText('Fix Navigation Bug')).toBeInTheDocument()
    })

    test('shows message when no tasks match search', () => {
        render(<TaskList initialTasks={mockTasks} searchQuery="nonexistent" />)
        
        expect(screen.getByText('No tasks found matching your search.')).toBeInTheDocument()
        expect(screen.queryByText('Build Login Page')).not.toBeInTheDocument()
    })

    test('shows different message when there are no tasks and no search', () => {
        render(<TaskList initialTasks={[]} searchQuery="" />)
        
        expect(screen.getByText('No tasks yet.')).toBeInTheDocument()
    })
})

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TasksPageClient } from '@/components/tasks-page-client'
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

// Mock the TaskList component
jest.mock('@/components/task-list', () => ({
    TaskList: ({ initialTasks, searchQuery }: { initialTasks: TaskWithProfile[], searchQuery?: string }) => (
        <div data-testid="task-list" data-search-query={searchQuery}>
            {initialTasks.map((task: TaskWithProfile) => (
                <div key={task.id}>{task.name}</div>
            ))}
        </div>
    )
}))

describe('TasksPageClient', () => {
    const mockTasks = [
        {
            id: 1,
            name: 'Test Task 1',
            description: 'Description 1',
            status: 'todo',
            priority: 'high',
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: null,
            creatorId: 1,
            assigneeId: null,
        },
        {
            id: 2,
            name: 'Test Task 2',
            description: 'Description 2',
            status: 'in_progress',
            priority: 'medium',
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: null,
            creatorId: 1,
            assigneeId: null,
        },
    ]

    test('renders search input', () => {
        render(<TasksPageClient tasks={mockTasks} />)
        expect(screen.getByTestId('task-search-input')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Search tasks by title or description...')).toBeInTheDocument()
    })

    test('updates search query on input change', () => {
        render(<TasksPageClient tasks={mockTasks} />)
        const searchInput = screen.getByTestId('task-search-input') as HTMLInputElement
        
        fireEvent.change(searchInput, { target: { value: 'test query' } })
        
        expect(searchInput.value).toBe('test query')
    })

    test('passes search query to TaskList', () => {
        render(<TasksPageClient tasks={mockTasks} />)
        const searchInput = screen.getByTestId('task-search-input')
        
        fireEvent.change(searchInput, { target: { value: 'search term' } })
        
        const taskList = screen.getByTestId('task-list')
        expect(taskList).toHaveAttribute('data-search-query', 'search term')
    })
})

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskSearchFilter } from '@/components/task-search-filter'
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
}

// Mock data for testing
const mockTasks: TaskWithProfile[] = [
  {
    id: 1,
    name: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new project',
    status: 'todo',
    priority: 'high',
    dueDate: new Date('2024-01-15'),
    userId: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    assignee: { name: 'John Doe' }
  },
  {
    id: 2,
    name: 'Fix bug in login system',
    description: 'Resolve authentication issues reported by users',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date('2024-01-20'),
    userId: 2,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    assignee: { name: 'Jane Smith' }
  },
  {
    id: 3,
    name: 'Code review for feature X',
    description: 'Review pull request for new feature implementation',
    status: 'review',
    priority: 'low',
    dueDate: new Date('2024-01-25'),
    userId: 3,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    assignee: { name: 'Bob Wilson' }
  },
  {
    id: 4,
    name: 'Deploy to production',
    description: 'Deploy the latest version to production environment',
    status: 'done',
    priority: 'high',
    dueDate: new Date('2024-01-10'),
    userId: 1,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
    assignee: { name: 'John Doe' }
  }
]

describe('TaskSearchFilter', () => {
  const mockOnFilteredTasksChange = jest.fn()

  beforeEach(() => {
    mockOnFilteredTasksChange.mockClear()
  })

  it('renders search input and filter button', () => {
    render(
      <TaskSearchFilter 
        tasks={mockTasks} 
        onFilteredTasksChange={mockOnFilteredTasksChange} 
      />
    )

    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument()
    // The filter button doesn't have accessible text, so we look for the button by its attributes
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('filters tasks by search query in task name', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskSearchFilter 
        tasks={mockTasks} 
        onFilteredTasksChange={mockOnFilteredTasksChange} 
      />
    )

    const searchInput = screen.getByPlaceholderText('Search tasks...')
    await user.type(searchInput, 'documentation')

    await waitFor(() => {
      expect(mockOnFilteredTasksChange).toHaveBeenCalledWith([mockTasks[0]])
    })
  })

  it('filters tasks by search query in task description', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskSearchFilter 
        tasks={mockTasks} 
        onFilteredTasksChange={mockOnFilteredTasksChange} 
      />
    )

    const searchInput = screen.getByPlaceholderText('Search tasks...')
    await user.type(searchInput, 'authentication')

    await waitFor(() => {
      expect(mockOnFilteredTasksChange).toHaveBeenCalledWith([mockTasks[1]])
    })
  })

  it('performs case-insensitive search', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskSearchFilter 
        tasks={mockTasks} 
        onFilteredTasksChange={mockOnFilteredTasksChange} 
      />
    )

    const searchInput = screen.getByPlaceholderText('Search tasks...')
    await user.type(searchInput, 'DOCUMENTATION')

    await waitFor(() => {
      expect(mockOnFilteredTasksChange).toHaveBeenCalledWith([mockTasks[0]])
    })
  })

  it('shows clear button when search has text', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskSearchFilter 
        tasks={mockTasks} 
        onFilteredTasksChange={mockOnFilteredTasksChange} 
      />
    )

    const searchInput = screen.getByPlaceholderText('Search tasks...')
    
    // Initially only filter button
    expect(screen.getAllByRole('button')).toHaveLength(1)
    
    // Type something
    await user.type(searchInput, 'test')
    
    // Clear button should appear (now we have 2 buttons: filter + clear)
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('clears search when clear button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskSearchFilter 
        tasks={mockTasks} 
        onFilteredTasksChange={mockOnFilteredTasksChange} 
      />
    )

    const searchInput = screen.getByPlaceholderText('Search tasks...')
    
    // Type something
    await user.type(searchInput, 'documentation')
    expect(searchInput).toHaveValue('documentation')
    
    // Find the clear button (should be the second button, first is filter)
    const buttons = screen.getAllByRole('button')
    const clearButton = buttons[1] // Clear button is the second one
    await user.click(clearButton)
    
    expect(searchInput).toHaveValue('')
  })

  it('filters by status when filter is toggled', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskSearchFilter 
        tasks={mockTasks} 
        onFilteredTasksChange={mockOnFilteredTasksChange} 
      />
    )

    // Open filter dropdown (first button is the filter button)
    const filterButton = screen.getAllByRole('button')[0]
    await user.click(filterButton)

    // Uncheck "todo" status
    const todoCheckbox = screen.getByRole('menuitemcheckbox', { name: /todo/i })
    await user.click(todoCheckbox)

    await waitFor(() => {
      // Should exclude the todo task (mockTasks[0])
      const expectedTasks = mockTasks.filter(task => task.status !== 'todo')
      expect(mockOnFilteredTasksChange).toHaveBeenCalledWith(expectedTasks)
    })
  })

  it('filters by priority when filter is toggled', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskSearchFilter 
        tasks={mockTasks} 
        onFilteredTasksChange={mockOnFilteredTasksChange} 
      />
    )

    // Open filter dropdown
    const filterButton = screen.getAllByRole('button')[0]
    await user.click(filterButton)

    // Uncheck "high" priority
    const highPriorityCheckbox = screen.getByRole('menuitemcheckbox', { name: /high/i })
    await user.click(highPriorityCheckbox)

    await waitFor(() => {
      // Should exclude high priority tasks (mockTasks[0] and mockTasks[3])
      const expectedTasks = mockTasks.filter(task => task.priority !== 'high')
      expect(mockOnFilteredTasksChange).toHaveBeenCalledWith(expectedTasks)
    })
  })

  it('combines search and status filters', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskSearchFilter 
        tasks={mockTasks} 
        onFilteredTasksChange={mockOnFilteredTasksChange} 
      />
    )

    // First apply search filter
    const searchInput = screen.getByPlaceholderText('Search tasks...')
    await user.type(searchInput, 'bug')

    // Then apply status filter
    const filterButton = screen.getAllByRole('button')[0]
    await user.click(filterButton)

    const todoCheckbox = screen.getByRole('menuitemcheckbox', { name: /todo/i })
    await user.click(todoCheckbox)

    await waitFor(() => {
      // Should only include tasks that match "bug" AND are not "todo"
      // Only mockTasks[1] matches "bug" and it's "in_progress"
      expect(mockOnFilteredTasksChange).toHaveBeenCalledWith([mockTasks[1]])
    })
  })

  it('returns all tasks when no filters are applied', () => {
    render(
      <TaskSearchFilter 
        tasks={mockTasks} 
        onFilteredTasksChange={mockOnFilteredTasksChange} 
      />
    )

    expect(mockOnFilteredTasksChange).toHaveBeenCalledWith(mockTasks)
  })

  it('returns empty array when all status filters are unchecked', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskSearchFilter 
        tasks={mockTasks} 
        onFilteredTasksChange={mockOnFilteredTasksChange} 
      />
    )

    // Open filter dropdown
    const filterButton = screen.getAllByRole('button')[0]
    await user.click(filterButton)

    // Uncheck all status filters
    const statusCheckboxes = [
      screen.getByRole('menuitemcheckbox', { name: /todo/i }),
      screen.getByRole('menuitemcheckbox', { name: /in progress/i }),
      screen.getByRole('menuitemcheckbox', { name: /review/i }),
      screen.getByRole('menuitemcheckbox', { name: /done/i })
    ]

    for (const checkbox of statusCheckboxes) {
      await user.click(checkbox)
    }

    await waitFor(() => {
      expect(mockOnFilteredTasksChange).toHaveBeenCalledWith([])
    })
  })

  it('returns empty array when all priority filters are unchecked', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskSearchFilter 
        tasks={mockTasks} 
        onFilteredTasksChange={mockOnFilteredTasksChange} 
      />
    )

    // Open filter dropdown
    const filterButton = screen.getAllByRole('button')[0]
    await user.click(filterButton)

    // Uncheck all priority filters
    const priorityCheckboxes = [
      screen.getByRole('menuitemcheckbox', { name: /high/i }),
      screen.getByRole('menuitemcheckbox', { name: /medium/i }),
      screen.getByRole('menuitemcheckbox', { name: /low/i })
    ]

    for (const checkbox of priorityCheckboxes) {
      await user.click(checkbox)
    }

    await waitFor(() => {
      expect(mockOnFilteredTasksChange).toHaveBeenCalledWith([])
    })
  })

  it('handles empty tasks array', () => {
    render(
      <TaskSearchFilter 
        tasks={[]} 
        onFilteredTasksChange={mockOnFilteredTasksChange} 
      />
    )

    expect(mockOnFilteredTasksChange).toHaveBeenCalledWith([])
  })
})
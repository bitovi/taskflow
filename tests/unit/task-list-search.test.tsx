import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from '@/components/task-list';
import { Task, User } from '@/app/generated/prisma/client';

// Mock server actions
jest.mock('@/app/(dashboard)/tasks/actions', () => ({
  deleteTask: jest.fn(),
  updateTaskStatus: jest.fn(),
}));

type TaskWithProfile = Task & {
  assignee?: Pick<User, "name"> | null;
};

describe('TaskList Search Functionality', () => {
  const mockTasks: TaskWithProfile[] = [
    {
      id: 1,
      name: 'Implement login feature',
      description: 'Add authentication to the app',
      status: 'todo',
      priority: 'high',
      dueDate: new Date('2024-12-31'),
      creatorId: 1,
      assigneeId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      assignee: { name: 'John Doe' },
    },
    {
      id: 2,
      name: 'Fix navigation bug',
      description: 'The menu is not working properly',
      status: 'in_progress',
      priority: 'medium',
      dueDate: new Date('2024-12-25'),
      creatorId: 1,
      assigneeId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      assignee: { name: 'Jane Smith' },
    },
    {
      id: 3,
      name: 'Update documentation',
      description: 'Add API documentation for endpoints',
      status: 'done',
      priority: 'low',
      dueDate: new Date('2024-12-20'),
      creatorId: 1,
      assigneeId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      assignee: { name: 'John Doe' },
    },
  ];

  it('should display all tasks when search is empty', () => {
    render(<TaskList initialTasks={mockTasks} />);
    
    expect(screen.getByText('Implement login feature')).toBeInTheDocument();
    expect(screen.getByText('Fix navigation bug')).toBeInTheDocument();
    expect(screen.getByText('Update documentation')).toBeInTheDocument();
  });

  it('should filter tasks by title', async () => {
    const user = userEvent.setup();
    render(<TaskList initialTasks={mockTasks} />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks by title or description...');
    await user.type(searchInput, 'login');
    
    await waitFor(() => {
      expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      expect(screen.queryByText('Fix navigation bug')).not.toBeInTheDocument();
      expect(screen.queryByText('Update documentation')).not.toBeInTheDocument();
    });
  });

  it('should filter tasks by description', async () => {
    const user = userEvent.setup();
    render(<TaskList initialTasks={mockTasks} />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks by title or description...');
    await user.type(searchInput, 'API');
    
    await waitFor(() => {
      expect(screen.queryByText('Implement login feature')).not.toBeInTheDocument();
      expect(screen.queryByText('Fix navigation bug')).not.toBeInTheDocument();
      expect(screen.getByText('Update documentation')).toBeInTheDocument();
    });
  });

  it('should be case-insensitive', async () => {
    const user = userEvent.setup();
    render(<TaskList initialTasks={mockTasks} />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks by title or description...');
    await user.type(searchInput, 'NAVIGATION');
    
    await waitFor(() => {
      expect(screen.queryByText('Implement login feature')).not.toBeInTheDocument();
      expect(screen.getByText('Fix navigation bug')).toBeInTheDocument();
      expect(screen.queryByText('Update documentation')).not.toBeInTheDocument();
    });
  });

  it('should show no tasks when search has no matches', async () => {
    const user = userEvent.setup();
    render(<TaskList initialTasks={mockTasks} />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks by title or description...');
    await user.type(searchInput, 'nonexistent');
    
    await waitFor(() => {
      expect(screen.queryByText('Implement login feature')).not.toBeInTheDocument();
      expect(screen.queryByText('Fix navigation bug')).not.toBeInTheDocument();
      expect(screen.queryByText('Update documentation')).not.toBeInTheDocument();
    });
  });

  it('should update results in real-time', async () => {
    const user = userEvent.setup();
    render(<TaskList initialTasks={mockTasks} />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks by title or description...');
    
    // Type 'bug'
    await user.type(searchInput, 'bug');
    await waitFor(() => {
      expect(screen.getByText('Fix navigation bug')).toBeInTheDocument();
      expect(screen.queryByText('Implement login feature')).not.toBeInTheDocument();
    });
    
    // Clear and type 'documentation'
    await user.clear(searchInput);
    await user.type(searchInput, 'documentation');
    await waitFor(() => {
      expect(screen.getByText('Update documentation')).toBeInTheDocument();
      expect(screen.queryByText('Fix navigation bug')).not.toBeInTheDocument();
    });
  });
});

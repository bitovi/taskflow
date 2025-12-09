import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TasksSearch } from '@/components/tasks-search';

const mockTasks = [
  {
    id: 1,
    name: 'Test Task 1',
    description: 'Description 1',
    status: 'todo',
    priority: 'high',
    dueDate: new Date('2025-01-15'),
    assigneeId: 1,
    creatorId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    assignee: { id: 1, name: 'Alice Johnson' },
  },
  {
    id: 2,
    name: 'Test Task 2',
    description: 'Description 2',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date('2025-01-20'),
    assigneeId: 2,
    creatorId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    assignee: { id: 2, name: 'Bob Smith' },
  },
  {
    id: 3,
    name: 'Video Task',
    description: 'Add video feature',
    status: 'done',
    priority: 'low',
    dueDate: null,
    assigneeId: 1,
    creatorId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    assignee: { id: 1, name: 'Alice Johnson' },
  },
];

const mockUsers = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Smith' },
];

describe('TasksSearch', () => {
  it('renders search input', () => {
    render(<TasksSearch initialTasks={mockTasks} users={mockUsers} />);
    const searchInput = screen.getByPlaceholderText('Search tasks by title, tag, or ID');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders all filter buttons', () => {
    render(<TasksSearch initialTasks={mockTasks} users={mockUsers} />);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'In progress' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Any' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Overdue' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'This week' })).toBeInTheDocument();
  });

  it('renders tasks table', () => {
    render(<TasksSearch initialTasks={mockTasks} users={mockUsers} />);
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('Video Task')).toBeInTheDocument();
  });

  it('filters tasks by search query', async () => {
    render(<TasksSearch initialTasks={mockTasks} users={mockUsers} />);
    const searchInput = screen.getByPlaceholderText('Search tasks by title, tag, or ID');
    
    fireEvent.change(searchInput, { target: { value: 'video' } });
    
    await waitFor(() => {
      expect(screen.getByText('Video Task')).toBeInTheDocument();
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
    });
  });

  it('filters tasks by status', async () => {
    render(<TasksSearch initialTasks={mockTasks} users={mockUsers} />);
    const doneButton = screen.getByRole('button', { name: 'Done' });
    
    fireEvent.click(doneButton);
    
    await waitFor(() => {
      expect(screen.getByText('Video Task')).toBeInTheDocument();
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
    });
  });

  it('shows empty state when no tasks match', async () => {
    render(<TasksSearch initialTasks={mockTasks} users={mockUsers} />);
    const searchInput = screen.getByPlaceholderText('Search tasks by title, tag, or ID');
    
    fireEvent.change(searchInput, { target: { value: 'nonexistent task' } });
    
    await waitFor(() => {
      expect(screen.getByText('No tasks match your search')).toBeInTheDocument();
    });
  });

  it('shows pagination controls when there are multiple pages', () => {
    const manyTasks = Array.from({ length: 15 }, (_, i) => ({
      ...mockTasks[0],
      id: i + 1,
      name: `Task ${i + 1}`,
    }));
    
    render(<TasksSearch initialTasks={manyTasks} users={mockUsers} />);
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/ })).toBeInTheDocument();
  });

  it('navigates between pages', async () => {
    const manyTasks = Array.from({ length: 15 }, (_, i) => ({
      ...mockTasks[0],
      id: i + 1,
      name: `Task ${i + 1}`,
    }));
    
    render(<TasksSearch initialTasks={manyTasks} users={mockUsers} />);
    const nextButton = screen.getByRole('button', { name: /Next/ });
    
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    });
  });
});

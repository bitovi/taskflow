import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { TasksPageClient } from "@/components/tasks-page-client"
import { useSearchParams } from "next/navigation"
import { searchTasks } from "@/app/(dashboard)/tasks/actions"

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}))

// Mock search action
jest.mock("@/app/(dashboard)/tasks/actions", () => ({
  searchTasks: jest.fn(),
}))

// Mock fonts
jest.mock("@/lib/fonts", () => ({
  poppins: { className: "mocked-poppins" },
}))

// Mock child components
jest.mock("@/components/task-list", () => ({
  TaskList: ({ initialTasks }: { initialTasks: unknown[] }) => (
    <div data-testid="task-list">
      {initialTasks.length} tasks
    </div>
  ),
}))

jest.mock("@/components/ui/empty-state", () => ({
  EmptyState: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="empty-state">
      <div>{title}</div>
      <div>{description}</div>
    </div>
  ),
}))

describe("TasksPageClient", () => {
  const mockTasks = [
    { 
      id: 1, 
      name: "Task 1", 
      description: "Description 1", 
      status: "todo", 
      priority: "medium", 
      createdAt: new Date(), 
      updatedAt: new Date(),
      dueDate: null,
      assigneeId: null,
      creatorId: 1,
      assignee: null 
    },
    { 
      id: 2, 
      name: "Task 2", 
      description: "Description 2", 
      status: "done", 
      priority: "high", 
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: null,
      assigneeId: null,
      creatorId: 1,
      assignee: null 
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    })
    ;(searchTasks as jest.Mock).mockResolvedValue({ tasks: mockTasks, error: null })
    
    // Mock window.history.pushState
    Object.defineProperty(window, "history", {
      writable: true,
      value: {
        pushState: jest.fn(),
      },
    })
  })

  test("renders search input", () => {
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const searchInput = screen.getByPlaceholderText("Search tasks...")
    expect(searchInput).toBeInTheDocument()
  })

  test("renders initial tasks", () => {
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    expect(screen.getByTestId("task-list")).toBeInTheDocument()
    expect(screen.getByText("2 tasks")).toBeInTheDocument()
  })

  test("updates search query on input change", () => {
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const searchInput = screen.getByPlaceholderText("Search tasks...") as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: "test" } })
    
    expect(searchInput.value).toBe("test")
  })

  test("shows clear button when query is not empty", () => {
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const searchInput = screen.getByPlaceholderText("Search tasks...")
    fireEvent.change(searchInput, { target: { value: "test" } })
    
    const clearButton = screen.getByLabelText("Clear search")
    expect(clearButton).toBeInTheDocument()
  })

  test("clears search when clear button is clicked", () => {
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const searchInput = screen.getByPlaceholderText("Search tasks...") as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: "test" } })
    
    const clearButton = screen.getByLabelText("Clear search")
    fireEvent.click(clearButton)
    
    expect(searchInput.value).toBe("")
  })

  test("does not search with less than 3 characters", async () => {
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const searchInput = screen.getByPlaceholderText("Search tasks...")
    
    // Clear any previous calls
    jest.clearAllMocks()
    
    fireEvent.change(searchInput, { target: { value: "ab" } })
    
    // Wait a bit to ensure no search is triggered
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // searchTasks should not be called for queries < 3 chars (except empty)
    expect(searchTasks).not.toHaveBeenCalled()
  })

  test("searches with 3 or more characters", async () => {
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const searchInput = screen.getByPlaceholderText("Search tasks...")
    fireEvent.change(searchInput, { target: { value: "test" } })
    
    await waitFor(() => {
      expect(searchTasks).toHaveBeenCalledWith("test")
    })
  })

  test("shows empty state when no results", async () => {
    ;(searchTasks as jest.Mock).mockResolvedValue({ tasks: [], error: null })
    
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const searchInput = screen.getByPlaceholderText("Search tasks...")
    fireEvent.change(searchInput, { target: { value: "nonexistent" } })
    
    await waitFor(() => {
      expect(screen.getByTestId("empty-state")).toBeInTheDocument()
      expect(screen.getByText("No tasks found")).toBeInTheDocument()
    })
  })

  test("updates URL with search query", async () => {
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const searchInput = screen.getByPlaceholderText("Search tasks...")
    fireEvent.change(searchInput, { target: { value: "test" } })
    
    await waitFor(() => {
      expect(window.history.pushState).toHaveBeenCalled()
    })
  })

  test("syncs with URL query parameter", () => {
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("initial query"),
    })
    
    render(<TasksPageClient initialTasks={mockTasks} initialQuery="initial query" />)
    
    const searchInput = screen.getByPlaceholderText("Search tasks...") as HTMLInputElement
    expect(searchInput.value).toBe("initial query")
  })

  test("renders filter button", () => {
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const filterButton = screen.getByLabelText("Filter tasks")
    expect(filterButton).toBeInTheDocument()
  })

  test("renders new task button", () => {
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const newTaskButton = screen.getByText("New Task")
    expect(newTaskButton).toBeInTheDocument()
  })
})

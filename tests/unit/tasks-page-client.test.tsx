import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TasksPageClient } from "@/components/tasks-page-client"
import { searchTasks } from "@/app/(dashboard)/tasks/actions"

// Mock the actions
jest.mock("@/app/(dashboard)/tasks/actions", () => ({
  searchTasks: jest.fn(),
}))

// Mock URL and history APIs
const mockPushState = jest.fn()
const mockSearchParams = new URLSearchParams()

Object.defineProperty(window, "history", {
  writable: true,
  value: { pushState: mockPushState },
})

Object.defineProperty(window, "location", {
  writable: true,
  value: {
    href: "http://localhost/tasks",
    search: "",
  },
})

const mockTasks = [
  {
    id: 1,
    name: "Task 1",
    description: "Description 1",
    status: "todo",
    priority: "high",
    dueDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 1,
    assigneeId: 1,
    assignee: { name: "John Doe" },
  },
  {
    id: 2,
    name: "Add video feature",
    description: "Add video upload functionality",
    status: "in_progress",
    priority: "medium",
    dueDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 1,
    assigneeId: 1,
    assignee: { name: "Jane Smith" },
  },
]

describe("TasksPageClient", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPushState.mockClear()
    window.history.pushState({}, "", "http://localhost/tasks")
  })

  it("renders search input with placeholder", () => {
    render(<TasksPageClient initialTasks={mockTasks} />)
    expect(screen.getByTestId("search-input")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Search tasks...")).toBeInTheDocument()
  })

  it("renders filter button", () => {
    render(<TasksPageClient initialTasks={mockTasks} />)
    expect(screen.getByTestId("filter-button")).toBeInTheDocument()
  })

  it("displays all tasks initially", () => {
    render(<TasksPageClient initialTasks={mockTasks} />)
    expect(screen.getByText("Task 1")).toBeInTheDocument()
    expect(screen.getByText("Add video feature")).toBeInTheDocument()
  })

  it("does not trigger search with less than 3 characters", async () => {
    const user = userEvent.setup()
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const searchInput = screen.getByTestId("search-input")
    await user.type(searchInput, "ab")
    
    await waitFor(() => {
      expect(searchTasks).not.toHaveBeenCalled()
    })
  })

  it("triggers search with 3 or more characters", async () => {
    const user = userEvent.setup()
    const filteredTasks = [mockTasks[1]]
    ;(searchTasks as jest.Mock).mockResolvedValue({ tasks: filteredTasks, error: null })
    
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const searchInput = screen.getByTestId("search-input")
    await user.type(searchInput, "Add vide")
    
    await waitFor(
      () => {
        expect(searchTasks).toHaveBeenCalledWith("Add vide")
      },
      { timeout: 500 }
    )
  })

  it("shows clear button when search query is present", async () => {
    const user = userEvent.setup()
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const searchInput = screen.getByTestId("search-input")
    await user.type(searchInput, "test")
    
    await waitFor(() => {
      expect(screen.getByTestId("clear-search")).toBeInTheDocument()
    })
  })

  it("clears search when clear button is clicked", async () => {
    const user = userEvent.setup()
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const searchInput = screen.getByTestId("search-input")
    await user.type(searchInput, "test")
    
    await waitFor(() => {
      expect(screen.getByTestId("clear-search")).toBeInTheDocument()
    })
    
    const clearButton = screen.getByTestId("clear-search")
    await user.click(clearButton)
    
    expect(searchInput).toHaveValue("")
  })

  it("displays empty state when search returns no results", async () => {
    const user = userEvent.setup()
    ;(searchTasks as jest.Mock).mockResolvedValue({ tasks: [], error: null })
    
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const searchInput = screen.getByTestId("search-input")
    await user.type(searchInput, "xyz")
    
    await waitFor(
      () => {
        expect(screen.getByText("No tasks found")).toBeInTheDocument()
      },
      { timeout: 500 }
    )
  })

  it("updates URL when search is performed", async () => {
    const user = userEvent.setup()
    ;(searchTasks as jest.Mock).mockResolvedValue({ tasks: mockTasks, error: null })
    
    render(<TasksPageClient initialTasks={mockTasks} />)
    
    const searchInput = screen.getByTestId("search-input")
    await user.type(searchInput, "test")
    
    await waitFor(
      () => {
        expect(mockPushState).toHaveBeenCalled()
      },
      { timeout: 500 }
    )
  })
})

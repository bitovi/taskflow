import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useSearchParams } from "next/navigation"

// Mock fonts before other imports
jest.mock("next/font/google", () => ({
  Poppins: jest.fn(() => ({
    className: "poppins-mock",
  })),
}))

// Mock dependencies
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}))

jest.mock("@/app/(dashboard)/tasks/actions", () => ({
  searchTasks: jest.fn(),
}))

import { TasksPageClient } from "@/components/tasks-page-client"
import { searchTasks } from "@/app/(dashboard)/tasks/actions"

const mockTasks = [
  {
    id: 1,
    name: "Add video feature",
    description: "Implement video upload functionality",
    status: "todo",
    priority: "high",
    dueDate: new Date("2025-12-15"),
    createdAt: new Date("2025-12-01"),
    updatedAt: new Date("2025-12-01"),
    creatorId: 1,
    assigneeId: 1,
    assignee: { name: "Alice Johnson" },
  },
  {
    id: 2,
    name: "Fix bug in login",
    description: "Users cannot log in with email",
    status: "in_progress",
    priority: "medium",
    dueDate: new Date("2025-12-12"),
    createdAt: new Date("2025-12-02"),
    updatedAt: new Date("2025-12-02"),
    creatorId: 2,
    assigneeId: 2,
    assignee: { name: "Bob Smith" },
  },
]

describe("TasksPageClient", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
    // Mock window.history.pushState
    window.history.pushState = jest.fn()
  })

  it("renders search input and filter button", () => {
    render(<TasksPageClient initialTasks={mockTasks} initialQuery="" />)

    expect(screen.getByTestId("search-input")).toBeInTheDocument()
    expect(screen.getByTestId("filter-button")).toBeInTheDocument()
  })

  it("displays initial tasks", () => {
    render(<TasksPageClient initialTasks={mockTasks} initialQuery="" />)

    expect(screen.getByText("Add video feature")).toBeInTheDocument()
    expect(screen.getByText("Fix bug in login")).toBeInTheDocument()
  })

  it("shows clear button when query is not empty", async () => {
    const user = userEvent.setup()
    render(<TasksPageClient initialTasks={mockTasks} initialQuery="" />)

    const searchInput = screen.getByTestId("search-input")
    await user.type(searchInput, "video")

    await waitFor(() => {
      expect(screen.getByTestId("clear-search")).toBeInTheDocument()
    })
  })

  it("does not search when query is less than 3 characters", async () => {
    const user = userEvent.setup()
    ;(searchTasks as jest.Mock).mockResolvedValue({ tasks: mockTasks, error: null })

    render(<TasksPageClient initialTasks={mockTasks} initialQuery="" />)

    const searchInput = screen.getByTestId("search-input")
    await user.type(searchInput, "ab")

    // Wait a bit to ensure debounce wouldn't trigger
    await waitFor(() => expect(searchInput).toHaveValue("ab"), { timeout: 500 })
    
    // searchTasks should not be called with short queries
    expect(searchTasks).not.toHaveBeenCalled()
  })

  it("searches when query is 3 or more characters", async () => {
    const user = userEvent.setup()
    const filteredTasks = [mockTasks[0]]
    ;(searchTasks as jest.Mock).mockResolvedValue({ tasks: filteredTasks, error: null })

    render(<TasksPageClient initialTasks={mockTasks} initialQuery="" />)

    const searchInput = screen.getByTestId("search-input")
    await user.type(searchInput, "video")

    await waitFor(() => {
      expect(searchTasks).toHaveBeenCalledWith("video")
    })
  })

  it("shows empty state when search returns no results", async () => {
    const user = userEvent.setup()
    ;(searchTasks as jest.Mock).mockResolvedValue({ tasks: [], error: null })

    render(<TasksPageClient initialTasks={mockTasks} initialQuery="" />)

    const searchInput = screen.getByTestId("search-input")
    await user.type(searchInput, "xyz")

    await waitFor(() => {
      expect(screen.getByTestId("empty-state")).toBeInTheDocument()
      expect(screen.getByText("No tasks found")).toBeInTheDocument()
    })
  })

  it("clears search when clear button is clicked", async () => {
    const user = userEvent.setup()
    ;(searchTasks as jest.Mock).mockResolvedValue({ tasks: mockTasks, error: null })

    render(<TasksPageClient initialTasks={mockTasks} initialQuery="video" />)

    const clearButton = screen.getByTestId("clear-search")
    await user.click(clearButton)

    await waitFor(() => {
      expect(screen.getByTestId("search-input")).toHaveValue("")
    })
  })

  it("updates URL when search query changes", async () => {
    const user = userEvent.setup()
    ;(searchTasks as jest.Mock).mockResolvedValue({ tasks: mockTasks, error: null })

    render(<TasksPageClient initialTasks={mockTasks} initialQuery="" />)

    const searchInput = screen.getByTestId("search-input")
    await user.type(searchInput, "video")

    await waitFor(() => {
      expect(window.history.pushState).toHaveBeenCalledWith(null, "", "?search=video")
    })
  })

  it("restores search from initialQuery", () => {
    render(<TasksPageClient initialTasks={mockTasks} initialQuery="video" />)

    expect(screen.getByTestId("search-input")).toHaveValue("video")
  })

  it("shows loading spinner during search", async () => {
    const user = userEvent.setup()
    ;(searchTasks as jest.Mock).mockImplementation(() => 
      new Promise((resolve) => setTimeout(() => resolve({ tasks: mockTasks, error: null }), 500))
    )

    render(<TasksPageClient initialTasks={mockTasks} initialQuery="" />)

    const searchInput = screen.getByTestId("search-input")
    await user.type(searchInput, "video")

    await waitFor(() => {
      expect(screen.getByTestId("search-spinner")).toBeInTheDocument()
    })
  })
})

import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { EmptyState } from "@/components/empty-state"

describe("EmptyState", () => {
  it("renders the empty state with correct text", () => {
    render(<EmptyState />)
    
    expect(screen.getByText("No tasks found")).toBeInTheDocument()
    expect(
      screen.getByText(/No tasks match your current search and filter criteria/i)
    ).toBeInTheDocument()
  })

  it("renders the search icon", () => {
    const { container } = render(<EmptyState />)
    
    // Check for the search icon container
    const iconContainer = container.querySelector(".rounded-full.bg-muted")
    expect(iconContainer).toBeInTheDocument()
  })
})

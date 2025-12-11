import { render, screen } from "@testing-library/react"
import { EmptyState } from "@/components/empty-state"

describe("EmptyState", () => {
  it("renders the empty state message", () => {
    render(<EmptyState />)

    expect(screen.getByTestId("empty-state")).toBeInTheDocument()
    expect(screen.getByText("No tasks found")).toBeInTheDocument()
    expect(
      screen.getByText(/No tasks match your current search and filter criteria/)
    ).toBeInTheDocument()
  })

  it("displays the search icon", () => {
    const { container } = render(<EmptyState />)
    const icon = container.querySelector("svg")
    expect(icon).toBeInTheDocument()
  })
})

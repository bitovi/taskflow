import { render, screen, waitFor } from "@testing-library/react"
import { EmptyState } from "@/components/ui/empty-state"
import { Search } from "lucide-react"

describe("EmptyState", () => {
  test("renders with default props", () => {
    render(<EmptyState />)
    
    // Icon should be rendered
    const icon = document.querySelector("svg")
    expect(icon).toBeInTheDocument()
  })

  test("renders with custom title", () => {
    render(<EmptyState title="No results found" />)
    
    expect(screen.getByText("No results found")).toBeInTheDocument()
  })

  test("renders with custom description", () => {
    render(
      <EmptyState
        title="No tasks found"
        description="Try adjusting your search terms"
      />
    )
    
    expect(screen.getByText("No tasks found")).toBeInTheDocument()
    expect(screen.getByText("Try adjusting your search terms")).toBeInTheDocument()
  })

  test("renders with custom icon", () => {
    const CustomIcon = () => <div data-testid="custom-icon">Custom</div>
    render(<EmptyState icon={CustomIcon} />)
    
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument()
  })

  test("applies custom className", () => {
    const { container } = render(<EmptyState className="custom-class" />)
    
    const emptyState = container.firstChild
    expect(emptyState).toHaveClass("custom-class")
  })
})

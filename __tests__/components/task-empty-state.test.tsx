import { render, screen } from '@testing-library/react'
import { TaskEmptyState } from '@/components/task-empty-state'

describe('TaskEmptyState', () => {
  it('renders the empty state message', () => {
    render(<TaskEmptyState />)
    
    expect(screen.getByText('No tasks found')).toBeInTheDocument()
    expect(screen.getByText(/No tasks match your current search and filter criteria/)).toBeInTheDocument()
  })

  it('renders the search icon', () => {
    render(<TaskEmptyState />)
    
    // Check for the presence of the search icon by looking for the SVG element
    const searchIcon = document.querySelector('svg')
    expect(searchIcon).toBeInTheDocument()
    expect(searchIcon).toHaveClass('lucide-search')
  })

  it('has the correct text content', () => {
    render(<TaskEmptyState />)
    
    expect(screen.getByText('No tasks found')).toHaveClass('text-lg', 'font-medium', 'mb-2')
    expect(screen.getByText(/Try adjusting your search terms or filter settings/)).toHaveClass('text-muted-foreground')
  })

  it('has the correct structure and styling', () => {
    render(<TaskEmptyState />)
    
    const container = screen.getByText('No tasks found').closest('div')
    expect(container).toHaveClass('text-center', 'py-12')
  })
})
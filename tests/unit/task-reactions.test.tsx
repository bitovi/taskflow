import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TaskReactions } from '@/components/task-reactions'
import { toggleReaction } from '@/app/(dashboard)/tasks/actions'

// Mock the server action
jest.mock('@/app/(dashboard)/tasks/actions', () => ({
  toggleReaction: jest.fn(),
}))

describe('TaskReactions', () => {
  const mockReactions = [
    { id: 1, taskId: 1, userId: 1, type: 'like' as const, createdAt: new Date() },
    { id: 2, taskId: 1, userId: 2, type: 'like' as const, createdAt: new Date() },
    { id: 3, taskId: 1, userId: 3, type: 'dislike' as const, createdAt: new Date() },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(toggleReaction as jest.Mock).mockResolvedValue({ error: null, success: true })
  })

  it('renders like and dislike buttons with counts', () => {
    render(
      <TaskReactions taskId={1} reactions={mockReactions} currentUserId={4} />
    )

    const likeButton = screen.getByRole('button', { name: /2/i })
    const dislikeButton = screen.getByRole('button', { name: /1/i })

    expect(likeButton).toBeInTheDocument()
    expect(dislikeButton).toBeInTheDocument()
  })

  it('highlights like button when current user has liked', () => {
    render(
      <TaskReactions taskId={1} reactions={mockReactions} currentUserId={1} />
    )

    const likeButton = screen.getByRole('button', { name: /2/i })
    expect(likeButton).toHaveClass('bg-primary')
  })

  it('highlights dislike button when current user has disliked', () => {
    render(
      <TaskReactions taskId={1} reactions={mockReactions} currentUserId={3} />
    )

    const dislikeButton = screen.getByRole('button', { name: /1/i })
    expect(dislikeButton).toHaveClass('bg-primary')
  })

  it('calls toggleReaction when like button is clicked', async () => {
    render(
      <TaskReactions taskId={1} reactions={mockReactions} currentUserId={4} />
    )

    const likeButton = screen.getByRole('button', { name: /2/i })
    fireEvent.click(likeButton)

    await waitFor(() => {
      expect(toggleReaction).toHaveBeenCalledWith(1, 'like')
    })
  })

  it('calls toggleReaction when dislike button is clicked', async () => {
    render(
      <TaskReactions taskId={1} reactions={mockReactions} currentUserId={4} />
    )

    const dislikeButton = screen.getByRole('button', { name: /1/i })
    fireEvent.click(dislikeButton)

    await waitFor(() => {
      expect(toggleReaction).toHaveBeenCalledWith(1, 'dislike')
    })
  })

  it('shows optimistic update when clicking like button', async () => {
    render(
      <TaskReactions taskId={1} reactions={mockReactions} currentUserId={4} />
    )

    const likeButton = screen.getByRole('button', { name: /2/i })
    fireEvent.click(likeButton)

    // Count should optimistically increment to 3
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /3/i })).toBeInTheDocument()
    })
  })

  it('handles toggling off a reaction', async () => {
    render(
      <TaskReactions taskId={1} reactions={mockReactions} currentUserId={1} />
    )

    const likeButton = screen.getByRole('button', { name: /2/i })
    fireEvent.click(likeButton)

    // Count should optimistically decrement to 1
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /1/i })).toBeInTheDocument()
    })
  })

  it('disables buttons while pending', async () => {
    render(
      <TaskReactions taskId={1} reactions={mockReactions} currentUserId={4} />
    )

    const likeButton = screen.getByRole('button', { name: /2/i })
    fireEvent.click(likeButton)

    expect(likeButton).toBeDisabled()
  })
})
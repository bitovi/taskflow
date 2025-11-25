import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock server actions
jest.mock('@/app/(dashboard)/tasks/actions', () => ({
    createTask: jest.fn(async (formData: FormData) => ({ success: true, message: 'ok', error: null }))
}))
jest.mock('@/app/login/actions', () => ({
    getAllUsers: jest.fn(async () => [{ id: 1, name: 'Alice' }])
}))

import { CreateTaskForm } from '@/components/create-task-form'
import { createTask } from '@/app/(dashboard)/tasks/actions'

describe('CreateTaskForm', () => {
    test('renders form fields and submits', async () => {
        render(<CreateTaskForm />)

        // Wait for users to load and appear in the DOM's select content
        await waitFor(() => expect(createTask).not.toHaveBeenCalled())

        const title = screen.getByLabelText(/title/i)
        await userEvent.type(title, 'New Task')

        const submit = screen.getByRole('button', { name: /create task/i })
        await userEvent.click(submit)

        await waitFor(() => expect(createTask).toHaveBeenCalled())
    })
})

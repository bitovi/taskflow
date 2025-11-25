import React from 'react'
import { render, screen } from '@testing-library/react'
import { Input } from '@/components/ui/input'

describe('Input component', () => {
    test('renders with provided props', () => {
        render(<Input placeholder="Enter name" />)
        expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument()
    })
})

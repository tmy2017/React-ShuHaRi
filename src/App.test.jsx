import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App Component - Tailwind CSS Integration', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders the success message', () => {
    render(<App />)
    expect(screen.getByText('Tailwind CSS is working correctly!')).toBeInTheDocument()
  })

  it('renders both buttons', () => {
    render(<App />)
    expect(screen.getByText('Primary Button')).toBeInTheDocument()
    expect(screen.getByText('Success Button')).toBeInTheDocument()
  })

  it('applies correct CSS classes to elements', () => {
    render(<App />)

    // Check section has correct classes
    const section = document.querySelector('section')
    expect(section).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'h-screen', 'bg-gray-100')

    // Check heading has correct classes
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('text-4xl', 'font-bold', 'text-blue-600', 'mb-4')

    // Check paragraph has correct classes
    const paragraph = screen.getByText('Tailwind CSS is working correctly!')
    expect(paragraph).toHaveClass('text-lg', 'text-gray-700', 'mb-6')

    // Check buttons have correct classes
    const primaryButton = screen.getByText('Primary Button')
    expect(primaryButton).toHaveClass('px-4', 'py-2', 'bg-blue-500', 'text-white', 'rounded', 'hover:bg-blue-600', 'transition-colors')

    const successButton = screen.getByText('Success Button')
    expect(successButton).toHaveClass('px-4', 'py-2', 'bg-green-500', 'text-white', 'rounded', 'hover:bg-green-600', 'transition-colors')
  })
})
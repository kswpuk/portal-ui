import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import Error from './Error'

describe('Error', () => {
  it('renders the "Oh no!" title and children', () => {
    render(<Error>Something went wrong</Error>)
    expect(screen.getByText('Oh no!')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders a FetchBaseQueryError with a message field', () => {
    const error: FetchBaseQueryError = {
      status: 400,
      data: { message: 'Bad request' },
    }
    render(<Error error={error} />)
    expect(screen.getByText('Bad request')).toBeInTheDocument()
    expect(screen.getByText(/Status Code: 400/)).toBeInTheDocument()
  })

  it('renders detail as a list when detail is an array', () => {
    const error: FetchBaseQueryError = {
      status: 422,
      data: { message: 'Validation failed', detail: ['Name is required', 'Email is invalid'] },
    }
    render(<Error error={error} />)
    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is invalid')).toBeInTheDocument()
  })

  it('renders detail as a paragraph when detail is a string', () => {
    const error: FetchBaseQueryError = {
      status: 400,
      data: { message: 'Error', detail: 'More detail here' },
    }
    render(<Error error={error} />)
    expect(screen.getByText('More detail here')).toBeInTheDocument()
  })

  it('falls back to JSON when no message field is present', () => {
    const error: FetchBaseQueryError = {
      status: 500,
      data: {},
    }
    render(<Error error={error} />)
    // No message field → falls back to rendering the full error as JSON in a <code> block
    expect(screen.getByText(/\{"status":500/)).toBeInTheDocument()
  })

  it('renders a SerializedError as JSON', () => {
    const error: SerializedError = { message: 'Network error', code: 'ERR_NETWORK' }
    render(<Error error={error} />)
    expect(screen.getByText(/Network error/)).toBeInTheDocument()
  })

  it('shows a retry button when onRetry is provided', () => {
    render(<Error onRetry={vi.fn()}>Error</Error>)
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
  })

  it('calls onRetry when the retry button is clicked', async () => {
    const onRetry = vi.fn()
    const user = userEvent.setup()
    render(<Error onRetry={onRetry}>Error</Error>)
    await user.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('does not show a retry button when onRetry is not provided', () => {
    render(<Error>Error</Error>)
    expect(screen.queryByRole('button', { name: 'Try Again' })).not.toBeInTheDocument()
  })
})

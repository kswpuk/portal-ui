import { render, screen } from '@testing-library/react'
import Loading from './Loading'

describe('Loading', () => {
  it('shows default loading text', () => {
    render(<Loading />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows custom text when provided', () => {
    render(<Loading text="Fetching members..." />)
    expect(screen.getByText('Fetching members...')).toBeInTheDocument()
  })
})

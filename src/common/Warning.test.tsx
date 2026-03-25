import { render, screen } from '@testing-library/react'
import Warning from './Warning'

describe('Warning', () => {
  it('shows the "Watch out!" title', () => {
    render(<Warning>Please review your inputs</Warning>)
    expect(screen.getByText('Watch out!')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Warning>Please review your inputs</Warning>)
    expect(screen.getByText('Please review your inputs')).toBeInTheDocument()
  })
})

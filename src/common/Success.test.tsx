import { render, screen } from '@testing-library/react'
import Success from './Success'

describe('Success', () => {
  it('renders the "Hooray!" title', () => {
    render(<Success>Your changes have been saved.</Success>)
    expect(screen.getByText('Hooray!')).toBeInTheDocument()
  })

  it('renders the children message', () => {
    render(<Success>Member created successfully.</Success>)
    expect(screen.getByText('Member created successfully.')).toBeInTheDocument()
  })
})

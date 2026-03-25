import { render, screen } from '@testing-library/react'
import PostcodeLink from './PostcodeLink'

describe('PostcodeLink', () => {
  it('renders a Google Maps link for the postcode', () => {
    render(<PostcodeLink>SW1A1AA</PostcodeLink>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', expect.stringContaining('SW1A 1AA'))
    expect(link).toHaveTextContent('SW1A 1AA')
  })

  it('uppercases the postcode', () => {
    render(<PostcodeLink>sw1a1aa</PostcodeLink>)
    expect(screen.getByRole('link')).toHaveTextContent('SW1A 1AA')
  })

  it('strips existing spaces and re-inserts one before the last 3 characters', () => {
    render(<PostcodeLink>SW1A 1AA</PostcodeLink>)
    expect(screen.getByRole('link')).toHaveTextContent('SW1A 1AA')
  })

  it('returns null when children is not provided', () => {
    const { container } = render(<PostcodeLink />)
    expect(container).toBeEmptyDOMElement()
  })

  it('opens in a new tab with rel=noreferrer', () => {
    render(<PostcodeLink>SW1A1AA</PostcodeLink>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })
})

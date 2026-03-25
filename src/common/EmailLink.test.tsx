import { render, screen } from '@testing-library/react'
import EmailLink from './EmailLink'

describe('EmailLink', () => {
  it('renders a mailto link with the email address', () => {
    render(<EmailLink>test@example.com</EmailLink>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'mailto:test@example.com')
    expect(link).toHaveTextContent('test@example.com')
  })

  it('lowercases the email address', () => {
    render(<EmailLink>UPPER@CASE.COM</EmailLink>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'mailto:upper@case.com')
    expect(link).toHaveTextContent('upper@case.com')
  })

  it('returns null when children is an empty string', () => {
    const { container } = render(<EmailLink>{''}</EmailLink>)
    expect(container).toBeEmptyDOMElement()
  })
})

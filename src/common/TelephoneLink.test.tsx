import { render, screen } from '@testing-library/react'
import TelephoneLink from './TelephoneLink'

describe('TelephoneLink', () => {
  it('renders a tel link', () => {
    render(<TelephoneLink>+447911123456</TelephoneLink>)
    expect(screen.getByRole('link')).toHaveAttribute('href', 'tel:+447911123456')
  })

  it('converts UK numbers starting with 0 to +44 format', () => {
    render(<TelephoneLink>07911123456</TelephoneLink>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'tel:+447911123456')
    expect(link).toHaveTextContent('+447911123456')
  })

  it('strips spaces and non-numeric characters', () => {
    render(<TelephoneLink>07911 123 456</TelephoneLink>)
    expect(screen.getByRole('link')).toHaveAttribute('href', 'tel:+447911123456')
  })

  it('strips hyphens and brackets', () => {
    render(<TelephoneLink>0(7911) 123-456</TelephoneLink>)
    expect(screen.getByRole('link')).toHaveAttribute('href', 'tel:+447911123456')
  })

  it('preserves + prefix on international numbers', () => {
    render(<TelephoneLink>+33 1 23 45 67 89</TelephoneLink>)
    expect(screen.getByRole('link')).toHaveAttribute('href', 'tel:+33123456789')
  })
})

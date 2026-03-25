import { render, screen } from '@testing-library/react'
import DateOfBirth from './DateOfBirth'

vi.mock('@mui/material', () => ({
  useTheme: () => ({ palette: { text: { secondary: '#757575' } } }),
}))

// Fix "today" to 2026-03-25 so age calculations are deterministic.
// DOB of 1990-01-01 → 36 years old on this date.
const FIXED_NOW = new Date('2026-03-25T00:00:00Z').getTime()
const DOB = '1990-01-01'

beforeEach(() => {
  vi.spyOn(Date, 'now').mockReturnValue(FIXED_NOW)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('DateOfBirth', () => {
  describe('with a valid date string', () => {
    it('renders a <time> element with the original string as dateTime', () => {
      render(<DateOfBirth>{DOB}</DateOfBirth>)
      expect(screen.getByRole('time')).toHaveAttribute('dateTime', DOB)
    })

    it('displays the original date string as visible text', () => {
      render(<DateOfBirth>{DOB}</DateOfBirth>)
      expect(screen.getByRole('time')).toHaveTextContent(DOB)
    })

    it('shows age in years by default', () => {
      render(<DateOfBirth>{DOB}</DateOfBirth>)
      expect(screen.getByText('(36 years old)')).toBeInTheDocument()
    })

    it('shows age when displayAge is explicitly true', () => {
      render(<DateOfBirth displayAge={true}>{DOB}</DateOfBirth>)
      expect(screen.getByText('(36 years old)')).toBeInTheDocument()
    })

    it('hides age when displayAge is false', () => {
      render(<DateOfBirth displayAge={false}>{DOB}</DateOfBirth>)
      expect(screen.queryByText(/years old/)).not.toBeInTheDocument()
    })
  })

  describe('with an invalid date string', () => {
    it('renders the raw string without a <time> element', () => {
      render(<DateOfBirth>not-a-date</DateOfBirth>)
      expect(screen.queryByRole('time')).not.toBeInTheDocument()
      expect(screen.getByText('not-a-date')).toBeInTheDocument()
    })

    it('does not show an age', () => {
      render(<DateOfBirth>not-a-date</DateOfBirth>)
      expect(screen.queryByText(/years old/)).not.toBeInTheDocument()
    })
  })
})

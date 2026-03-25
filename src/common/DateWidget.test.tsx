import { render, screen } from '@testing-library/react'
import DateWidget from './DateWidget'

// Fixed date used across all tests: 15 June 2024 at 14:30:00
const DATE = '2024-06-15T14:30:00'

describe('DateWidget', () => {
  describe('datetime mode (default)', () => {
    it('renders a <time> element', () => {
      render(<DateWidget date={DATE} />)
      expect(screen.getByRole('time')).toBeInTheDocument()
    })

    it('sets the dateTime attribute to YYYY-MM-DD HH:mm:ss', () => {
      render(<DateWidget date={DATE} />)
      expect(screen.getByRole('time')).toHaveAttribute('dateTime', '2024-06-15 14:30:00')
    })

    it('displays time and date in "HH:mm, D MMMM YYYY" format', () => {
      render(<DateWidget date={DATE} />)
      expect(screen.getByRole('time')).toHaveTextContent('14:30, 15 June 2024')
    })
  })

  describe('dateOnly mode', () => {
    it('sets the dateTime attribute to YYYY-MM-DD', () => {
      render(<DateWidget date={DATE} dateOnly />)
      expect(screen.getByRole('time')).toHaveAttribute('dateTime', '2024-06-15')
    })

    it('displays date in "D MMMM YYYY" format', () => {
      render(<DateWidget date={DATE} dateOnly />)
      expect(screen.getByRole('time')).toHaveTextContent('15 June 2024')
    })

    it('does not include time in the visible text', () => {
      render(<DateWidget date={DATE} dateOnly />)
      expect(screen.getByRole('time').textContent).not.toMatch(/\d{2}:\d{2}/)
    })
  })

  describe('custom format', () => {
    it('uses the provided format string for the visible text', () => {
      render(<DateWidget date={DATE} format="DD/MM/YYYY" />)
      expect(screen.getByRole('time')).toHaveTextContent('15/06/2024')
    })

    it('custom format applies even when dateOnly is set', () => {
      render(<DateWidget date={DATE} dateOnly format="MMMM YYYY" />)
      expect(screen.getByRole('time')).toHaveTextContent('June 2024')
    })
  })
})

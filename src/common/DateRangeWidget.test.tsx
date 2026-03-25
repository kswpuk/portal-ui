import { render, screen } from '@testing-library/react'
import DateRangeWidget from './DateRangeWidget'

describe('DateRangeWidget', () => {
  it('shows a single date when start and end are the same day', () => {
    render(<DateRangeWidget startDate="2025-06-15" endDate="2025-06-15" />)
    expect(screen.getByText('15 June 2025')).toBeInTheDocument()
  })

  it('collapses to "D - D MMMM YYYY" when dates are in the same month', () => {
    render(<DateRangeWidget startDate="2025-06-10" endDate="2025-06-20" />)
    expect(screen.getByText('10 - 20 June 2025')).toBeInTheDocument()
  })

  it('shows "D MMMM - D MMMM YYYY" when months differ but the year is the same', () => {
    render(<DateRangeWidget startDate="2025-05-30" endDate="2025-06-02" />)
    expect(screen.getByText('30 May - 2 June 2025')).toBeInTheDocument()
  })

  it('shows full dates for both when the years differ', () => {
    render(<DateRangeWidget startDate="2025-12-31" endDate="2026-01-02" />)
    expect(screen.getByText('31 December 2025 - 2 January 2026')).toBeInTheDocument()
  })
})

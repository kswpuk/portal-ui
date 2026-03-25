import { render, screen } from '@testing-library/react'
import DeadlineWidget from './DeadlineWidget'

// Pin "today" to 2026-03-25 so comparisons are deterministic.
// vi.useFakeTimers affects new Date() which moment() relies on.
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-03-25T00:00:00Z'))
})

afterEach(() => vi.useRealTimers())

describe('DeadlineWidget', () => {
  it('shows "Register before <date>" when the deadline is in the future', () => {
    render(<DeadlineWidget deadline="2026-06-01" />)
    expect(screen.getByText('Register before 1 June 2026')).toBeInTheDocument()
  })

  it('shows "Register before <date>" when the deadline is today', () => {
    render(<DeadlineWidget deadline="2026-03-25" />)
    expect(screen.getByText('Register before 25 March 2026')).toBeInTheDocument()
  })

  it('shows "Registration closed" when the deadline was yesterday', () => {
    render(<DeadlineWidget deadline="2026-03-24" />)
    expect(screen.getByText('Registration closed')).toBeInTheDocument()
  })

  it('shows "Registration closed" when the deadline is well in the past', () => {
    render(<DeadlineWidget deadline="2026-01-01" />)
    expect(screen.getByText('Registration closed')).toBeInTheDocument()
  })
})

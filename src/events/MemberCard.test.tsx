import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MemberCard from './MemberCard'

vi.mock('../common/MemberPhoto', () => ({
  default: () => <div data-testid="member-photo" />
}))

vi.mock('../common/Privileged', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

describe('MemberCard', () => {
  it('renders nothing when membershipNumber is empty', () => {
    const { container } = render(
      <MemoryRouter>
        <MemberCard membershipNumber="" />
      </MemoryRouter>
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders newbie chip when experience is 0', () => {
    render(
      <MemoryRouter>
        <MemberCard membershipNumber="123" name="Alice" experience={0} />
      </MemoryRouter>
    )
    expect(screen.getByText('First Timer')).toBeInTheDocument()
  })

  it('renders pro chip when experience is 3 or more', () => {
    render(
      <MemoryRouter>
        <MemberCard membershipNumber="123" name="Bob" experience={3} />
      </MemoryRouter>
    )
    expect(screen.getByText('Pro (3 events)')).toBeInTheDocument()
  })

  it('renders pro chip with correct count for experience > 3', () => {
    render(
      <MemoryRouter>
        <MemberCard membershipNumber="123" name="Charlie" experience={5} />
      </MemoryRouter>
    )
    expect(screen.getByText('Pro (5 events)')).toBeInTheDocument()
  })

  it('renders singular attended count when experience is 1', () => {
    render(
      <MemoryRouter>
        <MemberCard membershipNumber="123" name="Dana" experience={1} />
      </MemoryRouter>
    )
    expect(screen.getByText(/Has attended this event 1 time/i)).toBeInTheDocument()
  })

  it('renders plural attended count when experience is 2', () => {
    render(
      <MemoryRouter>
        <MemberCard membershipNumber="123" name="Eve" experience={2} />
      </MemoryRouter>
    )
    expect(screen.getByText(/Has attended this event 2 times/i)).toBeInTheDocument()
  })

  it('does not render experience info when experience is undefined', () => {
    render(
      <MemoryRouter>
        <MemberCard membershipNumber="123" name="Frank" />
      </MemoryRouter>
    )
    expect(screen.queryByText(/First Timer/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Pro/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Has attended this event/i)).not.toBeInTheDocument()
  })

  it('renders experience info when allocation is ALLOCATED', () => {
    render(
      <MemoryRouter>
        <MemberCard membershipNumber="123" name="Grace" experience={0} allocation="ALLOCATED" />
      </MemoryRouter>
    )
    expect(screen.getByText('First Timer')).toBeInTheDocument()
  })

  it('renders experience info when allocation is ATTENDED', () => {
    render(
      <MemoryRouter>
        <MemberCard membershipNumber="123" name="Heidi" experience={3} allocation="ATTENDED" />
      </MemoryRouter>
    )
    expect(screen.getByText('Pro (3 events)')).toBeInTheDocument()
  })

  it('does not render experience info when allocation is REGISTERED', () => {
    render(
      <MemoryRouter>
        <MemberCard membershipNumber="123" name="Ivan" experience={0} allocation="REGISTERED" />
      </MemoryRouter>
    )
    expect(screen.queryByText(/First Timer/i)).not.toBeInTheDocument()
  })

  it('does not render experience info when allocation is RESERVE or NOT_ALLOCATED', () => {
    const { rerender } = render(
      <MemoryRouter>
        <MemberCard membershipNumber="123" name="Judy" experience={3} allocation="RESERVE" />
      </MemoryRouter>
    )
    expect(screen.queryByText(/Pro/i)).not.toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <MemberCard membershipNumber="123" name="Judy" experience={1} allocation="NOT_ALLOCATED" />
      </MemoryRouter>
    )
    expect(screen.queryByText(/Has attended this event/i)).not.toBeInTheDocument()
  })
})

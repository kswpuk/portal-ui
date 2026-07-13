import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAllocateToEventMutation } from '../redux/eventsApi'
import { useListMembersQuery } from '../redux/membersApi'
import AddAllocationDialog from './AddAllocationDialog'

vi.mock('../redux/eventsApi', () => ({
  useAllocateToEventMutation: vi.fn(),
}))

vi.mock('../redux/membersApi', () => ({
  useListMembersQuery: vi.fn(),
}))

describe('AddAllocationDialog', () => {
  const mockAllocateToEvent = vi.fn()
  const mockClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAllocateToEventMutation).mockReturnValue([
      mockAllocateToEvent,
      { isLoading: false, isSuccess: false, error: null, reset: vi.fn() },
    ] as any)
    vi.mocked(useListMembersQuery).mockReturnValue({ data: [], isLoading: false } as any)
  })

  it('renders the dialog when show is true', () => {
    render(
      <AddAllocationDialog
        eventId="evt-1"
        eventSeriesId="series-1"
        onClose={mockClose}
        show={true}
        social={false}
      />
    )
    expect(screen.getByRole('heading', { name: 'Add Allocation' })).toBeInTheDocument()
  })

  it('does not render when show is false', () => {
    render(
      <AddAllocationDialog
        eventId="evt-1"
        eventSeriesId="series-1"
        onClose={mockClose}
        show={false}
        social={false}
      />
    )
    expect(screen.queryByRole('heading', { name: 'Add Allocation' })).not.toBeInTheDocument()
  })

  it('submits form with correct values', async () => {
    const user = userEvent.setup()
    render(
      <AddAllocationDialog
        eventId="evt-1"
        eventSeriesId="series-1"
        onClose={mockClose}
        show={true}
        social={false}
      />
    )

    // Type membership number
    const memberInput = screen.getByRole('combobox', { name: /Scout Membership Number/i })
    await user.type(memberInput, '12345')

    // Find the Select/dropdown component for allocation
    const allocationSelect = screen.getByRole('combobox', { name: /Allocation/i })
    await user.click(allocationSelect)

    // Select "Allocated" option
    const option = await screen.findByRole('option', { name: 'Allocated' })
    await user.click(option)

    // Click submit button
    const submitButton = screen.getByRole('button', { name: 'Add Allocation' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockAllocateToEvent).toHaveBeenCalledWith({
        eventSeriesId: 'series-1',
        eventId: 'evt-1',
        allocations: [
          {
            allocation: 'ALLOCATED',
            membershipNumbers: ['12345'],
          },
        ],
        social: false,
      })
    })
  })
})

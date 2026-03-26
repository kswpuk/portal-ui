import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fetchAuthSession } from 'aws-amplify/auth'
import { MemoryRouter } from 'react-router-dom'
import { useAllocateToEventMutation, useSuggestAllocationsQuery } from '../redux/eventsApi'
import ViewAllocationsDialog from './ViewAllocationsDialog'

vi.mock('aws-amplify/auth', () => ({ fetchAuthSession: vi.fn() }))
vi.mock('../redux/eventsApi', () => ({
  useAllocateToEventMutation: vi.fn(),
  useSuggestAllocationsQuery: vi.fn(),
}))
vi.mock('../common/ExportCsvButton', () => ({ default: () => null }))
vi.mock('./AddAllocationDialog', () => ({ default: () => null }))

globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function makeSession(groups: string[]) {
  return {
    tokens: {
      accessToken: {
        payload: { username: 'user1', 'cognito:groups': groups },
      },
    },
  }
}

const testEvent = {
  eventId: 'evt-1',
  eventSeriesId: 'series-1',
  name: 'Test Event',
  type: 'event',
  allocations: [
    { membershipNumber: 'M001', firstName: 'Alice', preferredName: '', surname: 'Smith', allocation: 'ALLOCATED', email: 'alice@example.com' },
    { membershipNumber: 'M002', firstName: 'Bob', preferredName: '', surname: 'Jones', allocation: 'ALLOCATED', email: 'bob@example.com' },
  ],
} as any

function renderDialog() {
  return render(
    <MemoryRouter>
      <ViewAllocationsDialog event={testEvent} open onClose={vi.fn()} />
    </MemoryRouter>
  )
}

describe('ViewAllocationsDialog — E-mail button', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetchAuthSession).mockResolvedValue(makeSession(['MANAGER']) as any)
    vi.mocked(useAllocateToEventMutation).mockReturnValue([vi.fn(), { isLoading: false }] as any)
    vi.mocked(useSuggestAllocationsQuery).mockReturnValue({ data: undefined, isLoading: false } as any)
  })

  it('is disabled when no rows are selected', async () => {
    renderDialog()
    const emailButton = await screen.findByTitle('E-mail Selected')
    expect(emailButton).toHaveAttribute('aria-disabled', 'true')
  })

  it('is enabled after selecting a row', async () => {
    const user = userEvent.setup()
    renderDialog()

    // First checkbox is the select-all header; individual row checkboxes follow
    const checkboxes = await screen.findAllByRole('checkbox')
    await user.click(checkboxes[1])

    await waitFor(() => {
      expect(screen.getByTitle('E-mail Selected')).not.toHaveAttribute('aria-disabled', 'true')
    })
  })

  it('is enabled when all rows are selected via select-all', async () => {
    const user = userEvent.setup()
    renderDialog()

    const selectAll = await screen.findByRole('checkbox', { name: /select all rows/i })
    await user.click(selectAll)

    await waitFor(() => {
      expect(screen.getByTitle('E-mail Selected')).not.toHaveAttribute('aria-disabled', 'true')
    })
  })

  it('includes all emails in the mailto href when all rows are selected via select-all', async () => {
    const user = userEvent.setup()
    renderDialog()

    const selectAll = await screen.findByRole('checkbox', { name: /select all rows/i })
    await user.click(selectAll)

    await waitFor(() => {
      const href = screen.getByTitle('E-mail Selected').getAttribute('href') ?? ''
      expect(href).toContain('alice@example.com')
      expect(href).toContain('bob@example.com')
    })
  })
})

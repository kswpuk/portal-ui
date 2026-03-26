import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fetchAuthSession } from 'aws-amplify/auth'
import { MemoryRouter } from 'react-router-dom'
import { useListMembersQuery } from '../redux/membersApi'
import { useAppDispatch } from '../redux/hooks'
import ListMembers from './ListMembers'

vi.mock('aws-amplify/auth', () => ({ fetchAuthSession: vi.fn() }))
vi.mock('../redux/membersApi', () => ({ useListMembersQuery: vi.fn() }))
vi.mock('../redux/hooks', () => ({ useAppDispatch: vi.fn() }))
vi.mock('../common/ExportCsvButton', () => ({ default: () => null }))
vi.mock('../common/MemberPhoto', () => ({ default: () => null }))

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

const testMembers: any[] = [
  { membershipNumber: 'M001', firstName: 'Alice', preferredName: '', surname: 'Smith', status: 'ACTIVE', role: '', email: 'alice@example.com' },
  { membershipNumber: 'M002', firstName: 'Bob', preferredName: '', surname: 'Jones', status: 'ACTIVE', role: '', email: 'bob@example.com' },
]

function renderPage() {
  return render(
    <MemoryRouter>
      <ListMembers />
    </MemoryRouter>
  )
}

function getEmailLink() {
  // MUI Button with href renders as <a>; with disabled it renders as <button>
  return screen.queryByRole('link', { name: /e-mail selected/i })
    ?? screen.getByRole('button', { name: /e-mail selected/i })
}

describe('ListMembers — E-mail button', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetchAuthSession).mockResolvedValue(makeSession(['MANAGER']) as any)
    vi.mocked(useListMembersQuery).mockReturnValue({ data: testMembers, error: undefined, isLoading: false, refetch: vi.fn() } as any)
    vi.mocked(useAppDispatch).mockReturnValue(vi.fn() as any)
  })

  it('has an empty bcc when no rows are selected', async () => {
    renderPage()
    await waitFor(() => {
      const el = getEmailLink()
      const href = el.getAttribute('href') ?? ''
      expect(href).toMatch(/bcc=$/)
    })
  })

  it('includes the row email in the href after selecting a row', async () => {
    const user = userEvent.setup()
    renderPage()

    // First checkbox is the select-all header; individual row checkboxes follow
    const checkboxes = await screen.findAllByRole('checkbox')
    await user.click(checkboxes[1])

    await waitFor(() => {
      const href = getEmailLink().getAttribute('href') ?? ''
      expect(href).toMatch(/alice@example\.com|bob@example\.com/)
    })
  })

  it('includes all emails in the href when all rows are selected via select-all', async () => {
    const user = userEvent.setup()
    renderPage()

    const selectAll = await screen.findByRole('checkbox', { name: /select all rows/i })
    await user.click(selectAll)

    await waitFor(() => {
      const href = getEmailLink().getAttribute('href') ?? ''
      expect(href).toContain('alice@example.com')
      expect(href).toContain('bob@example.com')
    })
  })
})

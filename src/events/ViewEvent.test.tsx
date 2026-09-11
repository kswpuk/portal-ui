import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { fetchAuthSession } from 'aws-amplify/auth'
import { useGetEventQuery, useRegisterForEventMutation, useDeleteEventMutation } from '../redux/eventsApi'
import { useGetMemberQuery } from '../redux/membersApi'
import ViewEvent from './ViewEvent'

vi.mock('aws-amplify/auth', () => ({
  fetchAuthSession: vi.fn(),
}))

vi.mock('../redux/eventsApi', () => ({
  useGetEventQuery: vi.fn(),
  useRegisterForEventMutation: vi.fn(),
  useDeleteEventMutation: vi.fn(),
}))

vi.mock('../redux/membersApi', () => ({
  useGetMemberQuery: vi.fn(),
}))

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ eventSeriesId: 'series1', eventId: 'event1' }),
    useNavigate: () => vi.fn(),
  }
})

vi.mock('../common/MemberPhoto', () => ({
  default: () => <div data-testid="member-photo" />,
}))

vi.mock('./ViewAllocationsDialog', () => ({
  default: () => null,
}))

vi.mock('./DownloadCalendarButton', () => ({
  default: () => null,
}))

function makeSession(groups: string[] = ['MEMBER']) {
  return {
    tokens: {
      accessToken: {
        payload: { username: 'user123', 'cognito:groups': groups },
      },
    },
  }
}

const mockEvent = {
  eventId: 'event1',
  eventSeriesId: 'series1',
  name: 'Summer Camp',
  type: 'camp',
  description: 'Annual camp',
  registrationDate: '2026-10-01',
  startDate: '2026-10-10',
  endDate: '2026-10-12',
  cost: 0,
  attendanceLimit: 20,
  attendanceCriteria: [],
  eligibility: { eligible: true, rules: [] },
  allocations: [
    { membershipNumber: 'M001', firstName: 'Alice', surname: 'Green', allocation: 'ALLOCATED', experience: 0 },
    { membershipNumber: 'M002', firstName: 'Bob', surname: 'Gold', allocation: 'ALLOCATED', experience: 3 },
    { membershipNumber: 'M003', firstName: 'Charlie', surname: 'Mid', allocation: 'ALLOCATED', experience: 1 },
    { membershipNumber: 'M004', firstName: 'Dave', surname: 'Reg', allocation: 'REGISTERED', experience: 0 },
    { membershipNumber: 'M005', firstName: 'Eve', surname: 'Res', allocation: 'RESERVE', experience: 4 },
  ],
} as any

describe('ViewEvent - Attendee Badges', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetchAuthSession).mockResolvedValue(makeSession() as any)
    vi.mocked(useGetEventQuery).mockReturnValue({
      data: mockEvent,
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    } as any)
    vi.mocked(useRegisterForEventMutation).mockReturnValue([vi.fn(), { isLoading: false }] as any)
    vi.mocked(useDeleteEventMutation).mockReturnValue([vi.fn(), { isLoading: false, isSuccess: false }] as any)
    vi.mocked(useGetMemberQuery).mockReturnValue({ data: undefined } as any)
  })

  it('renders badges only for allocated members (newbie for experience = 0 and pro for experience >= 3)', async () => {
    render(
      <MemoryRouter>
        <ViewEvent />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('newbie-badge')).toBeInTheDocument()
      expect(screen.getByTestId('pro-badge')).toBeInTheDocument()
    })

    // Exactly 1 newbie badge (Alice) and 1 pro badge (Bob) despite Dave (REGISTERED, 0 exp) and Eve (RESERVE, 4 exp)
    expect(screen.getAllByTestId('newbie-badge')).toHaveLength(1)
    expect(screen.getAllByTestId('pro-badge')).toHaveLength(1)

    // Accessible labels only exist for allocated attendees
    expect(screen.getByLabelText('First Timer (0 previous events)')).toBeInTheDocument()
    expect(screen.getByLabelText('Pro (3 previous events)')).toBeInTheDocument()
    expect(screen.queryByLabelText('First Timer (0 previous events) - Dave')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Pro (4 previous events)')).not.toBeInTheDocument()
  })
})

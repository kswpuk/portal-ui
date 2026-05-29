import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UseFormRegisterReturn } from 'react-hook-form'
import { useListMembersQuery } from '../redux/membersApi'
import MembershipNumberField from './MembershipNumberField'

vi.mock('../redux/membersApi', () => ({
  useListMembersQuery: vi.fn()
}))

const mockQuery = vi.mocked(useListMembersQuery)

const register: UseFormRegisterReturn = {
  name: 'membershipNumber',
  ref: vi.fn(),
  onChange: vi.fn(),
  onBlur: vi.fn(),
}

const members: MemberListItem[] = [
  { membershipNumber: '10001', firstName: 'Alice', surname: 'Smith', preferredName: '', status: 'ACTIVE', role: '' },
  { membershipNumber: '10002', firstName: 'Bob', surname: 'Jones', preferredName: '', status: 'ACTIVE', role: '' },
]

describe('MembershipNumberField', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the "Scout Membership Number" label', () => {
    mockQuery.mockReturnValue({ data: [], isLoading: false } as any)
    render(<MembershipNumberField register={register} />)
    expect(screen.getByLabelText(/Scout Membership Number/i)).toBeInTheDocument()
  })

  it('shows a loading indicator while members are being fetched', async () => {
    mockQuery.mockReturnValue({ data: undefined, isLoading: true } as any)
    const user = userEvent.setup()
    render(<MembershipNumberField register={register} />)
    // MUI Autocomplete shows "Loading…" text inside the dropdown — open it first
    await user.click(screen.getByRole('combobox'))
    expect(await screen.findByText(/Loading/)).toBeInTheDocument()
  })

  it('shows "This field is required" when a field error is provided', () => {
    mockQuery.mockReturnValue({ data: members, isLoading: false } as any)
    render(<MembershipNumberField register={register} error={{ type: 'required', message: 'required' }} />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('does not show an error message when no error is provided', () => {
    mockQuery.mockReturnValue({ data: members, isLoading: false } as any)
    render(<MembershipNumberField register={register} />)
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument()
  })
})

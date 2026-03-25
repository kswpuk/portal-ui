import { render, screen, waitFor } from '@testing-library/react'
import { fetchAuthSession } from 'aws-amplify/auth'
import Privileged from './Privileged'

vi.mock('aws-amplify/auth', () => ({
  fetchAuthSession: vi.fn()
}))

const mockFetchAuthSession = vi.mocked(fetchAuthSession)

function makeSession(username: string, groups: string[]) {
  return {
    tokens: {
      accessToken: {
        payload: {
          username,
          'cognito:groups': groups,
        }
      }
    }
  }
}

describe('Privileged', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders children for a user in the MANAGER group', async () => {
    mockFetchAuthSession.mockResolvedValue(makeSession('user1', ['MANAGER']) as any)
    render(<Privileged allowed={[]}>Secret content</Privileged>)
    expect(await screen.findByText('Secret content')).toBeInTheDocument()
  })

  it('renders children for a user in the PORTAL group', async () => {
    mockFetchAuthSession.mockResolvedValue(makeSession('user1', ['PORTAL']) as any)
    render(<Privileged allowed={[]}>Secret content</Privileged>)
    expect(await screen.findByText('Secret content')).toBeInTheDocument()
  })

  it('renders children when the username is in the allowed list', async () => {
    mockFetchAuthSession.mockResolvedValue(makeSession('alice', ['MEMBERS']) as any)
    render(<Privileged allowed={['alice']}>Secret content</Privileged>)
    expect(await screen.findByText('Secret content')).toBeInTheDocument()
  })

  it('renders children when the user belongs to an allowed group', async () => {
    mockFetchAuthSession.mockResolvedValue(makeSession('bob', ['LEADERS']) as any)
    render(<Privileged allowed={['LEADERS']}>Secret content</Privileged>)
    expect(await screen.findByText('Secret content')).toBeInTheDocument()
  })

  it('hides children and shows denyMessage for an unauthorised user', async () => {
    mockFetchAuthSession.mockResolvedValue(makeSession('stranger', ['MEMBERS']) as any)
    render(<Privileged allowed={[]} denyMessage="Access denied">Secret content</Privileged>)
    await waitFor(() => expect(mockFetchAuthSession).toHaveBeenCalled())
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument()
    expect(screen.getByText('Access denied')).toBeInTheDocument()
  })

  it('renders nothing for an unauthorised user when denyMessage is not provided', async () => {
    mockFetchAuthSession.mockResolvedValue(makeSession('stranger', ['MEMBERS']) as any)
    render(<Privileged allowed={[]}>Secret content</Privileged>)
    await waitFor(() => expect(mockFetchAuthSession).toHaveBeenCalled())
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument()
  })
})

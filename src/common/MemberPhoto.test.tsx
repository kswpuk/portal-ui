import { render, screen } from '@testing-library/react'
import { useGetMemberPhotoQuery } from '../redux/membersApi'
import MemberPhoto from './MemberPhoto'

vi.mock('../redux/membersApi', () => ({
  useGetMemberPhotoQuery: vi.fn()
}))

// Vite imports PNG files as URLs; return a predictable string in tests.
vi.mock('./unknown.png', () => ({ default: 'placeholder.png' }))

const mockQuery = vi.mocked(useGetMemberPhotoQuery)

describe('MemberPhoto', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows a spinner while the photo is loading', () => {
    mockQuery.mockReturnValue({ isLoading: true, error: undefined, data: undefined } as any)
    render(<MemberPhoto membershipNumber="12345" />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows the placeholder image when the request fails', () => {
    mockQuery.mockReturnValue({ isLoading: false, error: { status: 404 }, data: undefined } as any)
    render(<MemberPhoto membershipNumber="12345" />)
    // alt="" makes the placeholder decorative (role="presentation"), so query by DOM element
    expect(document.querySelector('img')).toHaveAttribute('src', 'placeholder.png')
  })

  it('shows "No photo" as the placeholder title by default', () => {
    mockQuery.mockReturnValue({ isLoading: false, error: { status: 404 }, data: undefined } as any)
    render(<MemberPhoto membershipNumber="12345" />)
    expect(document.querySelector('img')).toHaveAttribute('title', 'No photo')
  })

  it('shows a custom title on the placeholder image when provided', () => {
    mockQuery.mockReturnValue({ isLoading: false, error: { status: 404 }, data: undefined } as any)
    render(<MemberPhoto membershipNumber="12345" title="Alice Smith" />)
    expect(document.querySelector('img')).toHaveAttribute('title', 'Alice Smith')
  })

  it('renders the member photo when data is available', () => {
    mockQuery.mockReturnValue({ isLoading: false, error: undefined, data: 'https://example.com/photo.jpg' } as any)
    render(<MemberPhoto membershipNumber="12345" alt="Alice" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg')
    expect(img).toHaveAttribute('alt', 'Alice')
  })

  it('queries with the provided membership number', () => {
    mockQuery.mockReturnValue({ isLoading: false, error: undefined, data: undefined } as any)
    render(<MemberPhoto membershipNumber="99999" />)
    expect(mockQuery).toHaveBeenCalledWith('99999', expect.anything())
  })
})

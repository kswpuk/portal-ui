import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { saveAs } from 'file-saver'
import { useExportQuery } from '../redux/membersApi'
import ExportCsvButton from './ExportCsvButton'

vi.mock('file-saver', () => ({ saveAs: vi.fn() }))
vi.mock('../redux/membersApi', () => ({ useExportQuery: vi.fn() }))

const mockUseExportQuery = vi.mocked(useExportQuery)

const idleState = { data: undefined, isFetching: false, fulfilledTimeStamp: undefined }
const loadingState = { data: undefined, isFetching: true, fulfilledTimeStamp: undefined }
const successState = { data: 'name,email\nAlice,alice@example.com', isFetching: false, fulfilledTimeStamp: 12345 }

describe('ExportCsvButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseExportQuery.mockReturnValue(idleState as any)
  })

  describe('button label', () => {
    it('shows "Export All" when selected is an empty array', () => {
      render(<ExportCsvButton selected={[]} />)
      expect(screen.getByRole('button', { name: 'Export All' })).toBeInTheDocument()
    })

    it('shows "Export Selected" when selected has items', () => {
      render(<ExportCsvButton selected={['member-1', 'member-2']} />)
      expect(screen.getByRole('button', { name: 'Export Selected' })).toBeInTheDocument()
    })

    it('shows "Export Selected" when selected is not provided', () => {
      render(<ExportCsvButton />)
      expect(screen.getByRole('button', { name: 'Export Selected' })).toBeInTheDocument()
    })
  })

  describe('loading state', () => {
    it('disables the button while a request is in flight', () => {
      mockUseExportQuery.mockReturnValue(loadingState as any)
      render(<ExportCsvButton selected={[]} />)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('disables the icon button while a request is in flight', () => {
      mockUseExportQuery.mockReturnValue(loadingState as any)
      render(<ExportCsvButton selected={[]} iconButton />)
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('icon button variant', () => {
    it('renders a button when iconButton=true', () => {
      render(<ExportCsvButton selected={[]} iconButton />)
      expect(screen.getByRole('button', { name: 'Export All' })).toBeInTheDocument()
    })
  })

  describe('triggering the export', () => {
    it('sets skip=false on the query after the button is clicked', async () => {
      const user = userEvent.setup()
      render(<ExportCsvButton selected={[]} />)
      await user.click(screen.getByRole('button'))
      expect(mockUseExportQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ skip: false })
      )
    })

    it('passes selected members and event to the query', async () => {
      const user = userEvent.setup()
      render(<ExportCsvButton selected={['m-1', 'm-2']} event="evt-99" />)
      await user.click(screen.getByRole('button'))
      expect(mockUseExportQuery).toHaveBeenCalledWith(
        expect.objectContaining({ members: ['m-1', 'm-2'], event: 'evt-99' }),
        expect.anything()
      )
    })
  })

  describe('saving the file', () => {
    it('calls saveAs with the given filename when data is returned', () => {
      mockUseExportQuery.mockReturnValue(successState as any)
      render(<ExportCsvButton selected={[]} filename="members" />)
      expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'members.csv')
    })

    it('defaults to "export.csv" when no filename is provided', () => {
      mockUseExportQuery.mockReturnValue(successState as any)
      render(<ExportCsvButton selected={[]} />)
      expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'export.csv')
    })

    it('does not call saveAs when there is no data', () => {
      render(<ExportCsvButton selected={[]} />)
      expect(saveAs).not.toHaveBeenCalled()
    })
  })
})

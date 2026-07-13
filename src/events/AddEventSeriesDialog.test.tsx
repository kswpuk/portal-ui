import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCreateEventSeriesMutation } from '../redux/eventsApi'
import AddEventSeriesDialog from './AddEventSeriesDialog'

vi.mock('../redux/eventsApi', () => ({
  useCreateEventSeriesMutation: vi.fn(),
}))

describe('AddEventSeriesDialog', () => {
  const mockCreateEventSeries = vi.fn()
  const mockClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCreateEventSeriesMutation).mockReturnValue([
      mockCreateEventSeries,
      { isLoading: false, isSuccess: false, error: null, reset: vi.fn() },
    ] as any)
  })

  it('renders the dialog when show is true', () => {
    render(
      <AddEventSeriesDialog
        existing={[]}
        onClose={mockClose}
        show={true}
      />
    )
    expect(screen.getByRole('heading', { name: 'Create Event Series' })).toBeInTheDocument()
  })

  it('submits form with correct values', async () => {
    const user = userEvent.setup()
    render(
      <AddEventSeriesDialog
        existing={[]}
        onClose={mockClose}
        show={true}
      />
    )

    // Fill in Name
    const nameInput = screen.getByLabelText(/Name/i)
    await user.type(nameInput, 'New Series Name')

    // Fill in Description
    const descriptionInput = screen.getByLabelText(/Description/i)
    await user.type(descriptionInput, 'This is a description of the new series.')

    // Choose Event Type
    const typeSelect = screen.getByRole('combobox', { name: /Event Type/i })
    await user.click(typeSelect)

    const option = await screen.findByRole('option', { name: /Social/i })
    await user.click(option)

    // Click submit button
    const submitButton = screen.getByRole('button', { name: 'Create Event Series' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateEventSeries).toHaveBeenCalledWith({
        eventSeriesId: 'new-series-name',
        body: {
          name: 'New Series Name',
          description: 'This is a description of the new series.',
          type: 'social',
        },
      })
    })
  })
})

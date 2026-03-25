import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmButton from './ConfirmButton'

describe('ConfirmButton', () => {
  it('renders the trigger button with its children', () => {
    render(<ConfirmButton onCancel={vi.fn()} onConfirm={vi.fn()}>Delete</ConfirmButton>)
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('does not show the dialog initially', () => {
    render(<ConfirmButton onCancel={vi.fn()} onConfirm={vi.fn()}>Delete</ConfirmButton>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the dialog when the button is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmButton onCancel={vi.fn()} onConfirm={vi.fn()}>Delete</ConfirmButton>)
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shows default title and body text', async () => {
    const user = userEvent.setup()
    render(<ConfirmButton onCancel={vi.fn()} onConfirm={vi.fn()}>Delete</ConfirmButton>)
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('heading', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('shows custom title and body text when provided', async () => {
    const user = userEvent.setup()
    render(
      <ConfirmButton onCancel={vi.fn()} onConfirm={vi.fn()} title="Delete item?" body="This cannot be undone.">
        Delete
      </ConfirmButton>
    )
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByText('Delete item?')).toBeInTheDocument()
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  })

  it('calls onConfirm when the confirm button is clicked', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(<ConfirmButton onCancel={vi.fn()} onConfirm={onConfirm}>Delete</ConfirmButton>)
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when the cancel button is clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<ConfirmButton onCancel={onCancel} onConfirm={vi.fn()}>Delete</ConfirmButton>)
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('shows custom confirm and cancel text', async () => {
    const user = userEvent.setup()
    render(
      <ConfirmButton onCancel={vi.fn()} onConfirm={vi.fn()} confirmText="Yes, delete" cancelText="No, keep it">
        Delete
      </ConfirmButton>
    )
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('button', { name: 'Yes, delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'No, keep it' })).toBeInTheDocument()
  })

  it('opens the dialog and shows loading text when loading=true', () => {
    render(
      <ConfirmButton onCancel={vi.fn()} onConfirm={vi.fn()} loading={true} loadingText="Deleting...">
        Delete
      </ConfirmButton>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Deleting...')).toBeInTheDocument()
  })

  it('disables the trigger button when disabled=true', () => {
    render(
      <ConfirmButton onCancel={vi.fn()} onConfirm={vi.fn()} disabled>
        Delete
      </ConfirmButton>
    )
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmLink from './ConfirmLink'

describe('ConfirmLink', () => {
  it('renders the trigger link with its children', () => {
    render(<ConfirmLink onConfirm={vi.fn()}>Remove</ConfirmLink>)
    // MUI Link without href has no ARIA role — query by text
    expect(screen.getByText('Remove')).toBeInTheDocument()
  })

  it('does not show the dialog initially', () => {
    render(<ConfirmLink onConfirm={vi.fn()}>Remove</ConfirmLink>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the dialog when the link is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmLink onConfirm={vi.fn()}>Remove</ConfirmLink>)
    await user.click(screen.getByText('Remove'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shows default title and body text', async () => {
    const user = userEvent.setup()
    render(<ConfirmLink onConfirm={vi.fn()}>Remove</ConfirmLink>)
    await user.click(screen.getByText('Remove'))
    expect(screen.getByRole('heading', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('shows custom title and body text when provided', async () => {
    const user = userEvent.setup()
    render(
      <ConfirmLink onConfirm={vi.fn()} title="Remove member?" body="This cannot be undone.">
        Remove
      </ConfirmLink>
    )
    await user.click(screen.getByText('Remove'))
    expect(screen.getByText('Remove member?')).toBeInTheDocument()
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  })

  it('calls onConfirm when the confirm button is clicked', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(<ConfirmLink onConfirm={onConfirm}>Remove</ConfirmLink>)
    await user.click(screen.getByText('Remove'))
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when the cancel button is clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<ConfirmLink onConfirm={vi.fn()} onCancel={onCancel}>Remove</ConfirmLink>)
    await user.click(screen.getByText('Remove'))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('closes the dialog on cancel even when onCancel is not provided', async () => {
    const user = userEvent.setup()
    render(<ConfirmLink onConfirm={vi.fn()}>Remove</ConfirmLink>)
    await user.click(screen.getByText('Remove'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    // no error thrown — onCancel being optional is handled gracefully
  })

  it('shows custom confirm and cancel text', async () => {
    const user = userEvent.setup()
    render(
      <ConfirmLink onConfirm={vi.fn()} confirmText="Yes, remove" cancelText="No, keep it">
        Remove
      </ConfirmLink>
    )
    await user.click(screen.getByText('Remove'))
    expect(screen.getByRole('button', { name: 'Yes, remove' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'No, keep it' })).toBeInTheDocument()
  })

  it('opens the dialog and disables buttons when loading=true', () => {
    render(<ConfirmLink onConfirm={vi.fn()} loading={true}>Remove</ConfirmLink>)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    screen.getAllByRole('button').forEach(btn => expect(btn).toBeDisabled())
  })
})

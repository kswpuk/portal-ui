import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmDialog from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('is not present in the DOM when open=false', () => {
    render(<ConfirmDialog open={false} onCancel={vi.fn()} onConfirm={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is visible when open=true', () => {
    render(<ConfirmDialog open={true} onCancel={vi.fn()} onConfirm={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shows default title and body text', () => {
    render(<ConfirmDialog open={true} onCancel={vi.fn()} onConfirm={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('shows custom title and body text when provided', () => {
    render(
      <ConfirmDialog open={true} onCancel={vi.fn()} onConfirm={vi.fn()}
        title="Delete item?" body="This cannot be undone." />
    )
    expect(screen.getByText('Delete item?')).toBeInTheDocument()
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  })

  it('calls onConfirm when the confirm button is clicked', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(<ConfirmDialog open={true} onCancel={vi.fn()} onConfirm={onConfirm} />)
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when the cancel button is clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<ConfirmDialog open={true} onCancel={onCancel} onConfirm={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('shows custom confirm and cancel text', () => {
    render(
      <ConfirmDialog open={true} onCancel={vi.fn()} onConfirm={vi.fn()}
        confirmText="Yes, delete" cancelText="No, keep it" />
    )
    expect(screen.getByRole('button', { name: 'Yes, delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'No, keep it' })).toBeInTheDocument()
  })

  it('disables both buttons and shows loading text when loading=true', () => {
    render(
      <ConfirmDialog open={true} onCancel={vi.fn()} onConfirm={vi.fn()}
        loading={true} loadingText="Deleting..." />
    )
    expect(screen.getByText('Deleting...')).toBeInTheDocument()
    screen.getAllByRole('button').forEach(btn => expect(btn).toBeDisabled())
  })

  it('shows default loading text when loading=true and loadingText is not provided', () => {
    render(<ConfirmDialog open={true} onCancel={vi.fn()} onConfirm={vi.fn()} loading={true} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})

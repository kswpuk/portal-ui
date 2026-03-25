import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuItem } from '@mui/material'
import ButtonMenu from './ButtonMenu'

describe('ButtonMenu', () => {
  it('renders the trigger button with the given label', () => {
    render(<ButtonMenu buttonText="Actions"><MenuItem>Item 1</MenuItem></ButtonMenu>)
    expect(screen.getByRole('button', { name: 'Actions' })).toBeInTheDocument()
  })

  it('does not show the menu initially', () => {
    render(<ButtonMenu buttonText="Actions"><MenuItem>Item 1</MenuItem></ButtonMenu>)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens the menu when the button is clicked', async () => {
    const user = userEvent.setup()
    render(<ButtonMenu buttonText="Actions"><MenuItem>Item 1</MenuItem></ButtonMenu>)
    await user.click(screen.getByRole('button', { name: 'Actions' }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('shows all menu items after opening', async () => {
    const user = userEvent.setup()
    render(
      <ButtonMenu buttonText="Actions">
        <MenuItem>Edit</MenuItem>
        <MenuItem>Delete</MenuItem>
      </ButtonMenu>
    )
    await user.click(screen.getByRole('button', { name: 'Actions' }))
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('calls the item onClick when an item is clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <ButtonMenu buttonText="Actions">
        <MenuItem onClick={onClick}>Edit</MenuItem>
      </ButtonMenu>
    )
    await user.click(screen.getByRole('button', { name: 'Actions' }))
    await user.click(screen.getByText('Edit'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('closes the menu after an item is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ButtonMenu buttonText="Actions">
        <MenuItem>Edit</MenuItem>
      </ButtonMenu>
    )
    await user.click(screen.getByRole('button', { name: 'Actions' }))
    await user.click(screen.getByText('Edit'))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('disables the trigger button when disabled=true', () => {
    render(<ButtonMenu buttonText="Actions" disabled><MenuItem>Item</MenuItem></ButtonMenu>)
    expect(screen.getByRole('button', { name: 'Actions' })).toBeDisabled()
  })
})

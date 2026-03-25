import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Help from './Help'

describe('Help', () => {
  it('renders the help icon', () => {
    render(<Help>Some help text</Help>)
    expect(screen.getByTestId('HelpOutlineIcon')).toBeInTheDocument()
  })

  it('shows tooltip content on hover', async () => {
    const user = userEvent.setup()
    render(<Help>Some help text</Help>)
    await user.hover(screen.getByTestId('HelpOutlineIcon'))
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Some help text')
  })
})

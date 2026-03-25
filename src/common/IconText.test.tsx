import { render, screen } from '@testing-library/react'
import IconText from './IconText'

describe('IconText', () => {
  it('renders the icon', () => {
    render(<IconText icon={<span data-testid="test-icon" />}>Label text</IconText>)
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('renders the children text', () => {
    render(<IconText icon={<span />}>Label text</IconText>)
    expect(screen.getByText('Label text')).toBeInTheDocument()
  })

  it('renders icon and children together', () => {
    render(<IconText icon={<span data-testid="icon" />}>Some info</IconText>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('Some info')).toBeInTheDocument()
  })
})

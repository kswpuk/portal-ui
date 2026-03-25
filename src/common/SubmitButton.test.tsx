import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SubmitButton from './SubmitButton'

describe('SubmitButton', () => {
  describe('label', () => {
    it('uses children as the button label', () => {
      render(<SubmitButton>Save</SubmitButton>)
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    })

    it('uses the text prop as the button label', () => {
      render(<SubmitButton text="Save Changes" />)
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
    })
  })

  describe('button type', () => {
    it('is type="submit" when no onClick is provided', () => {
      render(<SubmitButton>Save</SubmitButton>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })

    it('is type="button" when onClick is provided', () => {
      render(<SubmitButton onClick={vi.fn()}>Save</SubmitButton>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })
  })

  describe('onClick', () => {
    it('calls onClick when clicked', async () => {
      const onClick = vi.fn()
      const user = userEvent.setup()
      render(<SubmitButton onClick={onClick}>Save</SubmitButton>)
      await user.click(screen.getByRole('button'))
      expect(onClick).toHaveBeenCalledOnce()
    })
  })

  describe('disabled state', () => {
    it('is disabled when disabled=true', () => {
      render(<SubmitButton disabled>Save</SubmitButton>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('is disabled when submitting=true', () => {
      render(<SubmitButton submitting>Save</SubmitButton>)
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('submitting state', () => {
    it('shows "Submitting..." by default while submitting', () => {
      render(<SubmitButton submitting>Save</SubmitButton>)
      expect(screen.getByRole('button', { name: /Submitting\.\.\./ })).toBeInTheDocument()
    })

    it('shows custom submittingText while submitting', () => {
      render(<SubmitButton submitting submittingText="Saving...">Save</SubmitButton>)
      expect(screen.getByRole('button', { name: /Saving\.\.\./ })).toBeInTheDocument()
    })

    it('shows the original label when not submitting', () => {
      render(<SubmitButton submitting={false}>Save</SubmitButton>)
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    })
  })
})

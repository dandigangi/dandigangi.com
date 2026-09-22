import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import EggToast from './EggToast'

describe('EggToast', () => {
  it('shows nothing until the egg is found', () => {
    const { container } = render(<EggToast show={false} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the egg toast once the trigger matches', () => {
    render(<EggToast show />)
    expect(screen.getByText(/You found an easter egg!/)).toBeInTheDocument()
  })

  it('stays dismissed when the trigger fires again', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<EggToast show />)

    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    // Clearing the search box and retyping his name should not re-announce it.
    rerender(<EggToast show={false} />)
    rerender(<EggToast show />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

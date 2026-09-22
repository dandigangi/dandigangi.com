import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Blip from './Blip'
import { T, clearTokens } from '@/lib/ledger'

// A toast announces a NEW find, so every case starts from nothing found. The
// tally is module state, so clearing storage alone would leave it behind.
beforeEach(() => {
  localStorage.clear()
  clearTokens()
})

describe('Blip', () => {
  it('shows nothing until the egg is found', () => {
    const { container } = render(<Blip egg={T.probe} show={false} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the egg toast once the trigger matches', () => {
    render(<Blip egg={T.probe} show />)
    expect(screen.getByText(/You found an easter egg!/)).toBeInTheDocument()
  })

  it('stays dismissed when the trigger fires again', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Blip egg={T.probe} show />)

    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    // The outro runs first, so it leaves rather than vanishing mid-frame.
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    // Clearing the search box and retyping his name should not re-announce it.
    rerender(<Blip egg={T.probe} show={false} />)
    rerender(<Blip egg={T.probe} show />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('the egg count', () => {
  it('shows progress through the eggs', async () => {
    const { addToken, tokenTotal } = await import('@/lib/ledger')
    addToken(T.gate)
    render(<Blip egg={T.probe} show />)
    // Two found: the one already recorded, plus this one.
    expect(await screen.findByRole('button', { name: `(2/${tokenTotal()})` })).toBeInTheDocument()
  })

  /** The whole point of the counter is that it climbs, so walk it. */
  it('climbs one at a time as each egg is found, and stops at the total', async () => {
    // Driven off the real registry, so adding a sixth egg fails here rather
    // than quietly leaving the assertion behind.
    const { TOKENS, tokenTotal } = await import('@/lib/ledger')
    for (const [index, egg] of TOKENS.entries()) {
      const view = render(<Blip egg={egg} show />)
      expect(
        await screen.findByRole('button', { name: `(${index + 1}/${tokenTotal()})` })
      ).toBeInTheDocument()
      view.unmount()
    }
  })

  it('says nothing the second time the same egg is triggered', async () => {
    const { tokenTotal } = await import('@/lib/ledger')
    const first = render(<Blip egg={T.probe} show />)
    expect(await screen.findByRole('button', { name: `(1/${tokenTotal()})` })).toBeInTheDocument()
    first.unmount()

    // Re-triggering something already in the tally is not a discovery.
    render(<Blip egg={T.probe} show />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  /** Reset Pikachu clears the tally too, or the count is stuck forever. */
  it('starts over after a reset', async () => {
    const { addToken, tokenCount, tokenTotal } = await import('@/lib/ledger')
    addToken(T.probe)
    addToken(T.gate)
    expect(tokenCount()).toBe(2)

    clearTokens()
    expect(tokenCount()).toBe(0)

    render(<Blip egg={T.met} show />)
    expect(await screen.findByRole('button', { name: `(1/${tokenTotal()})` })).toBeInTheDocument()
  })
})

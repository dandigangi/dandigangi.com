import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import EggToast from './EggToast'
import { resetEggs } from '@/lib/eggs'

// A toast announces a NEW find, so every case starts from nothing found. The
// tally is module state, so clearing storage alone would leave it behind.
beforeEach(() => {
  localStorage.clear()
  resetEggs()
})

describe('EggToast', () => {
  it('shows nothing until the egg is found', () => {
    const { container } = render(<EggToast egg="search" show={false} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the egg toast once the trigger matches', () => {
    render(<EggToast egg="search" show />)
    expect(screen.getByText(/You found an easter egg!/)).toBeInTheDocument()
  })

  it('stays dismissed when the trigger fires again', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<EggToast egg="search" show />)

    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    // The outro runs first, so it leaves rather than vanishing mid-frame.
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    // Clearing the search box and retyping his name should not re-announce it.
    rerender(<EggToast egg="search" show={false} />)
    rerender(<EggToast egg="search" show />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('the egg count', () => {
  it('shows progress through the eggs', async () => {
    const { findEgg, TOTAL_EGGS } = await import('@/lib/eggs')
    findEgg('admin')
    render(<EggToast egg="search" show />)
    // Two found: the one already recorded, plus this one.
    expect(await screen.findByRole('button', { name: `(2/${TOTAL_EGGS})` })).toBeInTheDocument()
  })

  /** The whole point of the counter is that it climbs, so walk it. */
  it('climbs one at a time as each egg is found, and stops at the total', async () => {
    // Driven off the real registry, so adding a sixth egg fails here rather
    // than quietly leaving the assertion behind.
    const { EGGS, TOTAL_EGGS } = await import('@/lib/eggs')
    for (const [index, egg] of EGGS.entries()) {
      const view = render(<EggToast egg={egg} show />)
      expect(
        await screen.findByRole('button', { name: `(${index + 1}/${TOTAL_EGGS})` })
      ).toBeInTheDocument()
      view.unmount()
    }
  })

  it('says nothing the second time the same egg is triggered', async () => {
    const { TOTAL_EGGS } = await import('@/lib/eggs')
    const first = render(<EggToast egg="search" show />)
    expect(await screen.findByRole('button', { name: `(1/${TOTAL_EGGS})` })).toBeInTheDocument()
    first.unmount()

    // Re-triggering something already in the tally is not a discovery.
    render(<EggToast egg="search" show />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  /** Reset Pikachu clears the tally too, or the count is stuck forever. */
  it('starts over after a reset', async () => {
    const { findEgg, foundEggs, TOTAL_EGGS } = await import('@/lib/eggs')
    findEgg('search')
    findEgg('admin')
    expect(foundEggs()).toBe(2)

    resetEggs()
    expect(foundEggs()).toBe(0)

    render(<EggToast egg="pikachu" show />)
    expect(await screen.findByRole('button', { name: `(1/${TOTAL_EGGS})` })).toBeInTheDocument()
  })
})

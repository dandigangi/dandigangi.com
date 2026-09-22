import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import TagRowEnd from './TagRowEnd'
import { foundEggs, resetEggs, totalEggs } from '@/lib/eggs'

// The tally is module state, so clearing storage alone leaves it behind.
beforeEach(() => {
  localStorage.clear()
  resetEggs()
})

describe('TagRowEnd', () => {
  it('has a hit area, so there is something to stumble onto', () => {
    const { container } = render(<TagRowEnd />)
    const target = container.querySelector('button')!
    expect(target).toBeInTheDocument()
    // The class carries the size and the pointer cursor.
    expect(target.className).toContain('spacer')
  })

  it('renders no visible text, so the word never reaches the page copy', () => {
    const { container } = render(<TagRowEnd />)
    expect(container.querySelector('button')!.textContent).toBe('')
  })

  /** Announced and reachable: hiding it would make it sighted-mouse-only. */
  it('is focusable and announces itself', async () => {
    const user = userEvent.setup()
    render(<TagRowEnd />)
    const target = screen.getByRole('button', { name: 'Pikachu' })

    await user.tab()
    expect(document.activeElement).toBe(target)
  })

  it('records the egg and announces it when clicked', async () => {
    const user = userEvent.setup()
    render(<TagRowEnd />)

    await user.click(screen.getByRole('button', { name: 'Pikachu' }))

    expect(foundEggs()).toBe(1)
    expect(await screen.findByText(`(1/${totalEggs()})`, { exact: false })).toBeInTheDocument()
  })

  /** The toast announces a discovery, not a trigger. */
  it('says nothing when the egg was already found', async () => {
    const user = userEvent.setup()
    const { findEgg } = await import('@/lib/eggs')
    findEgg('hidden')

    render(<TagRowEnd />)
    await user.click(screen.getByRole('button', { name: 'Pikachu' }))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

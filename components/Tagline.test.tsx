import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import siteMetadata from '@/data/siteMetadata'
import Tagline from './Tagline'

const CANONICAL = siteMetadata.tagline
const START_DELAY = 600
const SPEED = 26

/** jsdom has no matchMedia; every test decides what the preference says. */
const setReducedMotion = (matches: boolean) => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
  )
}

/** Past the initial pause and far enough for the longest line to finish. */
const typeItOut = () => act(() => void vi.advanceTimersByTime(START_DELAY + SPEED * 80))

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  setReducedMotion(false)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const HOLD = 4000

/** Past the hold, so the next line has typed itself in. */
const waitOutHold = () => act(() => void vi.advanceTimersByTime(HOLD + SPEED * 80))

describe('Tagline', () => {
  it('carries the full line for screen readers before anything is typed', () => {
    render(<Tagline />)
    // The animation is decoration; the accessible name is the line itself, and
    // it is never exposed half-written.
    expect(screen.getByRole('button')).toHaveAccessibleName(CANONICAL)
  })

  it('waits before it starts, then types', () => {
    const { container } = render(<Tagline />)
    const typed = () => container.querySelector('[class*="typed"]')?.textContent ?? ''

    act(() => void vi.advanceTimersByTime(START_DELAY - 50))
    expect(typed()).toBe('')

    typeItOut()
    expect(typed()).toBe(CANONICAL)
  })

  it('shows the whole line at once when motion is reduced', () => {
    setReducedMotion(true)
    const { container } = render(<Tagline />)
    // No timers advanced: the preference means it must not animate at all.
    expect(container.querySelector('[class*="typed"]')?.textContent).toBe(CANONICAL)
  })

  it('swaps to a different line when clicked, never the same one', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<Tagline />)
    typeItOut()

    const button = screen.getByRole('button')
    let current = CANONICAL

    // Random picks, so this is worth repeating rather than trusting once.
    for (let i = 0; i < 12; i += 1) {
      await user.click(button)
      typeItOut()
      const next = button.getAttribute('aria-label') ?? button.textContent ?? ''
      expect(next).not.toBe(current)
      current = next
    }
  })

  it('moves on by itself once a line has been read', () => {
    render(<Tagline />)
    typeItOut()
    const button = screen.getByRole('button')
    const firstLine = button.textContent

    // Still holding just short of the interval.
    act(() => void vi.advanceTimersByTime(HOLD - 100))
    expect(button.textContent).toBe(firstLine)

    waitOutHold()
    expect(button.textContent).not.toBe(firstLine)
  })

  it('does not start the hold until the line has finished typing', () => {
    render(<Tagline />)
    // Mid-type: the hold must not already be counting, or a long line would be
    // cut short by its own timer.
    act(() => void vi.advanceTimersByTime(START_DELAY + SPEED * 3))
    const partial = screen.getByRole('button').textContent

    act(() => void vi.advanceTimersByTime(HOLD - 100))
    expect(screen.getByRole('button').textContent).not.toBe(partial)
  })

  it('holds while the pointer is on it', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<Tagline />)
    typeItOut()

    const button = screen.getByRole('button')
    await user.hover(button)
    const held = button.textContent

    waitOutHold()
    // Paused: movement lasting more than five seconds has to be stoppable.
    expect(button.textContent).toBe(held)

    await user.unhover(button)
    waitOutHold()
    expect(button.textContent).not.toBe(held)
  })

  it('never rotates on its own when motion is reduced', () => {
    setReducedMotion(true)
    render(<Tagline />)
    const before = screen.getByRole('button').textContent

    waitOutHold()
    waitOutHold()
    expect(screen.getByRole('button').textContent).toBe(before)
  })

  it('shows the interaction hint only where it is asked for', () => {
    const { container: bare } = render(<Tagline />)
    expect(bare.querySelector('svg')).toBeNull()

    const { container: hinted } = render(<Tagline arrow />)
    const svg = hinted.querySelector('svg')
    expect(svg).not.toBeNull()
    // Decoration: it must not become a second thing to tab to or announce.
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('focusable', 'false')
  })

  it('reaches every line eventually', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<Tagline />)
    typeItOut()

    const button = screen.getByRole('button')
    const seen = new Set<string>([CANONICAL])
    for (let i = 0; i < 30; i += 1) {
      await user.click(button)
      typeItOut()
      seen.add(button.textContent ?? '')
    }
    expect(seen.size).toBeGreaterThanOrEqual(3)
  })
})

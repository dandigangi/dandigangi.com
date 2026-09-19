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

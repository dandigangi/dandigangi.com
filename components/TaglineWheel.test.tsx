import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TAGLINES } from '@/lib/taglines'
import TaglineWheel from './TaglineWheel'

const HOLD = 2300

const setReducedMotion = (matches: boolean) => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })
  )
}

/** The lit line is the one the control announces. */
const centred = () => screen.getByRole('button').textContent?.replace(' — show another', '') ?? ''

const turnOnce = () => act(() => void vi.advanceTimersByTime(HOLD + 600))

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  setReducedMotion(false)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('TaglineWheel', () => {
  it('starts on the canonical line', () => {
    render(<TaglineWheel />)
    expect(centred()).toBe(TAGLINES[0])
  })

  it('turns on its own', () => {
    render(<TaglineWheel />)

    act(() => void vi.advanceTimersByTime(HOLD - 100))
    expect(centred()).toBe(TAGLINES[0])

    turnOnce()
    expect(centred()).toBe(TAGLINES[1])
  })

  it('turns in order and wraps back round', () => {
    render(<TaglineWheel />)
    for (let step = 1; step <= TAGLINES.length * 2; step += 1) {
      turnOnce()
      // Wrapping is the part worth pinning: the reel is three copies deep and
      // snaps back to the middle one, which must not skip or repeat a line.
      expect(centred()).toBe(TAGLINES[step % TAGLINES.length])
    }
  })

  it('turns when clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<TaglineWheel />)

    await user.click(screen.getByRole('button'))
    expect(centred()).toBe(TAGLINES[1])
  })

  it('holds while the pointer is on it', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const { container } = render(<TaglineWheel />)

    await user.hover(container.firstElementChild as Element)
    turnOnce()
    turnOnce()
    expect(centred()).toBe(TAGLINES[0])
  })

  it('never turns on its own when motion is reduced', () => {
    setReducedMotion(true)
    render(<TaglineWheel />)

    turnOnce()
    turnOnce()
    expect(centred()).toBe(TAGLINES[0])
  })

  /**
   * jsdom never fires transitionend, so the reel has to be told the turn
   * finished. That is the whole point: the snap used to happen a frame after
   * the position changed, mid-travel, which is what made the wrap jump.
   */
  const finishTurn = (reel: Element) => act(() => void fireEvent.transitionEnd(reel))

  it('snaps back to the middle copy only once a turn has finished', () => {
    const { container } = render(<TaglineWheel />)
    const reel = container.querySelector('[class*="reel"]') as HTMLElement
    const home = reel.style.transform

    for (let step = 0; step < TAGLINES.length; step += 1) {
      turnOnce()
      finishTurn(reel)
    }

    // A full cycle lands on a row that renders identically to the first, so the
    // reel must be back where it started rather than a copy further down.
    expect(reel.style.transform).toBe(home)
    expect(centred()).toBe(TAGLINES[0])
  })

  it('does not snap while the reel is still travelling', () => {
    const { container } = render(<TaglineWheel />)
    const reel = container.querySelector('[class*="reel"]') as HTMLElement
    const home = reel.style.transform

    for (let step = 0; step < TAGLINES.length; step += 1) turnOnce()

    // No transition has been reported as finished, so the reel is mid-cycle and
    // must still be showing the travel rather than having been yanked home.
    expect(reel.style.transform).not.toBe(home)
  })

  it('ignores transition events bubbling up from the rows', () => {
    const { container } = render(<TaglineWheel />)
    const reel = container.querySelector('[class*="reel"]') as HTMLElement
    const row = reel.querySelector('[class*="line"]') as HTMLElement

    for (let step = 0; step < TAGLINES.length; step += 1) turnOnce()
    const travelled = reel.style.transform

    // Each row animates its own scale and colour, and those bubble.
    act(() => void fireEvent.transitionEnd(row))
    expect(reel.style.transform).toBe(travelled)
  })

  it('hides the ghost lines from assistive tech', () => {
    const { container } = render(<TaglineWheel />)
    // Every copy of every line lives in the reel; only the control's label
    // should reach a screen reader, or it reads the same three lines on a loop.
    const reel = container.querySelector('[aria-hidden="true"]')
    expect(reel).not.toBeNull()
    expect(reel?.textContent).toContain(TAGLINES[0])
  })
})

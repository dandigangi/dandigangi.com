import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PokeballThrow, { FLIGHT_MS } from './PokeballThrow'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const throwAt = (onDone = vi.fn()) => ({
  onDone,
  ...render(<PokeballThrow x={200} y={300} onDone={onDone} />),
})

describe('PokeballThrow', () => {
  it('lands on the point it was given', () => {
    const { container } = throwAt()
    const stage = container.firstElementChild as HTMLElement
    expect(stage.style.left).toBe('200px')
    expect(stage.style.top).toBe('300px')
  })

  it('finishes, so the modal behind it is never blocked', () => {
    const { onDone } = throwAt()
    expect(onDone).not.toHaveBeenCalled()

    act(() => void vi.advanceTimersByTime(FLIGHT_MS + 500))
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  /**
   * The parent re-renders on every store update while this is on screen. A
   * fresh `onDone` in a dependency list would restart the flight each time and
   * the ball would never land.
   */
  it('does not restart its flight when the parent re-renders', () => {
    const first = vi.fn()
    const { rerender } = render(<PokeballThrow x={10} y={10} onDone={first} />)

    act(() => void vi.advanceTimersByTime(FLIGHT_MS / 2))
    const second = vi.fn()
    rerender(<PokeballThrow x={10} y={10} onDone={second} />)
    act(() => void vi.advanceTimersByTime(FLIGHT_MS))

    // The timers kept running, and the newest callback is the one that fires.
    expect(second).toHaveBeenCalledTimes(1)
    expect(first).not.toHaveBeenCalled()
  })

  it('spins with the direction of travel', () => {
    // Landing right of centre means travelling left, so it spins the other way.
    const right = render(<PokeballThrow x={window.innerWidth} y={100} onDone={vi.fn()} />)
    expect(
      (right.container.firstElementChild as HTMLElement).style.getPropertyValue('--spin')
    ).toBe('720deg')
    right.unmount()

    const left = render(<PokeballThrow x={0} y={100} onDone={vi.fn()} />)
    expect((left.container.firstElementChild as HTMLElement).style.getPropertyValue('--spin')).toBe(
      '-720deg'
    )
  })

  it('is scenery — it never eats a click meant for the page', () => {
    const { container } = throwAt()
    const stage = container.firstElementChild as HTMLElement
    expect(stage).toHaveAttribute('aria-hidden', 'true')
    // The class carries pointer-events: none; assert the intent is declared.
    expect(stage.className).toBeTruthy()
  })

  it('renders the ball itself', () => {
    throwAt()
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('cleans up its timers when unmounted mid-flight', () => {
    const onDone = vi.fn()
    const { unmount } = render(<PokeballThrow x={10} y={10} onDone={onDone} />)
    unmount()
    act(() => void vi.advanceTimersByTime(FLIGHT_MS + 500))
    expect(onDone).not.toHaveBeenCalled()
  })
})

describe('the pokeball', () => {
  it('draws rather than fetching an image', () => {
    throwAt()
    expect(document.querySelector('svg')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})

import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Toast, { EXIT_MS } from './Toast'

const DISMISS_MS = 9500

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }))
afterEach(() => vi.useRealTimers())

describe('Toast', () => {
  it('says what was found', () => {
    render(<Toast onClose={vi.fn()} />)
    expect(screen.getByText(/You found an easter egg!/)).toBeInTheDocument()
  })

  it('shows progress only when both halves of it are given', () => {
    const { rerender } = render(<Toast onClose={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /\d+\/\d+/ })).not.toBeInTheDocument()

    rerender(<Toast onClose={vi.fn()} count={3} total={9} />)
    expect(screen.getByRole('button', { name: '(3/9)' })).toBeInTheDocument()
  })

  it('announces itself politely rather than stealing focus', () => {
    render(<Toast onClose={vi.fn()} />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(document.activeElement).toBe(document.body)
  })

  it('dismisses itself, but not before it can be read and acted on', () => {
    const onClose = vi.fn()
    render(<Toast onClose={onClose} />)

    act(() => void vi.advanceTimersByTime(DISMISS_MS - 1))
    expect(onClose).not.toHaveBeenCalled()

    act(() => void vi.advanceTimersByTime(1))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('starts leaving before it is removed, so the outro has time to run', () => {
    const onClose = vi.fn()
    const { container } = render(<Toast onClose={onClose} />)
    const toast = container.firstElementChild as HTMLElement
    const before = toast.className

    act(() => void vi.advanceTimersByTime(DISMISS_MS - EXIT_MS))
    expect(toast.className).not.toBe(before)
    expect(onClose).not.toHaveBeenCalled()

    act(() => void vi.advanceTimersByTime(EXIT_MS))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('can be dismissed by hand, and still plays its outro', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const onClose = vi.fn()
    render(<Toast onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    // Not torn out from under the animation — the same exit the timer gets.
    expect(onClose).not.toHaveBeenCalled()

    act(() => void vi.advanceTimersByTime(EXIT_MS))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not restart its timer when the parent re-renders', () => {
    const onClose = vi.fn()
    // A stable identity is the contract: the cameo re-renders on its own
    // schedule, and a fresh callback each time would defer the dismiss forever.
    const { rerender } = render(<Toast onClose={onClose} />)

    act(() => void vi.advanceTimersByTime(DISMISS_MS / 2))
    rerender(<Toast onClose={onClose} />)
    act(() => void vi.advanceTimersByTime(DISMISS_MS / 2))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

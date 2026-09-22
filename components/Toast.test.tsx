import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import siteMetadata from '@/data/siteMetadata'
import Toast, { EXIT_MS } from './Toast'

const DISMISS_MS = 30000

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }))
afterEach(() => vi.useRealTimers())

describe('Toast', () => {
  it('offers both ways to claim the prize', () => {
    render(<Toast onClose={vi.fn()} />)

    const email = screen.getByRole('link', { name: 'email' })
    expect(email).toHaveAttribute('href', expect.stringContaining(`mailto:${siteMetadata.email}`))
    // Pre-filled subject, so one of these is recognisable in the inbox.
    expect(email.getAttribute('href')).toContain('subject=')

    const dm = screen.getByRole('link', { name: 'DM me on X' })
    expect(dm).toHaveAttribute('href', expect.stringContaining('x.com/messages/compose'))
    // Opens away from the site, so it must not hand over the opener.
    expect(dm).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('announces itself politely rather than stealing focus', () => {
    render(<Toast onClose={vi.fn()} />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(document.activeElement).toBe(document.body)
  })

  it('dismisses itself, but not before the links can be used', () => {
    const onClose = vi.fn()
    render(<Toast onClose={onClose} />)

    act(() => void vi.advanceTimersByTime(DISMISS_MS - 1))
    expect(onClose).not.toHaveBeenCalled()

    act(() => void vi.advanceTimersByTime(1))
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

describe('the egg variant', () => {
  it('says an egg was found, with no prize to claim', () => {
    render(<Toast variant="egg" onClose={vi.fn()} />)
    expect(screen.getByText(/You found an easter egg!/)).toBeInTheDocument()
    // The prize copy and its two links belong to the Pikachu win only.
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  /** Nothing to act on, so it behaves like an ordinary notification rather than
   *  sitting on the page for the full prize half-minute. */
  it('clears itself well before the prize toast would', () => {
    const onClose = vi.fn()
    render(<Toast variant="egg" onClose={onClose} />)

    act(() => void vi.advanceTimersByTime(9500))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('still announces itself politely', () => {
    render(<Toast variant="egg" onClose={vi.fn()} />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })
})

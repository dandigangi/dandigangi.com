import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import siteMetadata from '@/data/siteMetadata'
import Toast from './Toast'

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

  it('can be dismissed by hand', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const onClose = vi.fn()
    render(<Toast onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
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

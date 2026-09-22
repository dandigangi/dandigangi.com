import { beforeEach, describe, expect, it, vi } from 'vitest'
import { T } from '@/lib/ledger'

const load = async () => {
  vi.resetModules()
  return import('./stale')
}

beforeEach(() => localStorage.clear())

const DAY = 24 * 60 * 60 * 1000

describe('the fourteen-day window', () => {
  it('says nothing has expired when nothing was ever stored', async () => {
    const stale = await load()
    expect(stale.expireIfStale()).toBe(false)
  })

  it('leaves a recent hunt alone', async () => {
    const stale = await load()
    localStorage.setItem('dd:f4', String(Date.now() - 13 * DAY))
    localStorage.setItem('dd:f1', 'something')

    expect(stale.expireIfStale()).toBe(false)
    expect(localStorage.getItem('dd:f1')).toBe('something')
  })

  it('clears everything once it is past the window', async () => {
    const stale = await load()
    localStorage.setItem('dd:f4', String(Date.now() - 15 * DAY))
    for (const key of ['dd:f1', 'dd:f2', 'dd:f3', 'dd:pk3']) {
      localStorage.setItem(key, 'something')
    }

    expect(stale.expireIfStale()).toBe(true)
    for (const key of ['dd:f1', 'dd:f2', 'dd:f3', 'dd:pk3', 'dd:f4']) {
      expect(localStorage.getItem(key)).toBeNull()
    }
  })

  /** Measured from the last write, so anyone still playing never expires. */
  it('moves the deadline on every touch', async () => {
    const stale = await load()
    localStorage.setItem('dd:f4', String(Date.now() - 13 * DAY))

    stale.touch()
    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + 13 * DAY)
    expect(stale.expireIfStale()).toBe(false)
    vi.useRealTimers()
  })

  it('expires the tally end to end, not just the timestamp', async () => {
    const eggs = await import('./ledger')
    eggs.clearTokens()
    eggs.addToken(T.probe)
    expect(eggs.tokenCount()).toBe(1)

    // Wind the clock back on the last write, then reload as a returning visitor.
    localStorage.setItem('dd:f4', String(Date.now() - 20 * DAY))
    vi.resetModules()
    const fresh = await import('./ledger')
    expect(fresh.tokenCount()).toBe(0)
  })
})

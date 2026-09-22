import { beforeEach, describe, expect, it, vi } from 'vitest'

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
    localStorage.setItem('dd:e4', String(Date.now() - 13 * DAY))
    localStorage.setItem('dd:e1', 'something')

    expect(stale.expireIfStale()).toBe(false)
    expect(localStorage.getItem('dd:e1')).toBe('something')
  })

  it('clears everything once it is past the window', async () => {
    const stale = await load()
    localStorage.setItem('dd:e4', String(Date.now() - 15 * DAY))
    for (const key of ['dd:e1', 'dd:e2', 'dd:e3', 'dd:pk2']) {
      localStorage.setItem(key, 'something')
    }

    expect(stale.expireIfStale()).toBe(true)
    for (const key of ['dd:e1', 'dd:e2', 'dd:e3', 'dd:pk2', 'dd:e4']) {
      expect(localStorage.getItem(key)).toBeNull()
    }
  })

  /** Measured from the last write, so anyone still playing never expires. */
  it('moves the deadline on every touch', async () => {
    const stale = await load()
    localStorage.setItem('dd:e4', String(Date.now() - 13 * DAY))

    stale.touch()
    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + 13 * DAY)
    expect(stale.expireIfStale()).toBe(false)
    vi.useRealTimers()
  })

  it('expires the tally end to end, not just the timestamp', async () => {
    const eggs = await import('./eggs')
    eggs.resetEggs()
    eggs.findEgg('search')
    expect(eggs.foundEggs()).toBe(1)

    // Wind the clock back on the last write, then reload as a returning visitor.
    localStorage.setItem('dd:e4', String(Date.now() - 20 * DAY))
    vi.resetModules()
    const fresh = await import('./eggs')
    expect(fresh.foundEggs()).toBe(0)
  })
})

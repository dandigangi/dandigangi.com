import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

/** Module state outlives an import, so each case gets a fresh one — which is
 *  also how a reload is simulated below. */
const load = async () => {
  vi.resetModules()
  return import('./pikachu')
}

const ARM_MS = 5 * 60 * 1000

beforeEach(() => {
  vi.useFakeTimers()
  localStorage.clear()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('hero arming', () => {
  it('stays off over the tier until he is caught', async () => {
    const pk = await load()
    // Storage says they are well over, as a returning visitor's would.
    localStorage.setItem('dd:pk', btoa(JSON.stringify({ amount: 900, invoices: 4, wonAt: null })))
    expect(pk.getTab().amount).toBe(900)
    expect(pk.heroActive()).toBe(false)
  })

  it('comes on when a catch crosses the tier', async () => {
    const pk = await load()
    pk.raiseTab(600)
    expect(pk.heroActive()).toBe(true)
  })

  it('stays off when a catch lands under the tier', async () => {
    const pk = await load()
    pk.raiseTab(300)
    expect(pk.heroActive()).toBe(false)
  })

  it('lapses on its own and tells its subscribers', async () => {
    const pk = await load()
    const listener = vi.fn()
    pk.subscribe(listener)
    pk.raiseTab(600)
    listener.mockClear()

    vi.advanceTimersByTime(ARM_MS - 1)
    expect(pk.heroActive()).toBe(true)
    expect(listener).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(pk.heroActive()).toBe(false)
    // Pushed, not polled: without this the swap would linger on screen.
    expect(listener).toHaveBeenCalled()
  })

  it('re-arms on a later catch, tab intact', async () => {
    const pk = await load()
    pk.raiseTab(600)
    vi.advanceTimersByTime(ARM_MS)
    expect(pk.heroActive()).toBe(false)

    pk.raiseTab(pk.getTab().amount)
    expect(pk.heroActive()).toBe(true)
    expect(pk.getTab().amount).toBe(600)
  })

  it('is off again after a reload, and a catch brings it back', async () => {
    const first = await load()
    first.raiseTab(600)
    expect(first.heroActive()).toBe(true)

    const reloaded = await load()
    expect(reloaded.getTab().amount).toBe(600)
    expect(reloaded.heroActive()).toBe(false)

    reloaded.raiseTab(reloaded.getTab().amount)
    expect(reloaded.heroActive()).toBe(true)
  })

  it('goes off when a hug drops him back under the tier', async () => {
    const pk = await load()
    pk.raiseTab(520)
    expect(pk.heroActive()).toBe(true)
    pk.softenTab(50)
    expect(pk.heroActive()).toBe(false)
  })

  it('is not armed by the alter ego toggle', async () => {
    const pk = await load()
    pk.raiseTab(600)
    vi.advanceTimersByTime(ARM_MS)
    pk.setAlterEgo(true)
    expect(pk.heroActive()).toBe(false)
  })
})

describe('resetTab', () => {
  it('puts the tab back to the opening ask and clears storage', async () => {
    const pk = await load()
    pk.raiseTab(2600)
    expect(pk.getTab().wonAt).not.toBeNull()
    expect(pk.heroActive()).toBe(true)

    pk.resetTab()
    expect(pk.getTab()).toEqual({ amount: pk.OPENING, invoices: 0, wonAt: null })
    expect(pk.heroActive()).toBe(false)
    expect(localStorage.getItem('dd:pk')).toBeNull()
  })

  it('leaves the layer mounted so it can fade out', async () => {
    const pk = await load()
    pk.raiseTab(600)
    pk.resetTab()
    expect(pk.heroEverActive()).toBe(true)
  })
})

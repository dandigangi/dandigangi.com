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
    localStorage.setItem('dd:pk', btoa(JSON.stringify({ amount: 700, invoices: 4 })))
    expect(pk.getTab().amount).toBe(700)
    expect(pk.heroActive()).toBe(false)
  })

  it('comes on when a catch crosses the tier', async () => {
    const pk = await load()
    pk.raiseTab(700)
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
    pk.raiseTab(700)
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
    pk.raiseTab(700)
    vi.advanceTimersByTime(ARM_MS)
    expect(pk.heroActive()).toBe(false)

    pk.raiseTab(pk.getTab().amount)
    expect(pk.heroActive()).toBe(true)
    expect(pk.getTab().amount).toBe(700)
  })

  it('is off again after a reload, and a catch brings it back', async () => {
    const first = await load()
    first.raiseTab(700)
    expect(first.heroActive()).toBe(true)

    const reloaded = await load()
    expect(reloaded.getTab().amount).toBe(700)
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
    pk.raiseTab(700)
    vi.advanceTimersByTime(ARM_MS)
    pk.setAlterEgo(true)
    expect(pk.heroActive()).toBe(false)
  })
})

describe('resetTab', () => {
  it('puts the tab back to the opening ask and clears storage', async () => {
    const pk = await load()
    pk.raiseTab(2600)
    expect(pk.heroActive()).toBe(true)

    pk.resetTab()
    expect(pk.getTab()).toEqual({ amount: pk.OPENING, invoices: 0 })
    expect(pk.heroActive()).toBe(false)
    expect(localStorage.getItem('dd:pk')).toBeNull()
  })

  it('leaves the layer mounted so it can fade out', async () => {
    const pk = await load()
    pk.raiseTab(700)
    pk.resetTab()
    expect(pk.heroEverActive()).toBe(true)
  })
})

describe('the blog-search egg', () => {
  it('puts the hero up without touching the tab', async () => {
    const pk = await load()
    pk.setSearchEgg(true)
    expect(pk.heroActive()).toBe(true)
    // It is a wink, not a catch: nothing is owed and nothing is counted.
    expect(pk.getTab().amount).toBe(pk.OPENING)
    expect(pk.getTab().invoices).toBe(0)
    expect(pk.hasCaught()).toBe(false)
  })

  it('takes the hero back down when the text is cleared', async () => {
    const pk = await load()
    pk.setSearchEgg(true)
    pk.setSearchEgg(false)
    expect(pk.heroActive()).toBe(false)
  })

  it('does not survive a reload, because nothing is persisted', async () => {
    const first = await load()
    first.setSearchEgg(true)
    const second = await load()
    expect(second.heroActive()).toBe(false)
  })

  it('leaves an armed tab still driving the hero once it clears', async () => {
    const pk = await load()
    pk.raiseTab(700)
    pk.setSearchEgg(true)
    pk.setSearchEgg(false)
    // The catch is what is holding it up now, not the search.
    expect(pk.heroActive()).toBe(true)
  })

  it('notifies subscribers, or the hero would never repaint', async () => {
    const pk = await load()
    const listener = vi.fn()
    pk.subscribe(listener)
    pk.setSearchEgg(true)
    expect(listener).toHaveBeenCalled()
  })
})

describe('resetAll', () => {
  it('puts everything back to a cold start', async () => {
    const pk = await load()
    pk.markCaught()
    pk.raiseTab(3000)
    pk.setAlterEgo(true)
    pk.setSearchEgg(true)

    pk.resetAll()

    expect(pk.getTab()).toEqual({ amount: pk.OPENING, invoices: 0 })
    expect(pk.hasCaught()).toBe(false)
    expect(pk.isAlterEgo()).toBe(false)
    expect(pk.isSearchEgg()).toBe(false)
    expect(pk.heroActive()).toBe(false)
    expect(pk.heroEverActive()).toBe(false)
  })

  /** resetTab deliberately leaves `caught` standing; this is the difference. */
  it('forgets having met him, which resetTab does not', async () => {
    const pk = await load()
    pk.markCaught()
    pk.resetTab()
    expect(pk.hasCaught()).toBe(true)

    pk.resetAll()
    expect(pk.hasCaught()).toBe(false)
  })

  it('clears storage, so a reload starts the chase over', async () => {
    const first = await load()
    first.raiseTab(700)
    expect(localStorage.getItem('dd:pk')).not.toBeNull()

    first.resetAll()
    expect(localStorage.getItem('dd:pk')).toBeNull()

    const second = await load()
    expect(second.getTab().amount).toBe(second.OPENING)
  })
})

describe('the tab past the old finish line', () => {
  /** It used to stop here and hand over a prize; now it just keeps going. */
  it('keeps climbing past FINAL_TIER', async () => {
    const pk = await load()
    pk.raiseTab(pk.FINAL_TIER + 500)
    expect(pk.getTab().amount).toBe(pk.FINAL_TIER + 500)

    pk.raiseTab(pk.FINAL_TIER + 900)
    expect(pk.getTab().amount).toBe(pk.FINAL_TIER + 900)
  })

  it('drops a wonAt left over from the old stored shape', async () => {
    localStorage.setItem(
      'dd:pk',
      btoa(JSON.stringify({ amount: 3000, invoices: 9, wonAt: Date.now() }))
    )
    const pk = await load()
    expect(pk.getTab()).toEqual({ amount: 3000, invoices: 9 })
  })

  /** Angry first, hero second — the two figures are deliberately not the same. */
  it('turns him angry before it repaints the hero', async () => {
    const pk = await load()
    expect(pk.OVER_TIER).toBeLessThan(pk.FINAL_TIER)

    // Over the red line, but not yet worth repainting every hero on the site.
    pk.raiseTab(pk.OVER_TIER)
    expect(pk.heroActive()).toBe(false)

    pk.raiseTab(pk.FINAL_TIER)
    expect(pk.heroActive()).toBe(true)
  })

  /** Each figure earns one, and there is nothing between them any more. */
  it('has an egg for every money tier and no orphans', async () => {
    const pk = await load()
    const eggs = await import('./eggs')
    for (const tier of pk.MONEY_TIERS) {
      expect(eggs.EGGS).toContain(tier.egg)
    }
    expect(pk.MONEY_TIERS.map((tier) => tier.at)).toEqual([pk.OVER_TIER, pk.FINAL_TIER])
  })
})

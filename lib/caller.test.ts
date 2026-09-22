import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

/** Module state outlives an import, so each case gets a fresh one — which is
 *  also how a reload is simulated below. */
const load = async () => {
  vi.resetModules()
  return import('./caller')
}

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
    localStorage.setItem('dd:pk3', btoa(JSON.stringify({ amount: 700, invoices: 4 })))
    expect(pk.getTab().amount).toBe(700)
    expect(pk.layerActive()).toBe(false)
  })

  it('comes on when a catch crosses the tier', async () => {
    const pk = await load()
    pk.raiseTab(700)
    expect(pk.layerActive()).toBe(true)
  })

  it('stays off when a catch lands under the tier', async () => {
    const pk = await load()
    pk.raiseTab(300)
    expect(pk.layerActive()).toBe(false)
  })

  /**
   * The swap is scoped to the page it happened on. Caller calls this on every
   * route change; it used to be a five-minute timer, which browsed the site
   * with you for several pages after the moment that earned it.
   */
  it('ends on the next page, and tells its subscribers', async () => {
    const pk = await load()
    const listener = vi.fn()
    pk.subscribe(listener)
    pk.raiseTab(700)
    listener.mockClear()

    pk.lapseLayer()
    expect(pk.layerActive()).toBe(false)
    // Pushed, not polled: without this the swap would linger on screen.
    expect(listener).toHaveBeenCalled()
  })

  it('says nothing on a route change that had no swap up', async () => {
    const pk = await load()
    const listener = vi.fn()
    pk.subscribe(listener)
    pk.lapseLayer()
    expect(listener).not.toHaveBeenCalled()
  })

  it('comes back on a later catch, tab intact', async () => {
    const pk = await load()
    pk.raiseTab(700)
    pk.lapseLayer()
    expect(pk.layerActive()).toBe(false)

    pk.raiseTab(pk.getTab().amount)
    expect(pk.layerActive()).toBe(true)
    expect(pk.getTab().amount).toBe(700)
  })

  it('is off again after a reload, and a catch brings it back', async () => {
    const first = await load()
    first.raiseTab(700)
    expect(first.layerActive()).toBe(true)

    const reloaded = await load()
    expect(reloaded.getTab().amount).toBe(700)
    expect(reloaded.layerActive()).toBe(false)

    reloaded.raiseTab(reloaded.getTab().amount)
    expect(reloaded.layerActive()).toBe(true)
  })

  it('goes off when a hug drops him back under the tier', async () => {
    const pk = await load()
    pk.raiseTab(520)
    expect(pk.layerActive()).toBe(true)
    pk.softenTab(50)
    expect(pk.layerActive()).toBe(false)
  })

  it('is not armed by the alter ego toggle', async () => {
    const pk = await load()
    pk.raiseTab(700)
    pk.lapseLayer()
    pk.setAlt(true)
    expect(pk.layerActive()).toBe(false)
  })
})

describe('resetTab', () => {
  it('puts the tab back to the opening ask and clears storage', async () => {
    const pk = await load()
    pk.raiseTab(2600)
    expect(pk.layerActive()).toBe(true)

    pk.resetTab()
    expect(pk.getTab()).toEqual({ amount: pk.OPENING, invoices: 0 })
    expect(pk.layerActive()).toBe(false)
    expect(localStorage.getItem('dd:pk3')).toBeNull()
  })

  it('leaves the layer mounted so it can fade out', async () => {
    const pk = await load()
    pk.raiseTab(700)
    pk.resetTab()
    expect(pk.layerEverActive()).toBe(true)
  })
})

describe('the blog-search egg', () => {
  it('puts the hero up without touching the tab', async () => {
    const pk = await load()
    pk.setHinted(true)
    expect(pk.layerActive()).toBe(true)
    // It is a wink, not a catch: nothing is owed and nothing is counted.
    expect(pk.getTab().amount).toBe(pk.OPENING)
    expect(pk.getTab().invoices).toBe(0)
    expect(pk.hasMet()).toBe(false)
  })

  it('takes the hero back down when the text is cleared', async () => {
    const pk = await load()
    pk.setHinted(true)
    pk.setHinted(false)
    expect(pk.layerActive()).toBe(false)
  })

  it('does not survive a reload, because nothing is persisted', async () => {
    const first = await load()
    first.setHinted(true)
    const second = await load()
    expect(second.layerActive()).toBe(false)
  })

  it('leaves an armed tab still driving the hero once it clears', async () => {
    const pk = await load()
    pk.raiseTab(700)
    pk.setHinted(true)
    pk.setHinted(false)
    // The catch is what is holding it up now, not the search.
    expect(pk.layerActive()).toBe(true)
  })

  it('notifies subscribers, or the hero would never repaint', async () => {
    const pk = await load()
    const listener = vi.fn()
    pk.subscribe(listener)
    pk.setHinted(true)
    expect(listener).toHaveBeenCalled()
  })
})

describe('resetAll', () => {
  it('puts everything back to a cold start', async () => {
    const pk = await load()
    pk.markMet()
    pk.raiseTab(3000)
    pk.setAlt(true)
    pk.setHinted(true)

    pk.resetAll()

    expect(pk.getTab()).toEqual({ amount: pk.OPENING, invoices: 0 })
    expect(pk.hasMet()).toBe(false)
    expect(pk.isAlt()).toBe(false)
    expect(pk.isHinted()).toBe(false)
    expect(pk.layerActive()).toBe(false)
    expect(pk.layerEverActive()).toBe(false)
  })

  /** resetTab deliberately leaves `caught` standing; this is the difference. */
  it('forgets having met him, which resetTab does not', async () => {
    const pk = await load()
    pk.markMet()
    pk.resetTab()
    expect(pk.hasMet()).toBe(true)

    pk.resetAll()
    expect(pk.hasMet()).toBe(false)
  })

  it('clears storage, so a reload starts the chase over', async () => {
    const first = await load()
    first.raiseTab(700)
    expect(localStorage.getItem('dd:pk3')).not.toBeNull()

    first.resetAll()
    expect(localStorage.getItem('dd:pk3')).toBeNull()

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
      'dd:pk3',
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
    expect(pk.layerActive()).toBe(false)

    pk.raiseTab(pk.FINAL_TIER)
    expect(pk.layerActive()).toBe(true)
  })

  /** Each figure earns one, and there is nothing between them any more. */
  it('has an egg for every money tier and no orphans', async () => {
    const pk = await load()
    const eggs = await import('./ledger')
    for (const tier of pk.MONEY_TIERS) {
      expect(eggs.TOKENS).toContain(tier.egg)
    }
    expect(pk.MONEY_TIERS.map((tier) => tier.at)).toEqual([pk.OVER_TIER, pk.FINAL_TIER])
  })
})

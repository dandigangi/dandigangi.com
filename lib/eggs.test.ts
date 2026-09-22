import { beforeEach, describe, expect, it, vi } from 'vitest'

/** Module state outlives an import, so each case gets a fresh one. */
const load = async () => {
  vi.resetModules()
  return import('./eggs')
}

beforeEach(() => localStorage.clear())

describe('the egg tally', () => {
  it('starts at nothing found', async () => {
    const eggs = await load()
    expect(eggs.foundEggs()).toBe(0)
  })

  it('counts each egg once, however many times it fires', async () => {
    const eggs = await load()
    eggs.findEgg('search')
    eggs.findEgg('search')
    eggs.findEgg('search')
    expect(eggs.foundEggs()).toBe(1)
  })

  it('counts the eggs separately', async () => {
    const eggs = await load()
    eggs.findEgg('search')
    eggs.findEgg('admin')
    expect(eggs.foundEggs()).toBe(2)
  })

  it('survives a reload', async () => {
    const first = await load()
    first.findEgg('pikachu')

    const second = await load()
    expect(second.foundEggs()).toBe(1)
  })

  /**
   * The denominator comes from the same array, so a name left in storage by an
   * egg that has since been removed would push the count past the total.
   */
  it('ignores a stored name that is no longer an egg', async () => {
    localStorage.setItem('dd:e1', JSON.stringify(['search', 'retired-egg']))
    const eggs = await load()
    expect(eggs.foundEggs()).toBe(1)
  })

  it('shrugs off a corrupt value rather than throwing', async () => {
    localStorage.setItem('dd:e1', 'not json')
    const eggs = await load()
    expect(eggs.foundEggs()).toBe(0)
  })

  it('never reports more found than exist', async () => {
    const eggs = await load()
    for (const egg of eggs.EGGS) eggs.findEgg(egg)
    expect(eggs.foundEggs()).toBe(eggs.totalEggs())
  })

  it('notifies subscribers, but only when something changed', async () => {
    const eggs = await load()
    const listener = vi.fn()
    eggs.subscribe(listener)

    eggs.findEgg('search')
    expect(listener).toHaveBeenCalledTimes(1)

    eggs.findEgg('search')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('resets, in memory and in storage', async () => {
    const first = await load()
    first.findEgg('search')
    first.findEgg('admin')
    first.resetEggs()

    expect(first.foundEggs()).toBe(0)
    expect(localStorage.getItem('dd:e1')).toBeNull()

    const second = await load()
    expect(second.foundEggs()).toBe(0)
  })
})

describe('the prize', () => {
  it('is not due until every egg is found', async () => {
    const eggs = await load()
    for (const egg of eggs.EGGS.slice(0, -1)) eggs.findEgg(egg)
    expect(eggs.allFound()).toBe(false)

    eggs.findEgg(eggs.EGGS[eggs.EGGS.length - 1])
    expect(eggs.allFound()).toBe(true)
    expect(eggs.hasClaimed()).toBe(false)
  })

  /**
   * The set stays complete once complete, so completeness alone cannot gate the
   * modal — without the claim it would reopen on every single load afterwards.
   */
  it('stays collected across a reload', async () => {
    const first = await load()
    for (const egg of first.EGGS) first.findEgg(egg)
    first.claimPrize()
    expect(first.hasClaimed()).toBe(true)

    const second = await load()
    expect(second.allFound()).toBe(true)
    expect(second.hasClaimed()).toBe(true)
  })

  it('is due again after a reset', async () => {
    const eggs = await load()
    for (const egg of eggs.EGGS) eggs.findEgg(egg)
    eggs.claimPrize()

    eggs.resetEggs()
    expect(eggs.allFound()).toBe(false)
    expect(eggs.hasClaimed()).toBe(false)
  })

  it('notifies subscribers when collected, so the modal can close itself', async () => {
    const eggs = await load()
    const listener = vi.fn()
    eggs.subscribe(listener)
    eggs.claimPrize()
    expect(listener).toHaveBeenCalled()
  })
})

describe('when each was found', () => {
  it('stamps a find and keeps the stamp across a reload', async () => {
    const first = await load()
    first.findEgg('search')
    const at = first.foundList()[0].at
    expect(at).toBeGreaterThan(0)

    const second = await load()
    expect(second.foundList()[0]).toEqual({ egg: 'search', at })
  })

  /**
   * The first version stored bare ids. Those are kept with an unknown time
   * rather than dropped — losing someone's finds to a format change would be
   * the worse trade.
   */
  it('keeps finds written in the older id-only shape', async () => {
    localStorage.setItem('dd:e1', JSON.stringify(['search', 'admin']))
    const eggs = await load()
    expect(eggs.foundEggs()).toBe(2)
    expect(eggs.foundList().every((entry) => entry.at === 0)).toBe(true)
  })

  it('lists them in the order they were found', async () => {
    const eggs = await load()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-22T03:00:00Z'))
    eggs.findEgg('admin')
    vi.setSystemTime(new Date('2026-09-22T04:00:00Z'))
    eggs.findEgg('search')
    vi.useRealTimers()

    expect(eggs.foundList().map((entry) => entry.egg)).toEqual(['admin', 'search'])
  })
})

describe('a visitor who played the old version', () => {
  /**
   * There is no server-side state to clear and no way to reach into someone's
   * browser — the only lever is which key the code reads. Pointing it at a new
   * one is the migration: nobody has that key yet, so everybody starts at zero.
   */
  it('starts from nothing, whatever the old key held', async () => {
    localStorage.setItem(
      'dd:x1',
      JSON.stringify([
        ['search', 1],
        ['admin', 2],
      ])
    )
    localStorage.setItem('dd:x2', '1')

    const eggs = await load()
    expect(eggs.foundEggs()).toBe(0)
    expect(eggs.hasClaimed()).toBe(false)
  })

  it('clears the old keys rather than leaving them behind', async () => {
    localStorage.setItem('dd:x1', JSON.stringify([['search', 1]]))
    localStorage.setItem('dd:x2', '1')

    const eggs = await load()
    eggs.foundEggs() // first read is what triggers the cleanup

    expect(localStorage.getItem('dd:x1')).toBeNull()
    expect(localStorage.getItem('dd:x2')).toBeNull()
  })
})

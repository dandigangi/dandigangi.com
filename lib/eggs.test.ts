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
    localStorage.setItem('dd:eggs', JSON.stringify(['search', 'retired-egg']))
    const eggs = await load()
    expect(eggs.foundEggs()).toBe(1)
  })

  it('shrugs off a corrupt value rather than throwing', async () => {
    localStorage.setItem('dd:eggs', 'not json')
    const eggs = await load()
    expect(eggs.foundEggs()).toBe(0)
  })

  it('never reports more found than exist', async () => {
    const eggs = await load()
    for (const egg of eggs.EGGS) eggs.findEgg(egg)
    expect(eggs.foundEggs()).toBe(eggs.TOTAL_EGGS)
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
    expect(localStorage.getItem('dd:eggs')).toBeNull()

    const second = await load()
    expect(second.foundEggs()).toBe(0)
  })
})

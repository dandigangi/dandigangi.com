import { beforeEach, describe, expect, it, vi } from 'vitest'
import { T } from '@/lib/ledger'

/** Module state outlives an import, so each case gets a fresh one. */
const load = async () => {
  vi.resetModules()
  return import('./ledger')
}

beforeEach(() => localStorage.clear())

describe('the egg tally', () => {
  it('starts at nothing found', async () => {
    const eggs = await load()
    expect(eggs.tokenCount()).toBe(0)
  })

  it('counts each egg once, however many times it fires', async () => {
    const eggs = await load()
    eggs.addToken(T.probe)
    eggs.addToken(T.probe)
    eggs.addToken(T.probe)
    expect(eggs.tokenCount()).toBe(1)
  })

  it('counts the eggs separately', async () => {
    const eggs = await load()
    eggs.addToken(T.probe)
    eggs.addToken(T.gate)
    expect(eggs.tokenCount()).toBe(2)
  })

  it('survives a reload', async () => {
    const first = await load()
    first.addToken(T.met)

    const second = await load()
    expect(second.tokenCount()).toBe(1)
  })

  /**
   * The denominator comes from the same array, so a name left in storage by an
   * egg that has since been removed would push the count past the total.
   */
  it('ignores a stored name that is no longer an egg', async () => {
    localStorage.setItem('dd:e1', JSON.stringify([T.probe, 'retired-egg']))
    const eggs = await load()
    expect(eggs.tokenCount()).toBe(1)
  })

  it('shrugs off a corrupt value rather than throwing', async () => {
    localStorage.setItem('dd:e1', 'not json')
    const eggs = await load()
    expect(eggs.tokenCount()).toBe(0)
  })

  it('never reports more found than exist', async () => {
    const eggs = await load()
    for (const egg of eggs.TOKENS) eggs.addToken(egg)
    expect(eggs.tokenCount()).toBe(eggs.tokenTotal())
  })

  it('notifies subscribers, but only when something changed', async () => {
    const eggs = await load()
    const listener = vi.fn()
    eggs.subscribe(listener)

    eggs.addToken(T.probe)
    expect(listener).toHaveBeenCalledTimes(1)

    eggs.addToken(T.probe)
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('resets, in memory and in storage', async () => {
    const first = await load()
    first.addToken(T.probe)
    first.addToken(T.gate)
    first.clearTokens()

    expect(first.tokenCount()).toBe(0)
    expect(localStorage.getItem('dd:e1')).toBeNull()

    const second = await load()
    expect(second.tokenCount()).toBe(0)
  })
})

describe('the prize', () => {
  it('is not due until every egg is found', async () => {
    const eggs = await load()
    for (const egg of eggs.TOKENS.slice(0, -1)) eggs.addToken(egg)
    expect(eggs.allTokens()).toBe(false)

    eggs.addToken(eggs.TOKENS[eggs.TOKENS.length - 1])
    expect(eggs.allTokens()).toBe(true)
    expect(eggs.offerSettled()).toBe(false)
  })

  /**
   * The set stays complete once complete, so completeness alone cannot gate the
   * modal — without the claim it would reopen on every single load afterwards.
   */
  it('stays collected across a reload', async () => {
    const first = await load()
    for (const egg of first.TOKENS) first.addToken(egg)
    first.settleOffer()
    expect(first.offerSettled()).toBe(true)

    const second = await load()
    expect(second.allTokens()).toBe(true)
    expect(second.offerSettled()).toBe(true)
  })

  it('is due again after a reset', async () => {
    const eggs = await load()
    for (const egg of eggs.TOKENS) eggs.addToken(egg)
    eggs.settleOffer()

    eggs.clearTokens()
    expect(eggs.allTokens()).toBe(false)
    expect(eggs.offerSettled()).toBe(false)
  })

  it('notifies subscribers when collected, so the modal can close itself', async () => {
    const eggs = await load()
    const listener = vi.fn()
    eggs.subscribe(listener)
    eggs.settleOffer()
    expect(listener).toHaveBeenCalled()
  })
})

describe('when each was found', () => {
  it('stamps a find and keeps the stamp across a reload', async () => {
    const first = await load()
    first.addToken(T.probe)
    const at = first.tokenList()[0].at
    expect(at).toBeGreaterThan(0)

    const second = await load()
    expect(second.tokenList()[0]).toEqual({ egg: T.probe, at })
  })

  /**
   * The first version stored bare ids. Those are kept with an unknown time
   * rather than dropped — losing someone's finds to a format change would be
   * the worse trade.
   */
  it('keeps finds written in the older id-only shape', async () => {
    localStorage.setItem('dd:e1', JSON.stringify([T.probe, T.gate]))
    const eggs = await load()
    expect(eggs.tokenCount()).toBe(2)
    expect(eggs.tokenList().every((entry) => entry.at === 0)).toBe(true)
  })

  it('lists them in the order they were found', async () => {
    const eggs = await load()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-22T03:00:00Z'))
    eggs.addToken(T.gate)
    vi.setSystemTime(new Date('2026-09-22T04:00:00Z'))
    eggs.addToken(T.probe)
    vi.useRealTimers()

    expect(eggs.tokenList().map((entry) => entry.egg)).toEqual([T.gate, T.probe])
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
        [T.probe, 1],
        [T.gate, 2],
      ])
    )
    localStorage.setItem('dd:x2', '1')

    const eggs = await load()
    expect(eggs.tokenCount()).toBe(0)
    expect(eggs.offerSettled()).toBe(false)
  })

  it('clears the old keys rather than leaving them behind', async () => {
    localStorage.setItem('dd:x1', JSON.stringify([[T.probe, 1]]))
    localStorage.setItem('dd:x2', '1')

    const eggs = await load()
    eggs.tokenCount() // first read is what triggers the cleanup

    expect(localStorage.getItem('dd:x1')).toBeNull()
    expect(localStorage.getItem('dd:x2')).toBeNull()
  })
})

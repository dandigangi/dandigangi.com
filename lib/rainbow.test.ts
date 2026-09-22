import { beforeEach, describe, expect, it, vi } from 'vitest'

/** Module state outlives an import, so each case gets a fresh one. */
const load = async () => {
  vi.resetModules()
  return import('./rainbow')
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-rainbow')
})

const type = (rb: Awaited<ReturnType<typeof load>>, phrase: string) =>
  [...phrase].map((character) => rb.press(character)).some(Boolean)

describe('the phrases', () => {
  it.each(['rainbowroad', 'rainbow road', 'mario64', 'rainbowtime', 'rainbow time'])(
    'opens on %s',
    async (phrase) => {
      const rb = await load()
      expect(type(rb, phrase)).toBe(true)
    }
  )

  it('ignores case', async () => {
    const rb = await load()
    expect(type(rb, 'RaInBoW RoAd')).toBe(true)
  })

  /** Typing normally must not set it off. */
  it('stays shut on ordinary words', async () => {
    const rb = await load()
    expect(type(rb, 'a rainbow is a road of light')).toBe(false)
  })

  it('opens even with typing before it, since the buffer rolls', async () => {
    const rb = await load()
    expect(type(rb, 'hello theremario64')).toBe(true)
  })

  it('ignores keys that are not single characters', async () => {
    const rb = await load()
    'mario6'.split('').forEach((character) => rb.press(character))
    expect(rb.press('Shift')).toBe(false)
    expect(rb.press('4')).toBe(true)
  })

  /** Or holding the last key down would toggle it over and over. */
  it('clears the buffer on a hit', async () => {
    const rb = await load()
    expect(type(rb, 'mario64')).toBe(true)
    expect(rb.press('4')).toBe(false)
  })
})

describe('the mode', () => {
  it('starts off', async () => {
    const rb = await load()
    expect(rb.isRainbow()).toBe(false)
  })

  it('paints the flag onto the document and takes it off again', async () => {
    const rb = await load()

    rb.setRainbow(true)
    expect(document.documentElement.hasAttribute('data-rainbow')).toBe(true)

    rb.setRainbow(false)
    expect(document.documentElement.hasAttribute('data-rainbow')).toBe(false)
  })

  it('survives a reload, and restores the flag', async () => {
    const first = await load()
    first.setRainbow(true)

    document.documentElement.removeAttribute('data-rainbow')
    const second = await load()
    expect(second.isRainbow()).toBe(true)

    second.restoreRainbow()
    expect(document.documentElement.hasAttribute('data-rainbow')).toBe(true)
  })

  it('notifies subscribers, but only on a real change', async () => {
    const rb = await load()
    const listener = vi.fn()
    rb.subscribe(listener)

    rb.setRainbow(true)
    expect(listener).toHaveBeenCalledTimes(1)

    rb.setRainbow(true)
    expect(listener).toHaveBeenCalledTimes(1)
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LIT_PASS, LIT_PASS_MS, grantPikaPass } from './pass'

/**
 * document.cookie in jsdom actually stores, but it will not report Max-Age or
 * Path back — so the assertions read the string that was written rather than
 * the cookie jar.
 */
let written: string[] = []

beforeEach(() => {
  written = []
  vi.spyOn(document, 'cookie', 'set').mockImplementation((value: string) => {
    written.push(value)
  })
})

afterEach(() => vi.restoreAllMocks())

describe('grantPikaPass', () => {
  it('expires after an hour, which is the whole point', () => {
    grantPikaPass()
    expect(LIT_PASS_MS).toBe(60 * 60 * 1000)
    expect(written[0]).toContain(`Max-Age=${LIT_PASS_MS / 1000}`)
  })

  it('is scoped to /admin so it never rides along with the rest of the site', () => {
    grantPikaPass()
    expect(written[0]).toContain('Path=/admin')
    expect(written[0]).toContain('SameSite=Lax')
  })

  it('carries no payload beyond existing', () => {
    grantPikaPass()
    expect(written[0]).toMatch(new RegExp(`^${LIT_PASS}=1;`))
  })

  it('omits Secure on http so it still works on localhost', () => {
    grantPikaPass()
    expect(written[0]).not.toContain('Secure')
  })

  it('sets Secure over https', () => {
    const original = window.location
    Object.defineProperty(window, 'location', {
      value: { ...original, protocol: 'https:' },
      writable: true,
      configurable: true,
    })

    grantPikaPass()
    expect(written[0]).toContain('; Secure')

    Object.defineProperty(window, 'location', { value: original, configurable: true })
  })

  it('survives storage being blocked entirely', () => {
    vi.spyOn(document, 'cookie', 'set').mockImplementation(() => {
      throw new Error('blocked')
    })
    // The redirect still carries ?pika=1, so the reveal happens either way.
    expect(() => grantPikaPass()).not.toThrow()
  })
})

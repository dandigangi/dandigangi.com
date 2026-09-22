import { describe, expect, it } from 'vitest'
import { menuHue, rowHue, rowHueLight } from './ramp'

/**
 * The design specifies six stops. The generator has to reproduce those exactly
 * at six rows — otherwise adding a seventh project silently restyles the other
 * six — and stay on the same red→violet path at any other count.
 */
const DESIGNED = ['#FF6B5A', '#FFA23A', '#F2D14B', '#8BE04A', '#3ED8E0', '#B07BFF']

describe('rowHue', () => {
  it('reproduces the designed six stops exactly at six rows', () => {
    expect(DESIGNED.map((_, i) => rowHue(i, 6))).toEqual(DESIGNED)
  })

  it('still spans red to violet at a different row count', () => {
    for (const count of [3, 5, 9, 14]) {
      expect(rowHue(0, count)).toBe('#FF6B5A')
      expect(rowHue(count - 1, count)).toBe('#B07BFF')
    }
  })

  it('returns a valid hex for every row at every plausible count', () => {
    for (let count = 1; count <= 20; count += 1) {
      for (let i = 0; i < count; i += 1) {
        expect(rowHue(i, count)).toMatch(/^#[0-9A-F]{6}$/)
      }
    }
  })

  it('does not repeat a colour within a single ramp', () => {
    const hues = Array.from({ length: 10 }, (_, i) => rowHue(i, 10))
    expect(new Set(hues).size).toBe(10)
  })

  it('degrades to the first stop rather than dividing by zero on a single row', () => {
    expect(rowHue(0, 1)).toBe('#FF6B5A')
  })
})

describe('rowHueLight', () => {
  it('is a different ramp from the dark one', () => {
    expect(rowHueLight(0, 6)).not.toBe(rowHue(0, 6))
  })

  it('reproduces its own stops exactly at six rows', () => {
    expect(rowHueLight(2, 6)).toBe('#6F5200')
    expect(rowHueLight(5, 6)).toBe('#6D3FD4')
  })
})

describe('menuHue', () => {
  /** The sheet starts at orange, not red — red read as an error state. */
  it('skips the red end', () => {
    expect(menuHue(0, 5)).toBe('#FFA23A')
    expect(menuHue(4, 5)).toBe('#B07BFF')
  })
})

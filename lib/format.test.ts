import { describe, expect, it } from 'vitest'
import { formatFullDate, formatMonthYear, formatTag } from './format'

/**
 * These all pin timeZone: 'UTC'. Without it a post dated the 1st renders as the
 * previous month for anyone west of Greenwich, which is most of the readership
 * — so the timezone cases below are the reason this file exists.
 */
describe('formatMonthYear', () => {
  it('uppercases the short form', () => {
    expect(formatMonthYear('2026-03-14')).toBe('MAR 2026')
  })

  it('does not slip a month in a negative-offset timezone', () => {
    expect(formatMonthYear('2026-03-01')).toBe('MAR 2026')
  })

  it('does not slip a year on new year', () => {
    expect(formatMonthYear('2026-01-01')).toBe('JAN 2026')
  })
})

describe('formatFullDate', () => {
  it('renders the blog index form', () => {
    expect(formatFullDate('2026-03-14')).toBe('Mar 14, 2026')
  })

  it('keeps the first of the month on the first', () => {
    expect(formatFullDate('2026-03-01')).toBe('Mar 1, 2026')
  })
})

describe('formatTag', () => {
  it('title-cases every word, not just the first', () => {
    expect(formatTag('engineering-management')).toBe('Engineering Management')
  })

  it('leaves a single word alone but capitalised', () => {
    expect(formatTag('leadership')).toBe('Leadership')
  })

  it('uppercases an initialism rather than title-casing it', () => {
    expect(formatTag('ai')).toBe('AI')
  })

  it('only matches an initialism as a whole word', () => {
    expect(formatTag('said-and-done')).toBe('Said And Done')
  })

  it('handles an empty tag without throwing', () => {
    expect(formatTag('')).toBe('')
  })
})

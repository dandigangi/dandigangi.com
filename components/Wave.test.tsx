import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Wave from './Wave'
import { setTrail } from '@/lib/trail'

beforeEach(() => {
  localStorage.clear()
  setTrail(false)
  vi.useFakeTimers()
})

afterEach(() => vi.useRealTimers())

const sprite = (container: HTMLElement) => container.querySelector('img')

describe('Wave', () => {
  it('shows on the way in for three loops, then goes', () => {
    const { container } = render(<Wave />)
    expect(sprite(container)).toBeNull()

    act(() => setTrail(true))
    expect(sprite(container)).not.toBeNull()

    act(() => vi.advanceTimersByTime(1019))
    expect(sprite(container)).not.toBeNull()
    act(() => vi.advanceTimersByTime(1))
    expect(sprite(container)).toBeNull()
  })

  it('stays away on the way out', () => {
    setTrail(true)
    const { container } = render(<Wave />)
    act(() => setTrail(false))
    expect(sprite(container)).toBeNull()
  })
})

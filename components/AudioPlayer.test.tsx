import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AudioPlayer, { formatTime } from './AudioPlayer'

describe('formatTime', () => {
  it('drops the hour when there is none', () => {
    expect(formatTime(65)).toBe('1:05')
  })

  it('pads minutes once an hour is shown', () => {
    expect(formatTime(3829.9)).toBe('1:03:49')
  })

  it('reads an unknown duration as zero rather than NaN', () => {
    expect(formatTime(NaN)).toBe('0:00')
  })
})

describe('AudioPlayer', () => {
  it('renders artwork only when given an image', () => {
    const { rerender } = render(<AudioPlayer src="/a.mp3" title="Ep" />)
    expect(screen.queryByRole('img')).toBeNull()

    rerender(<AudioPlayer src="/a.mp3" title="Ep" image="/static/images/x.jpg" imageAlt="Cover" />)
    expect(screen.getByRole('img', { name: 'Cover' })).toBeInTheDocument()
  })

  it('does not download the file up front', () => {
    const { container } = render(<AudioPlayer src="/a.mp3" />)
    expect(container.querySelector('audio')).toHaveAttribute('preload', 'metadata')
  })
})

describe('AudioPlayer hydration', () => {
  it('picks up a duration the element already loaded before mount', () => {
    const ready = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'readyState')
    const dur = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'duration')
    Object.defineProperty(HTMLMediaElement.prototype, 'readyState', {
      configurable: true,
      get: () => 1,
    })
    Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
      configurable: true,
      get: () => 3567,
    })

    render(<AudioPlayer src="/a.mp3" />)
    expect(screen.getByRole('slider', { name: 'Seek' })).toHaveAttribute('max', '3567')

    if (ready) Object.defineProperty(HTMLMediaElement.prototype, 'readyState', ready)
    if (dur) Object.defineProperty(HTMLMediaElement.prototype, 'duration', dur)
  })
})

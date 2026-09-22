import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import RainbowRoad, { RainbowOffLink } from './RainbowRoad'
import { isRainbow, setRainbow } from '@/lib/rainbow'
import { resetEggs, foundEggs } from '@/lib/eggs'

beforeEach(() => {
  localStorage.clear()
  resetEggs()
  setRainbow(false)
  document.documentElement.removeAttribute('data-rainbow')
})

const flag = () => document.documentElement.hasAttribute('data-rainbow')

describe('RainbowRoad', () => {
  it('opens on the phrase and flags the document', async () => {
    const user = userEvent.setup()
    render(<RainbowRoad />)
    expect(flag()).toBe(false)

    await user.keyboard('mario64')
    expect(isRainbow()).toBe(true)
    expect(flag()).toBe(true)
  })

  /** Retyping it is the way out for anyone who found it that way. */
  it('closes again on a second phrase', async () => {
    const user = userEvent.setup()
    render(<RainbowRoad />)

    await user.keyboard('mario64')
    expect(isRainbow()).toBe(true)

    await user.keyboard('rainbowroad')
    expect(isRainbow()).toBe(false)
    expect(flag()).toBe(false)
  })

  it('counts as a find, and announces it', async () => {
    const user = userEvent.setup()
    render(<RainbowRoad />)
    await user.keyboard('rainbow time')

    expect(foundEggs()).toBe(1)
    expect(await screen.findByText(/easter egg/)).toBeInTheDocument()
  })

  it('stays shut on ordinary typing', async () => {
    const user = userEvent.setup()
    render(<RainbowRoad />)
    await user.keyboard('writing about a rainbow over a road')
    expect(isRainbow()).toBe(false)
  })

  /** The post editor: typing the word while writing must not repaint the site. */
  it('ignores a textarea', async () => {
    const user = userEvent.setup()
    render(
      <>
        <RainbowRoad />
        <textarea aria-label="body" />
      </>
    )

    await user.click(screen.getByLabelText('body'))
    await user.keyboard('mario64')
    expect(isRainbow()).toBe(false)
  })
})

describe('the way out in the footer', () => {
  it('is absent while it is off', () => {
    const { container } = render(<RainbowOffLink />)
    expect(container).toBeEmptyDOMElement()
  })

  it('appears once it is on, and turns it off', async () => {
    const user = userEvent.setup()
    setRainbow(true)
    render(<RainbowOffLink />)

    await user.click(screen.getByRole('button', { name: /Turn off Rainbow Road/ }))
    expect(isRainbow()).toBe(false)
  })
})

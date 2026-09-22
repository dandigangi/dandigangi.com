import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Invisible from './Invisible'

describe('Invisible', () => {
  it('is in the page but hidden until clicked', async () => {
    render(<Invisible text="a clue" />)
    const line = screen.getByText('a clue')
    expect(line.className).toMatch(/hidden/)

    await userEvent.click(line)
    expect(line.className).toMatch(/shown/)
  })

  it('stays hidden when the click ends a text selection', async () => {
    render(<Invisible text="a clue" />)
    const line = screen.getByText('a clue')
    const spy = vi
      .spyOn(window, 'getSelection')
      .mockReturnValue({ toString: () => 'a clue' } as Selection)

    await userEvent.click(line)
    expect(line.className).toMatch(/hidden/)
    spy.mockRestore()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import PostSearch, { type SearchEntry } from './PostSearch'

const index: SearchEntry[] = [
  {
    slug: 'standups',
    title: "What's Probably Missing From Your Team's Standups",
    summary: 'Five observable gaps.',
    tags: ['engineering-management'],
    date: '2024-03-05',
    permalink: '/blog/standups',
  },
]

const setup = () => ({
  user: userEvent.setup(),
  ...render(
    <PostSearch index={index}>
      <p>server list</p>
    </PostSearch>
  ),
})

describe('PostSearch', () => {
  it('shows the server-rendered list until something is typed', () => {
    setup()
    expect(screen.getByText('server list')).toBeInTheDocument()
  })

  it('reports an ordinary miss plainly', async () => {
    const { user } = setup()
    await user.type(screen.getByRole('searchbox'), 'kubernetes')
    expect(screen.getByText(/Try a broader term or browse by tag/)).toBeInTheDocument()
    expect(screen.getByText('0 results')).toBeInTheDocument()
  })

  describe('the pikachu egg', () => {
    it('counts him as one Pokémon rather than zero results', async () => {
      const { user } = setup()
      await user.type(screen.getByRole('searchbox'), 'pikachu')
      expect(screen.getByText('1 Pokémon')).toBeInTheDocument()
      expect(screen.queryByText('0 results')).not.toBeInTheDocument()
    })

    it('replaces the miss copy with the payoff', async () => {
      const { user } = setup()
      await user.type(screen.getByRole('searchbox'), 'pikachu')
      expect(screen.getByText(/Try throwing a Pokéball!/)).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Pikachu' })).toBeInTheDocument()
      expect(screen.queryByText(/Try a broader term/)).not.toBeInTheDocument()
    })

    it('announces the find and the toast together', async () => {
      const { user } = setup()
      await user.type(screen.getByRole('searchbox'), 'pikachu')
      expect(screen.getByText(/You found an easter egg!/)).toBeInTheDocument()
    })

    /** Whole query, not a substring — a post about him should not trigger it. */
    it('does not fire on a query that merely contains his name', async () => {
      const { user } = setup()
      await user.type(screen.getByRole('searchbox'), 'pikachu tips')
      expect(screen.queryByText(/Try throwing a Pokéball!/)).not.toBeInTheDocument()
    })

    it('stands down when the text is cleared', async () => {
      const { user } = setup()
      const box = screen.getByRole('searchbox')
      await user.type(box, 'pikachu')
      await user.clear(box)
      expect(screen.getByText('server list')).toBeInTheDocument()
      expect(screen.queryByText(/Try throwing a Pokéball!/)).not.toBeInTheDocument()
    })
  })
})

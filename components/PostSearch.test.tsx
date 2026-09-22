import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import PostSearch, { type SearchEntry } from './PostSearch'
import { clearTokens } from '@/lib/ledger'

// A toast announces a NEW find; start every case from nothing found.
beforeEach(() => {
  localStorage.clear()
  clearTokens()
})

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
})

describe('the query string', () => {
  afterEach(() => window.history.replaceState(null, '', '/blog'))

  it('loads straight into a search when the URL carries one', async () => {
    window.history.replaceState(null, '', '/blog?q=standups')
    setup()
    expect(await screen.findByDisplayValue('standups')).toBeInTheDocument()
    expect(screen.getByText('1 result')).toBeInTheDocument()
    // The server list is gone: this is a search, not a page with a box on it.
    expect(screen.queryByText('server list')).not.toBeInTheDocument()
  })

  it('puts what was typed into the URL, so it can be shared', async () => {
    const { user } = setup()
    await user.type(screen.getByRole('searchbox'), 'standups')
    expect(window.location.search).toBe('?q=standups')
  })

  it('takes it back out again when the box is cleared', async () => {
    const { user } = setup()
    const box = screen.getByRole('searchbox')
    await user.type(box, 'standups')
    await user.clear(box)
    // Not '?q=' — an empty parameter is worse than no parameter.
    expect(window.location.search).toBe('')
  })

  it('leaves anything else in the URL alone', async () => {
    window.history.replaceState(null, '', '/blog?ref=newsletter')
    const { user } = setup()
    await user.type(screen.getByRole('searchbox'), 'standups')
    expect(window.location.search).toBe('?ref=newsletter&q=standups')
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import PostSearch, { type SearchEntry } from './PostSearch'
import { resetEggs } from '@/lib/eggs'

// A toast announces a NEW find; start every case from nothing found.
beforeEach(() => {
  localStorage.clear()
  resetEggs()
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

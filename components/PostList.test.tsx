import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import PostList from './PostList'
import type { Post } from '@/lib/blog'

vi.mock('@/lib/blog', async (original) => ({
  ...(await original<typeof import('@/lib/blog')>()),
  // Fixed, so the assertions below are about which tag is shown rather than
  // about how the live vocabulary happens to rank today.
  getTagHues: () => ({ hiring: 3, 'engineering-management': 0 }),
}))

const post = (tags: string[]): Post =>
  ({
    slug: 'a-post',
    title: 'A Post',
    summary: 'Something.',
    tags,
    date: '2024-03-05',
    permalink: '/blog/a-post',
  }) as unknown as Post

describe('PostList', () => {
  it('shows the post-first tag on the unfiltered index', () => {
    render(<PostList posts={[post(['engineering-management', 'hiring'])]} />)
    expect(screen.getByText('Engineering Management')).toBeInTheDocument()
  })

  /**
   * The bug this covers: a post listed under Hiring labelled itself
   * "Engineering Management", which reads as the filter having failed.
   */
  it('shows the tag being filtered by on a tag page', () => {
    render(<PostList posts={[post(['engineering-management', 'hiring'])]} activeTag="hiring" />)
    expect(screen.getByText('Hiring')).toBeInTheDocument()
    expect(screen.queryByText('Engineering Management')).not.toBeInTheDocument()
  })

  it('colours that tag with the tag it actually shows', () => {
    const { container } = render(
      <PostList posts={[post(['engineering-management', 'hiring'])]} activeTag="hiring" />
    )
    expect(container.querySelector('[data-hue]')).toHaveAttribute('data-hue', '3')
  })

  it('falls back to the first tag when the active one is not on the post', () => {
    render(<PostList posts={[post(['engineering-management'])]} activeTag="mentoring" />)
    expect(screen.getByText('Engineering Management')).toBeInTheDocument()
  })

  it('renders an untagged post without a meta tag', () => {
    const { container } = render(<PostList posts={[post([])]} />)
    expect(container.querySelector('[data-hue]')).toBeNull()
  })

  it('says so when there is nothing to list', () => {
    render(<PostList posts={[]} />)
    expect(screen.getByText('No posts found.')).toBeInTheDocument()
  })
})

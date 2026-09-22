import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Pagination, { pageWindow } from './Pagination'

/**
 * The window is the whole of the interesting logic here — the rendering is a
 * map over what it returns. `null` is a gap that renders as an ellipsis.
 */
describe('pageWindow', () => {
  it('lists every page while they all fit', () => {
    expect(pageWindow(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('opens a gap before the last page when the current page is near the start', () => {
    expect(pageWindow(1, 12)).toEqual([1, 2, 3, 4, 5, null, 12])
  })

  it('opens a gap on both sides in the middle', () => {
    expect(pageWindow(7, 12)).toEqual([1, null, 6, 7, 8, null, 12])
  })

  it('opens a gap after the first page when the current page is near the end', () => {
    expect(pageWindow(12, 12)).toEqual([1, null, 8, 9, 10, 11, 12])
  })

  it('keeps a constant number of slots as you page through', () => {
    const widths = [1, 2, 3, 6, 9, 11, 12].map((page) => pageWindow(page, 12).length)
    expect(new Set(widths).size).toBe(1)
  })

  it('handles a single page without a gap or a duplicate', () => {
    expect(pageWindow(1, 1)).toEqual([1])
  })
})

describe('Pagination', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(<Pagination page={1} totalPages={1} basePath="/blog" />)
    expect(container).toBeEmptyDOMElement()
  })

  /** Page 1 is the base path; `/blog/page/1` is not a generated route. */
  it('links page one at the base path, not at /page/1', () => {
    render(<Pagination page={3} totalPages={5} basePath="/blog" />)
    expect(screen.getByRole('link', { name: /page 1/i })).toHaveAttribute('href', '/blog')
  })

  it('keeps a tag page inside its own tag', () => {
    render(<Pagination page={1} totalPages={3} basePath="/blog/tags/leadership" />)
    expect(screen.getByRole('link', { name: /next/i })).toHaveAttribute(
      'href',
      '/blog/tags/leadership/page/2'
    )
  })

  it('marks the current page and does not link it', () => {
    render(<Pagination page={2} totalPages={4} basePath="/blog" />)
    const current = screen.getByText('2')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(current.tagName).not.toBe('A')
  })

  it('offers no next link on the last page', () => {
    render(<Pagination page={4} totalPages={4} basePath="/blog" />)
    expect(screen.queryByRole('link', { name: /next/i })).not.toBeInTheDocument()
  })
})

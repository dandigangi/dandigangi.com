import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ProjectTable from './ProjectTable'
import type { Project } from '@/data/projects'

const projects: Project[] = [
  {
    slug: 'soon-thing',
    title: 'Zebra Project',
    description: 'Not live yet.',
    type: 'Open source',
    year: 2026,
    status: 'soon',
  },
  {
    slug: 'alpha',
    title: 'Alpha Site',
    description: 'A website.',
    type: 'Website',
    year: 2020,
    url: 'https://alpha.example.com',
    status: 'live',
  },
  {
    slug: 'middle',
    title: 'Middle Conf',
    description: 'A conference.',
    type: 'Conference',
    year: 2024,
    url: 'https://middle.example.com',
    domain: 'middle.example.com',
    status: 'live',
  },
]

/**
 * Row order as rendered. Read by where each title falls in the list's text
 * rather than by querying inside each row — the title has no role of its own,
 * and a text query matches the description too.
 */
const titles = () => {
  const text = screen.getByRole('list').textContent ?? ''
  return ['Alpha Site', 'Middle Conf', 'Zebra Project'].sort(
    (a, b) => text.indexOf(a) - text.indexOf(b)
  )
}

const numbers = () => screen.getAllByRole('listitem').map((row) => row.textContent?.slice(0, 2))

describe('ProjectTable', () => {
  it('renders the authored order by default', () => {
    render(<ProjectTable projects={projects} />)
    expect(titles()).toEqual(['Zebra Project', 'Alpha Site', 'Middle Conf'])
  })

  it('numbers rows by position, zero-padded', () => {
    render(<ProjectTable projects={projects} />)
    expect(numbers()).toEqual(['01', '02', '03'])
  })

  it('sorts by year, newest first on the first click', async () => {
    const user = userEvent.setup()
    render(<ProjectTable projects={projects} />)
    await user.click(screen.getByRole('button', { name: /sort by year/i }))
    expect(titles()).toEqual(['Zebra Project', 'Middle Conf', 'Alpha Site'])
  })

  it('reverses on the second click', async () => {
    const user = userEvent.setup()
    render(<ProjectTable projects={projects} />)
    const year = screen.getByRole('button', { name: /sort by year/i })
    await user.click(year)
    await user.click(year)
    expect(titles()).toEqual(['Alpha Site', 'Middle Conf', 'Zebra Project'])
  })

  /** Otherwise the default view — the one that was designed — is unreachable. */
  it('returns to the authored order on the third click', async () => {
    const user = userEvent.setup()
    render(<ProjectTable projects={projects} />)
    const year = screen.getByRole('button', { name: /sort by year/i })
    await user.click(year)
    await user.click(year)
    await user.click(year)
    expect(titles()).toEqual(['Zebra Project', 'Alpha Site', 'Middle Conf'])
  })

  it('renumbers after a sort, so the number tracks position not identity', async () => {
    const user = userEvent.setup()
    render(<ProjectTable projects={projects} />)
    await user.click(screen.getByRole('button', { name: /sort by project/i }))
    expect(titles()).toEqual(['Alpha Site', 'Middle Conf', 'Zebra Project'])
    expect(numbers()).toEqual(['01', '02', '03'])
  })

  it('announces the sort direction in the control label', async () => {
    const user = userEvent.setup()
    render(<ProjectTable projects={projects} />)
    await user.click(screen.getByRole('button', { name: /sort by year/i }))
    expect(
      screen.getByRole('button', { name: /sort by year, sorted descending/i })
    ).toBeInTheDocument()
  })

  it('links a live project out to its url', () => {
    render(<ProjectTable projects={projects} />)
    expect(screen.getByRole('link', { name: /Alpha Site/ })).toHaveAttribute(
      'href',
      'https://alpha.example.com'
    )
  })

  it('does not link a coming-soon project', () => {
    render(<ProjectTable projects={projects} />)
    expect(screen.queryByRole('link', { name: /Zebra Project/ })).not.toBeInTheDocument()
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
  })

  it('shows no domain line for a coming-soon project', () => {
    render(<ProjectTable projects={projects} />)
    const row = screen.getByText('Zebra Project').closest('li')!
    expect(within(row).queryByText(/example\.com/)).not.toBeInTheDocument()
  })

  it('derives the domain from the url when none is given', () => {
    render(<ProjectTable projects={projects} />)
    expect(screen.getByText('alpha.example.com')).toBeInTheDocument()
  })

  it('gives every row a distinct hue that spans the ramp', () => {
    render(<ProjectTable projects={projects} />)
    const hues = screen
      .getAllByRole('listitem')
      .map((row) => (row.firstElementChild as HTMLElement).style.getPropertyValue('--row-hue'))
    expect(new Set(hues).size).toBe(3)
    expect(hues[0]).toBe('#FF6B5A')
    expect(hues[2]).toBe('#B07BFF')
  })
})

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Editor from './Editor'
import type { PostContent, PostSummary } from './actions'
import type { ManagedFields } from '@/lib/frontmatter'

/**
 * The server actions are mocked: they touch the real data/blog directory, and a
 * test suite that writes posts is a test suite that eventually deletes one. What
 * matters here is the behaviour around them — which controls are reachable in
 * which state, and what gets handed over when they are called.
 */
type Ok = { ok: true; file: string; warning: string | null }

const saveNew = vi.fn(
  async (_slug: string, _fields: ManagedFields, _body: string): Promise<Ok> => ({
    ok: true,
    file: 'new-post.draft.mdx',
    warning: null,
  })
)
const save = vi.fn(
  async (_file: string, _slug: string, _fields: ManagedFields, _body: string): Promise<Ok> => ({
    ok: true,
    file: 'a-post.mdx',
    warning: null,
  })
)
const publish = vi.fn(async (_file: string): Promise<Ok> => ({
  ok: true,
  file: 'draft-post.mdx',
  warning: null,
}))
const discard = vi.fn(async (_file: string): Promise<Ok> => ({
  ok: true,
  file: 'draft-post.draft.mdx',
  warning: null,
}))
const listPosts = vi.fn(async () => summaries)

vi.mock('./actions', () => ({
  saveNew: (...args: Parameters<typeof saveNew>) => saveNew(...args),
  save: (...args: Parameters<typeof save>) => save(...args),
  publish: (...args: Parameters<typeof publish>) => publish(...args),
  discard: (...args: Parameters<typeof discard>) => discard(...args),
  readPost: vi.fn(),
  listPosts: () => listPosts(),
}))

const summaries: PostSummary[] = [
  {
    file: 'draft-post.draft.mdx',
    slug: 'draft-post.draft',
    title: 'Draft Post',
    date: '2026-02-02',
    draft: false,
    local: true,
  },
  {
    file: 'a-post.mdx',
    slug: 'a-post',
    title: 'A Post',
    date: '2026-01-01',
    draft: false,
    local: false,
  },
]

const localDraft: PostContent = {
  file: 'draft-post.draft.mdx',
  title: 'Draft Post',
  date: '2026-02-02',
  lastmod: '2026-02-02',
  tags: ['one'],
  draft: false,
  summary: 'A draft.',
  body: 'Some body.',
  local: true,
}

const published: PostContent = { ...localDraft, file: 'a-post.mdx', title: 'A Post', local: false }

const setup = (initialPost: PostContent | null = null) => ({
  user: userEvent.setup(),
  ...render(<Editor initial={summaries} initialPost={initialPost} />),
})

const field = (name: string) =>
  screen
    .getByText(new RegExp(`^${name}`))
    .closest('label')!
    .querySelector('input')!

/** The footer's Save. The confirm dialog has one too, hence the scoping. */
const saveButton = () => within(screen.getByTestId('bar')).getByRole('button', { name: /^save$/i })

const confirm = async (user: ReturnType<typeof userEvent.setup>, name: RegExp) =>
  user.click(within(screen.getByRole('dialog')).getByRole('button', { name }))

beforeEach(() => vi.clearAllMocks())

describe('a new post', () => {
  it('derives the slug from the title', async () => {
    const { user } = setup()
    await user.type(field('Title'), "It's a New Post!")
    // The trailing dash is kept while typing, so a space mid-title does not
    // fight you; it is trimmed on the way to disk, which the next test checks.
    expect(field('Slug')).toHaveValue('its-a-new-post-')
  })

  it('trims the trailing dash off the slug it actually writes', async () => {
    const { user } = setup()
    await user.type(field('Title'), "It's a New Post!")
    await user.type(screen.getByTestId('body'), 'Body.')
    await user.click(saveButton())
    await confirm(user, /^save$/i)

    expect(saveNew).toHaveBeenCalled()
    expect(saveNew.mock.calls[0][0]).toBe('its-a-new-post')
  })

  it('stops following the title once the slug is edited by hand', async () => {
    const { user } = setup()
    await user.type(field('Title'), 'First')
    await user.clear(field('Slug'))
    await user.type(field('Slug'), 'chosen-slug')
    await user.type(field('Title'), ' Second')
    expect(field('Slug')).toHaveValue('chosen-slug')
  })

  it('sanitises a hand-typed slug as it is typed', async () => {
    const { user } = setup()
    await user.type(field('Slug'), 'My Post!!')
    expect(field('Slug')).toHaveValue('my-post-')
  })

  it('refuses a slug that already exists, including the local spelling', async () => {
    const { user } = setup()
    await user.type(field('Title'), 'Draft Post')
    expect(screen.getByText(/draft-post already exists/i)).toBeInTheDocument()
    expect(saveButton()).toBeDisabled()
  })

  it('will not save without a body', async () => {
    const { user } = setup()
    await user.type(field('Title'), 'Title Only')
    expect(screen.getByText('no body')).toBeInTheDocument()
    expect(saveButton()).toBeDisabled()
  })

  it('saves once there is a title and a body', async () => {
    const { user } = setup()
    await user.type(field('Title'), 'Real Post')
    await user.type(screen.getByTestId('body'), 'x')
    expect(saveButton()).toBeEnabled()
  })
})

describe('tags', () => {
  it('accepts commas and spaces as they are typed', async () => {
    const { user } = setup()
    await user.type(field('Tags'), 'hiring, job search')
    expect(field('Tags')).toHaveValue('hiring, job search')
  })

  it('normalises to kebab-case on the way to disk', async () => {
    const { user } = setup(localDraft)
    await user.clear(field('Tags'))
    await user.type(field('Tags'), 'Job Search, Mental Health')
    await user.click(saveButton())
    await confirm(user, /^save$/i)

    expect(save).toHaveBeenCalled()
    expect(save.mock.calls[0][2].tags).toEqual(['job-search', 'mental-health'])
  })
})

describe('confirming', () => {
  it('asks before saving and does nothing if cancelled', async () => {
    const { user } = setup(localDraft)
    await user.type(field('Title'), ' edited')
    await user.click(saveButton())

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(/save changes/i)).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: /cancel/i }))

    expect(save).not.toHaveBeenCalled()
  })

  it('warns before discarding unsaved work', async () => {
    const { user } = setup(localDraft)
    await user.type(field('Title'), ' edited')
    await user.click(screen.getByRole('button', { name: /new post/i }))

    expect(screen.getByRole('dialog')).toHaveTextContent(/unsaved changes/i)
  })

  it('does not warn when nothing has changed', async () => {
    const { user } = setup(localDraft)
    await user.click(screen.getByRole('button', { name: /new post/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('a local draft', () => {
  it('can be published and deleted', () => {
    setup(localDraft)
    expect(screen.getByRole('button', { name: /publish/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('shows the WIP marker', () => {
    setup(localDraft)
    expect(screen.getAllByText('WIP').length).toBeGreaterThan(0)
  })

  it('keeps the slug and date editable', () => {
    setup(localDraft)
    expect(field('Slug')).not.toHaveAttribute('readonly')
    expect(field('Date')).not.toHaveAttribute('readonly')
  })
})

describe('a published post', () => {
  it('locks the slug and the date', () => {
    setup(published)
    expect(field('Slug')).toHaveAttribute('readonly')
    expect(field('Date')).toHaveAttribute('readonly')
  })

  it('offers no way to unpublish or delete', () => {
    setup(published)
    expect(screen.queryByRole('button', { name: /unpublish/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
  })

  it('cannot be saved empty', async () => {
    const { user } = setup(published)
    await user.clear(screen.getByTestId('body'))
    expect(saveButton()).toBeDisabled()
  })
})

describe('the summary counter', () => {
  it('flags a summary past the search-result limit', async () => {
    const { user } = setup()
    await user.type(field('Summary'), 'x'.repeat(161))
    expect(screen.getByText(/161\/160/)).toBeInTheDocument()
    expect(screen.getByText(/search results will cut it off/i)).toBeInTheDocument()
  })
})

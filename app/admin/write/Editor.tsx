'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  discard,
  listPosts,
  publish,
  readPost,
  save,
  saveNew,
  type PostContent,
  type PostSummary,
} from './actions'
import TagPicker, { type TagOption } from './TagPicker'
import { SNIPPETS, insertSnippet } from './snippets'
import ThemeToggle from '@/components/ThemeToggle'
import type { ManagedFields } from '@/lib/frontmatter'
import styles from './Editor.module.css'

const today = () => new Date().toISOString().slice(0, 10)

const DAY_MS = 86_400_000

/**
 * What the chosen date actually means for the live site.
 *
 * `getPublishedPosts` hides anything dated later than today in UTC, so a future
 * date is a scheduled publish — useful, and completely silent until now. This
 * says it out loud, because a post that simply never appeared was indistinguishable
 * from a broken one. The comparison is UTC on both sides to match that filter.
 */
function dateNote(date: string): { text: string; tone: 'ok' | 'warn' } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null

  const days = Math.round(
    (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today()}T00:00:00Z`)) / DAY_MS
  )
  if (Number.isNaN(days)) return null

  const plural = (n: number) => `${n} day${n === 1 ? '' : 's'}`

  if (days === 0) return { text: 'today — live as soon as it is committed', tone: 'ok' }
  if (days > 0) {
    return {
      text: `${plural(days)} out — stays hidden from the site until ${date}`,
      tone: 'warn',
    }
  }
  return { text: `backdated ${plural(-days)} — publishes immediately`, tone: 'ok' }
}

/**
 * Where Google starts truncating a meta description. Not a hard limit — the
 * post still works past it, the tail just stops being read.
 */
const SUMMARY_LIMIT = 160

/**
 * Runs on every keystroke, so it lives here rather than as a server action —
 * asking the server to hyphenate a title is a round trip per character.
 *
 * Trailing dashes survive so that typing "my post" does not fight you at the
 * space; `settle` trims them for the value that actually reaches disk.
 */
const clean = (value: string) =>
  value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+/, '')
    .slice(0, 80)

const settle = (value: string) => clean(value).replace(/-+$/, '')

const BLANK: PostContent = {
  file: '',
  title: '',
  date: today(),
  tags: [],
  draft: false,
  summary: '',
  body: '',
  local: true,
}

/**
 * The preview renders markdown only, so a component in the body is shown as its
 * own source in a fenced block — on its own line, props and all. Seeing how the
 * <Video> is configured is more use than a label saying one is there.
 *
 * The trailing `[ \t]*` matters: `\s*` is greedy across newlines, so it ate the
 * blank line after `/>` and welded the block onto the paragraph below it.
 */
const JSX_BLOCK = /^[ \t]*<[A-Z][\w]*[\s\S]*?\/>[ \t]*$/gm
const chip = (body: string) =>
  body.replace(JSX_BLOCK, (match) => `\n\`\`\`jsx\n${match.trim()}\n\`\`\`\n`)

type Mode = 'new' | 'editing'

/** What the confirm dialog is currently asking about. */
type Ask = {
  heading: string
  detail: React.ReactNode
  confirm: string
  tone?: 'danger'
  go: () => void
}

const snapshot = (post: PostContent, tags: string[]) =>
  JSON.stringify([post.title, post.date, post.summary, post.draft, post.body, tags])

const baseSlug = (file: string) => file.replace(/(\.draft)?\.mdx$/, '')

export default function Editor({
  initial,
  initialPost,
  tagOptions,
}: {
  initial: PostSummary[]
  /** Read on the server when arriving from the Edit control on a post page. */
  initialPost: PostContent | null
  /** Every tag already in use, counted across data/blog. Read on the server. */
  tagOptions: TagOption[]
}) {
  const start = initialPost ?? BLANK
  const startTags = start.tags

  const [posts, setPosts] = useState(initial)
  const [post, setPost] = useState<PostContent>(start)
  const [tags, setTags] = useState<string[]>(startTags)
  const [slugOverride, setSlugOverride] = useState<string | null>(null)
  const [fileSlug, setFileSlug] = useState(initialPost ? baseSlug(initialPost.file) : '')
  const [mode, setMode] = useState<Mode>(initialPost ? 'editing' : 'new')
  const [saved, setSaved] = useState(() => snapshot(start, startTags))
  const [note, setNote] = useState<{ kind: 'ok' | 'bad'; text: string } | null>(null)
  const [ask, setAsk] = useState<Ask | null>(null)
  const [railOpen, setRailOpen] = useState(true)
  const [metaOpen, setMetaOpen] = useState(true)
  const [pending, startTransition] = useTransition()

  const set = <K extends keyof PostContent>(key: K, value: PostContent[K]) =>
    setPost((current) => ({ ...current, [key]: value }))

  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const insert = (text: string) => {
    const area = bodyRef.current
    if (!text || !area) return
    const next = insertSnippet(post.body, area.selectionStart, area.selectionEnd, text)
    set('body', next.body)
    // After React has written the new value, or the caret lands in the old one.
    requestAnimationFrame(() => {
      area.focus()
      area.setSelectionRange(next.caret, next.caret)
    })
  }

  const dirty = snapshot(post, tags) !== saved

  // The browser's own dialog, which a page cannot style. It only covers closing
  // the tab or going back; moving between posts is handled by the confirm below,
  // which can say something more useful than "Leave site?".
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const load = (loaded: PostContent, file: string) => {
    setPost(loaded)
    setTags(loaded.tags)
    setFileSlug(baseSlug(file))
    setSlugOverride(null)
    setMode('editing')
    setSaved(snapshot(loaded, loaded.tags))
    setNote(null)
  }

  /** Locked only once the filename is the public URL — that is, once published. */
  const slugLocked = mode === 'editing' && !post.local
  const slug = slugLocked
    ? fileSlug
    : (slugOverride ?? (mode === 'editing' ? fileSlug : clean(post.title)))
  const finalSlug = settle(slug)

  /**
   * A published post and a local draft of the same name are the same slug, so
   * `foo.draft.mdx` and `foo.mdx` both reserve "foo". Checked here rather than
   * only on save, so a collision shows while there is still a cursor in the
   * field.
   */
  const taken = useMemo(
    () =>
      new Set(
        posts
          .filter((entry) => entry.file !== post.file)
          .map((entry) => entry.slug.replace(/\.draft$/, ''))
      ),
    [posts, post.file]
  )

  const slugError =
    !slugLocked && finalSlug !== '' && taken.has(finalSlug)
      ? `${finalSlug} already exists — pick another.`
      : null

  const fields: ManagedFields = useMemo(
    () => ({
      title: post.title,
      date: post.date,
      lastmod: mode === 'editing' ? today() : post.date,
      tags,
      draft: post.draft,
      summary: post.summary,
    }),
    [post, tags, mode]
  )

  /** Guards anything that would throw away unsaved work. */
  const leaving = (what: string, go: () => void) => {
    if (!dirty) return go()
    setAsk({
      heading: 'Unsaved changes',
      detail: (
        <>
          <strong>{post.title || 'This post'}</strong> has edits that are not on disk. {what} will
          discard them.
        </>
      ),
      confirm: 'Discard and continue',
      tone: 'danger',
      go,
    })
  }

  const open = (file: string) =>
    leaving('Opening another post', () =>
      startTransition(async () => load(await readPost(file), file))
    )

  const startNew = () =>
    leaving('Starting a new post', () => {
      setPost(BLANK)
      setTags([])
      setSlugOverride(null)
      setFileSlug('')
      setMode('new')
      setSaved(snapshot(BLANK, []))
      setNote(null)
    })

  const run = (
    action: () => Promise<
      { ok: true; file: string; warning: string | null } | { ok: false; error: string }
    >,
    success: string
  ) =>
    startTransition(async () => {
      const result = await action()
      if (!result.ok) {
        setNote({ kind: 'bad', text: result.error })
        return
      }
      const next = {
        ...post,
        file: result.file,
        local: result.file.endsWith('.draft.mdx'),
        tags,
      }
      setPost(next)
      setSaved(snapshot(next, tags))
      setFileSlug(baseSlug(result.file))
      setMode('editing')
      setNote(
        result.warning ? { kind: 'bad', text: result.warning } : { kind: 'ok', text: success }
      )
      setPosts(await listPosts())
    })

  const confirmSave = () =>
    setAsk({
      heading: mode === 'new' ? 'Save a new local draft' : 'Save changes',
      detail:
        mode === 'new' ? (
          <>
            Writes <code>data/blog/{finalSlug}.draft.mdx</code>. That filename is in{' '}
            <code>.gitignore</code>, so it cannot be committed, pushed or deployed — it exists only
            on this machine.
          </>
        ) : post.local ? (
          <>
            Overwrites <code>data/blog/{post.file}</code>. Still local-only; nothing leaves this
            machine.
          </>
        ) : (
          <>
            Overwrites <code>data/blog/{post.file}</code>, which <strong>is tracked by git</strong>.
            It reaches the live site the moment you commit and push.
          </>
        ),
      confirm: 'Save',
      go: () =>
        mode === 'new'
          ? run(
              () => saveNew(finalSlug, fields, post.body),
              `Saved data/blog/${finalSlug}.draft.mdx — local only.`
            )
          : run(
              () => save(post.file, finalSlug, fields, post.body),
              `Saved ${finalSlug}${post.local ? '.draft' : ''}.mdx.`
            ),
    })

  const confirmPublish = () =>
    setAsk({
      heading: 'Make this committable',
      detail: (
        <>
          Renames <code>{post.file}</code> to <code>{fileSlug}.mdx</code>. It stops being ignored by
          git, so your next <code>git add</code> picks it up, and pushing puts it live at{' '}
          <code>/blog/{fileSlug}</code>.
          {post.draft && <> It is flagged hidden, so it stays off the site until you clear that.</>}
        </>
      ),
      confirm: 'Publish',
      go: () => run(() => publish(post.file), 'Published — now committable.'),
    })

  /** Reset to a blank new post — the file the editor was pointed at is gone. */
  const blank = () => {
    setPost(BLANK)
    setTags([])
    setSlugOverride(null)
    setFileSlug('')
    setMode('new')
    setSaved(snapshot(BLANK, []))
  }

  const confirmDiscard = () =>
    setAsk({
      heading: 'Delete this draft',
      detail: (
        <>
          Deletes <code>data/blog/{post.file}</code> from disk. It has never been committed, so
          there is <strong>no copy in git to recover it from</strong> — this cannot be undone.
        </>
      ),
      confirm: 'Delete permanently',
      tone: 'danger',
      go: () =>
        startTransition(async () => {
          const result = await discard(post.file)
          if (!result.ok) {
            setNote({ kind: 'bad', text: result.error })
            return
          }
          blank()
          setNote({ kind: 'ok', text: `Deleted ${result.file}.` })
          setPosts(await listPosts())
        }),
    })

  /**
   * No body, no file — in every state, including a brand new local draft. A
   * title on its own is not a post, and a stub saved "to come back to" is the
   * thing that later gets published half-written by accident.
   */
  const bodyEmpty = post.body.trim() === ''
  const canSave =
    post.title.trim() !== '' && finalSlug !== '' && !slugError && !bodyEmpty && !pending
  const dateMeaning = dateNote(post.date)
  const over = post.summary.length > SUMMARY_LIMIT
  const liveUrl = post.file ? `/blog/${post.file.replace(/\.mdx$/, '')}` : null

  return (
    <div className={styles.shell}>
      {railOpen && (
        <aside className={styles.rail}>
          <a className={styles.railButton} href="/" target="_blank" rel="noreferrer">
            View site
          </a>
          <button type="button" className={styles.railButton} onClick={startNew}>
            New post
          </button>
          <ol className={styles.list}>
            {posts.map((entry) => (
              <li key={entry.file}>
                <button
                  type="button"
                  className={`${styles.entry} ${post.file === entry.file ? styles.current : ''}`}
                  onClick={() => open(entry.file)}
                >
                  <span className={styles.entryTitle}>
                    {entry.title || entry.slug}
                    {entry.local && <span className={styles.wip}>WIP</span>}
                  </span>
                  <span className={styles.entryMeta}>
                    {entry.date}
                    {!entry.local && entry.draft && (
                      <span className={styles.tagHidden}>hidden</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
      )}

      <main className={styles.main}>
        <div className={styles.strip}>
          <button
            type="button"
            className={styles.toggleStrip}
            onClick={() => setRailOpen((open) => !open)}
          >
            {railOpen ? 'Hide posts' : 'Show posts'}
          </button>
          <button
            type="button"
            className={styles.toggleStrip}
            onClick={() => setMetaOpen((open) => !open)}
          >
            {metaOpen ? 'Hide fields' : 'Show fields'}
          </button>
          {/* The site's own toggle — the footer that normally holds it is
              suppressed here, so without this the editor could inherit a theme
              it had no way to change. */}
          <span className={styles.themeToggle}>
            <ThemeToggle />
          </span>
          {!metaOpen && (
            <span className={styles.stripMeta}>
              <span className={styles.stripTitle}>{post.title || 'Untitled'}</span>
              <span className={styles.stripDot}>·</span>
              <span>{post.date}</span>
              {tags.length > 0 && (
                <>
                  <span className={styles.stripDot}>·</span>
                  <span>{tags.join(', ')}</span>
                </>
              )}
              {post.summary && (
                <>
                  <span className={styles.stripDot}>·</span>
                  <span className={styles.stripSummary}>{post.summary}</span>
                </>
              )}
            </span>
          )}

          {/* Pushed to the far end so it reads as a status for the whole strip
              rather than a label on the first button. */}
          {mode === 'editing' && post.local && (
            <span className={`${styles.wip} ${styles.stripWip}`}>WIP</span>
          )}
        </div>

        <header className={`${styles.meta} ${metaOpen ? '' : styles.metaHidden}`}>
          <label className={styles.field}>
            <span>Title</span>
            <input value={post.title} onChange={(event) => set('title', event.target.value)} />
          </label>

          <label className={styles.field}>
            <span>
              Slug
              {slugLocked && <em className={styles.locked}> — fixed, this is the URL</em>}
            </span>
            <input
              value={slug}
              readOnly={slugLocked}
              onChange={(event) => setSlugOverride(clean(event.target.value))}
            />
            {slugError && <em className={styles.inlineBad}>{slugError}</em>}
          </label>

          <label className={styles.field}>
            <span>
              Date
              {slugLocked && <em className={styles.locked}> — fixed once published</em>}
              {dateMeaning && (
                <em className={dateMeaning.tone === 'warn' ? styles.inlineWarn : styles.hint}>
                  {' '}
                  — {dateMeaning.text}
                </em>
              )}
            </span>
            <input
              type="date"
              value={post.date}
              readOnly={slugLocked}
              onChange={(event) => set('date', event.target.value)}
            />
          </label>

          <TagPicker value={tags} options={tagOptions} onChange={setTags} />

          <label className={`${styles.field} ${styles.wide}`}>
            <span>
              Summary
              <em className={over ? styles.inlineBad : styles.hint}>
                {' '}
                — {post.summary.length}/{SUMMARY_LIMIT}
                {over ? ', search results will cut it off' : ' for search results'}
              </em>
            </span>
            <input
              className={over ? styles.overLimit : undefined}
              value={post.summary}
              onChange={(event) => set('summary', event.target.value)}
            />
          </label>
        </header>

        <div className={styles.split}>
          <textarea
            ref={bodyRef}
            data-testid="body"
            className={styles.write}
            value={post.body}
            spellCheck
            placeholder="# Write here&#10;&#10;Markdown. The right side shows it rendered."
            onChange={(event) => set('body', event.target.value)}
          />
          <div className={`${styles.preview} prose`}>
            <h1>{post.title || 'Untitled'}</h1>
            <Markdown remarkPlugins={[remarkGfm]}>{chip(post.body)}</Markdown>
          </div>
        </div>

        <footer className={styles.bar} data-testid="bar">
          <Status post={post} mode={mode} dirty={dirty} bodyEmpty={bodyEmpty} />

          {note && <span className={note.kind === 'ok' ? styles.ok : styles.bad}>{note.text}</span>}

          <div className={styles.actions}>
            <select
              aria-label="Insert component"
              className={styles.secondary}
              value=""
              onChange={(event) => insert(event.target.value)}
            >
              <option value="">Insert component…</option>
              {SNIPPETS.map((snippet) => (
                <option key={snippet.label} value={snippet.text}>
                  {snippet.label}
                </option>
              ))}
            </select>

            {liveUrl && mode === 'editing' && (
              <a className={styles.secondary} href={liveUrl} target="_blank" rel="noreferrer">
                View post ↗
              </a>
            )}

            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={post.draft}
                onChange={(event) => set('draft', event.target.checked)}
              />
              Hide from site
            </label>

            {mode === 'editing' && post.local && (
              <button
                type="button"
                className={styles.deleteDraft}
                disabled={pending}
                onClick={confirmDiscard}
              >
                Delete
              </button>
            )}

            {mode === 'editing' && post.local && (
              <button
                type="button"
                className={styles.publish}
                disabled={pending || bodyEmpty}
                title={bodyEmpty ? 'Write something first — an empty post is just a title.' : ''}
                onClick={confirmPublish}
              >
                Publish
              </button>
            )}

            <button
              type="button"
              className={styles.save}
              disabled={!canSave}
              title={
                bodyEmpty ? 'Write something first — a title on its own is not a post.' : undefined
              }
              onClick={confirmSave}
            >
              {pending ? 'Working…' : 'Save'}
            </button>
          </div>
        </footer>
      </main>

      {ask && (
        <Confirm
          ask={ask}
          onClose={() => setAsk(null)}
          onGo={() => {
            const { go } = ask
            setAsk(null)
            go()
          }}
        />
      )}
    </div>
  )
}

function Confirm({ ask, onClose, onGo }: { ask: Ask; onClose: () => void; onGo: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className={styles.overlay}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className={styles.dialog} role="dialog" aria-modal="true">
        <h2 className={styles.dialogHeading}>{ask.heading}</h2>
        <p className={styles.dialogBody}>{ask.detail}</p>
        <div className={styles.dialogActions}>
          <button type="button" className={styles.secondary} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={ask.tone === 'danger' ? styles.danger : styles.save}
            onClick={onGo}
          >
            {ask.confirm}
          </button>
        </div>
      </div>
    </div>
  )
}

/** Says plainly which of the three states the post is in, because that is the
 *  thing worth being certain about before closing the laptop. */
function Status({
  post,
  mode,
  dirty,
  bodyEmpty,
}: {
  post: PostContent
  mode: Mode
  dirty: boolean
  bodyEmpty: boolean
}) {
  const state =
    mode === 'new'
      ? 'New — saves as .draft.mdx, local only'
      : post.local
        ? 'Local only — not in git, not deployed'
        : post.draft
          ? 'In git, hidden from the site'
          : 'In git, live on the site'

  return (
    <span className={styles.state}>
      {state}
      {dirty && <span className={styles.dirty}>unsaved</span>}
      {/* A condition, not a failure — red here read as "your save went wrong"
          even when the save had just succeeded. */}
      {bodyEmpty && <span className={styles.dirty}>no body</span>}
    </span>
  )
}

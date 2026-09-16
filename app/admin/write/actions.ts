'use server'

import { readFile, readdir, rename, unlink, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { join } from 'node:path'
import { createPost, parsePost, updatePost, type ManagedFields } from '@/lib/frontmatter'

const run = promisify(execFile)

/**
 * Disk access for the local editor. Only app/admin/write/page.dev.tsx imports this,
 * and that file is not a route outside development (see next.config.mjs), so
 * none of it reaches a production build. The guard below is the second lock,
 * for the case where someone imports this from somewhere that does ship.
 */
const assertLocal = () => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('The post editor is local-only.')
  }
}

const DIR = 'data/blog'

/** Local-only suffix. `.gitignore` has *.draft.mdx, so these cannot be
 *  committed, which means they cannot reach GitHub or a deploy. */
const LOCAL = '.draft.mdx'

export type PostSummary = {
  file: string
  slug: string
  title: string
  date: string
  draft: boolean
  /** True while the file is still `.draft.mdx` — invisible to git and prod. */
  local: boolean
}

export type PostContent = ManagedFields & { file: string; body: string; local: boolean }

const isLocal = (file: string) => file.endsWith(LOCAL)

export async function listPosts(): Promise<PostSummary[]> {
  assertLocal()
  const names = (await readdir(DIR)).filter((name) => name.endsWith('.mdx'))

  const posts = await Promise.all(
    names.map(async (file) => {
      const post = parsePost(await readFile(join(DIR, file), 'utf8'))
      return {
        file,
        slug: file.replace(/\.mdx$/, ''),
        title: post.title,
        date: post.date,
        draft: post.draft,
        local: isLocal(file),
      }
    })
  )

  // Local drafts first — they are the ones being worked on.
  return posts.sort((a, b) => {
    if (a.local !== b.local) return a.local ? -1 : 1
    return b.date.localeCompare(a.date)
  })
}

export async function readPost(file: string): Promise<PostContent> {
  assertLocal()
  const post = parsePost(await readFile(join(DIR, safeName(file)), 'utf8'))
  return { ...post, file, body: post.body, local: isLocal(file) }
}

/** Nothing from the browser is allowed to point outside data/blog. */
const safeName = (file: string) => {
  if (!/^[a-z0-9][a-z0-9.-]*\.mdx$/i.test(file) || file.includes('..')) {
    throw new Error(`Refusing to touch "${file}".`)
  }
  return file
}

/**
 * Velite runs once at `yarn dev` start, so a file written afterwards would not
 * reach the site until a restart. Rebuilding here is what makes saving feel
 * like saving.
 *
 * Spawned rather than imported: `import { build } from 'velite'` pulls esbuild's
 * native binary into the module graph, and Turbopack tries to parse that
 * executable as source — "failed to convert rope into string". The CLI has no
 * such problem because nothing bundles it.
 */
const rebuild = async (): Promise<string | null> => {
  try {
    await run(join(process.cwd(), 'node_modules/.bin/velite'), [], { cwd: process.cwd() })
    return null
  } catch (error) {
    // The file is on disk either way. A failed rebuild only means the site has
    // not caught up — which looks identical to a broken save unless it is said
    // out loud, so it is returned rather than swallowed.
    return `Saved, but Velite did not rebuild: ${(error as Error).message.split('\n')[0]}`
  }
}

export async function saveNew(slug: string, fields: ManagedFields, body: string) {
  assertLocal()
  const file = safeName(`${slug}${LOCAL}`)

  // Both spellings are checked: a local draft and a published post cannot share
  // a slug, or publishing would silently overwrite the published one.
  for (const candidate of [file, `${slug}.mdx`]) {
    if (existsSync(join(DIR, candidate))) {
      return { ok: false as const, error: `${candidate} already exists.` }
    }
  }

  await writeFile(join(DIR, file), createPost(fields, body), 'utf8')
  return { ok: true as const, file, warning: await rebuild() }
}

/**
 * `slug` is honoured only while the post is still local. A published post's
 * filename is its public URL, and velite.config.ts is explicit that those must
 * not change — so renaming one is not something a text field should be able to
 * do by accident.
 */
export async function save(file: string, slug: string, fields: ManagedFields, body: string) {
  assertLocal()
  let name = safeName(file)
  const original = await readFile(join(DIR, name), 'utf8')

  if (isLocal(name)) {
    const wanted = safeName(`${slug}${LOCAL}`)
    if (wanted !== name) {
      for (const candidate of [wanted, `${slug}.mdx`]) {
        if (existsSync(join(DIR, candidate))) {
          return { ok: false as const, error: `${candidate} already exists.` }
        }
      }
      await rename(join(DIR, name), join(DIR, wanted))
      name = wanted
    }
  }

  try {
    await writeFile(join(DIR, name), updatePost(original, fields, body), 'utf8')
  } catch (error) {
    return { ok: false as const, error: (error as Error).message }
  }

  return { ok: true as const, file: name, warning: await rebuild() }
}

/**
 * Publishing is the rename, not the frontmatter flag: `.draft.mdx` is what
 * `.gitignore` hides, so dropping the suffix is the moment a post becomes
 * something that can be committed and deployed.
 */
export async function publish(file: string) {
  assertLocal()
  const name = safeName(file)
  if (!isLocal(name)) return { ok: false as const, error: 'Already publishable.' }

  const target = name.replace(new RegExp(`${LOCAL.replace('.', '\\.')}$`), '.mdx')
  if (existsSync(join(DIR, target))) {
    return { ok: false as const, error: `${target} already exists.` }
  }

  await rename(join(DIR, name), join(DIR, target))
  return { ok: true as const, file: target, warning: await rebuild() }
}

/**
 * Deletes a local draft. Only ever a `.draft.mdx`, and the check is here rather
 * than only in the UI: a published post is in git and could be recovered, but
 * one of these has never been committed anywhere, so deleting it is the end of
 * it. Nothing should be able to aim this at a tracked file.
 */
export async function discard(file: string) {
  assertLocal()
  const name = safeName(file)
  if (!isLocal(name)) {
    return { ok: false as const, error: 'Only local drafts can be deleted here.' }
  }
  await unlink(join(DIR, name))
  return { ok: true as const, file: name, warning: await rebuild() }
}

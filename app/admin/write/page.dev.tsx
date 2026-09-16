import type { Metadata } from 'next'
import { listPosts, readPost } from './actions'
import Editor from './Editor'

/**
 * The local post editor.
 *
 * This file is a route only outside production: `pageExtensions` in
 * next.config.mjs drops `dev.tsx` from the list when NODE_ENV is production, so
 * `next build` never compiles it, never bundles it, and never lists it in the
 * route manifest. The editor-only dependencies it pulls in — react-markdown,
 * gray-matter — go with it, which is why both are devDependencies.
 */
export const metadata: Metadata = {
  title: 'Write',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function WritePage({
  searchParams,
}: {
  searchParams: Promise<{ file?: string }>
}) {
  const { file } = await searchParams
  const posts = await listPosts()

  /**
   * Read here rather than in the client. Fetching it after mount meant either an
   * effect that writes state on arrival, or — as it was — consuming the param
   * during render, which updates the router mid-render and warns three ways.
   * The server already has the file open; handing it over as a prop is both
   * simpler and correct.
   *
   * Only a file the listing already knows about, so a hand-typed query string
   * cannot aim the editor outside data/blog.
   */
  const known = posts.some((post) => post.file === file)
  const initialPost = known && file ? await readPost(file) : null

  return <Editor initial={posts} initialPost={initialPost} />
}

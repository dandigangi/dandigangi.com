/**
 * The MDX components a post can use, as the editor inserts them. Each one must
 * be registered in components/MDXComponents.tsx or the post fails to render.
 *
 * The caret lands in the first empty `""`, which is the value every one of
 * these needs filled in.
 */
export const SNIPPETS = [
  { label: 'Invisible text', text: '<Invisible text="" />' },
  { label: 'Spacer', text: '<Spacer height={24} />' },
  { label: 'Video (YouTube embed)', text: '<Video url="" title="" />' },
  { label: 'Spotify embed', text: '<Spotify src="" title="" />' },
] as const

/**
 * Puts `text` in place of the selection, on its own lines: MDX only treats a
 * component as a block when blank lines surround it, and inline inside a
 * paragraph most of these render as invalid HTML.
 */
export function insertSnippet(body: string, start: number, end: number, text: string) {
  const before = body.slice(0, start)
  const after = body.slice(end)
  const lead = before === '' || before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n'
  const tail =
    after === '' || after.startsWith('\n\n') ? '' : after.startsWith('\n') ? '\n' : '\n\n'
  const quote = text.indexOf('""')
  const caret = before.length + lead.length + (quote === -1 ? text.length : quote + 1)
  return { body: before + lead + text + tail + after, caret }
}

import Link from 'next/link'
import styles from './Pagination.module.css'

/**
 * Page 1 lives at the base path, not at `<base>/page/1` — that route is not
 * generated, so linking to it 404s.
 */
const href = (basePath: string, page: number) =>
  page === 1 ? basePath : `${basePath}/page/${page}`

const range = (from: number, to: number) =>
  Array.from({ length: Math.max(to - from + 1, 0) }, (_, i) => from + i)

/**
 * First, last, and a window around the current page; a stretch of skipped pages
 * collapses to an ellipsis. Returns what to render, with `null` for a gap.
 *
 * The slot count is constant — first, last, current, `span` either side, and
 * two gaps. When one gap is not needed the window widens to spend the slot it
 * freed, so the control keeps its width and Next does not slide sideways under
 * the cursor as you page through.
 */
export function pageWindow(current: number, total: number, span = 1): (number | null)[] {
  const slots = span * 2 + 5
  if (total <= slots) return range(1, total)

  const left = Math.max(current - span, 1)
  const right = Math.min(current + span, total)
  const gapLeft = left > 2
  const gapRight = right < total - 1

  if (!gapLeft) return [...range(1, span * 2 + 3), null, total]
  if (!gapRight) return [1, null, ...range(total - (span * 2 + 2), total)]
  return [1, null, ...range(left, right), null, total]
}

export default function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number
  totalPages: number
  basePath: string
}) {
  if (totalPages <= 1) return null

  return (
    <nav className={styles.nav} aria-label="Blog pages">
      {page > 1 ? (
        <Link href={href(basePath, page - 1)} className={styles.step} rel="prev">
          ← Prev
        </Link>
      ) : (
        <span className={`${styles.step} ${styles.disabled}`} aria-hidden="true">
          ← Prev
        </span>
      )}

      <ol className={styles.pages}>
        {pageWindow(page, totalPages).map((entry, index) =>
          entry === null ? (
            // A gap has no identity of its own; its position in the window is
            // the only thing that distinguishes one from the other.
            <li key={`gap-${index}`} className={styles.gap} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={entry}>
              {entry === page ? (
                <span className={`${styles.page} ${styles.current}`} aria-current="page">
                  {entry}
                </span>
              ) : (
                <Link
                  href={href(basePath, entry)}
                  className={styles.page}
                  aria-label={`Page ${entry}`}
                >
                  {entry}
                </Link>
              )}
            </li>
          )
        )}
      </ol>

      {page < totalPages ? (
        <Link href={href(basePath, page + 1)} className={styles.step} rel="next">
          Next →
        </Link>
      ) : (
        <span className={`${styles.step} ${styles.disabled}`} aria-hidden="true">
          Next →
        </span>
      )}
    </nav>
  )
}

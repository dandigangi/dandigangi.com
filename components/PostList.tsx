import Link from 'next/link'
import { getTagHues, type Post } from '@/lib/blog'
import { formatFullDate, formatTag } from '@/lib/format'
import styles from './PostList.module.css'

export default function PostList({ posts, activeTag }: { posts: Post[]; activeTag?: string }) {
  const hues = getTagHues()

  /**
   * On a tag page the meta shows the tag you are filtering by, not the post's
   * first one. A post tagged engineering-management and hiring, listed under
   * hiring, was labelling itself "Engineering Management" — which reads as the
   * filter having failed. Falls back to the first tag everywhere else.
   */
  const shown = (post: Post) =>
    activeTag && post.tags.includes(activeTag) ? activeTag : post.tags[0]

  if (posts.length === 0) {
    return (
      <p className="label" style={{ padding: '48px 0' }}>
        No posts found.
      </p>
    )
  }

  return (
    <div className={styles.list} data-cameo>
      {posts.map((post) => (
        <Link key={post.slug} href={post.permalink} className={styles.row}>
          <div className={styles.rowMain}>
            <h2 className={styles.title}>{post.title}</h2>
            {post.summary ? <p className={styles.summary}>{post.summary}</p> : null}
          </div>
          <div className={`meta ${styles.rowMeta}`}>
            {formatFullDate(post.date)}
            {shown(post) && (
              <>
                {' · '}
                {/* Same hue the tag's chip carries above, so the eye can link
                    the row to the filter without reading either. */}
                <span className={styles.rowTag} data-hue={hues[shown(post)]}>
                  {formatTag(shown(post))}
                </span>
              </>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

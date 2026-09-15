import Link from 'next/link'
import type { Post } from '@/lib/blog'
import { formatFullDate } from '@/lib/format'
import styles from './PostList.module.css'

export default function PostList({ posts }: { posts: Post[] }) {
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
            {post.tags[0] ? ` · ${post.tags[0]}` : ''}
          </div>
        </Link>
      ))}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from '@/components/Link'

type PostSummary = { slug: string; title: string }

/** Fisher–Yates shuffle; returns a new array. */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export default function ReadMorePosts({ posts }: { posts: PostSummary[] }) {
  const initialFive = posts.slice(0, 5)
  const [displayPosts, setDisplayPosts] = useState<PostSummary[]>(initialFive)

  useEffect(() => {
    setDisplayPosts(shuffle(posts).slice(0, 5))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shuffle once on mount
  }, [])

  return (
    <ul className="list-none space-y-1.5 text-base">
      {displayPosts.map((post) => {
        const { slug, title } = post
        return (
          <li key={slug} className="min-w-0 overflow-hidden">
            <Link
              href={`/blog/${slug}`}
              className="block truncate text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={`Blog post "${title}"`}
              title={title}
            >
              {title}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

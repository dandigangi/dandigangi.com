import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { getPublishedPosts, getPostBySlug, getAdjacentPosts, type Post } from '@/lib/blog'
import { formatMonthYear, formatTag } from '@/lib/format'
import MDXContent from '@/components/MDXContent'
import SiteNav from '@/components/SiteNav'
import { XIcon, LinkedInIcon, MailIcon } from '@/components/Icons'
import styles from './post.module.css'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: post.canonicalUrl || post.permalink },
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.lastmod || post.date).toISOString(),
      url: post.permalink,
      // No `images` here on purpose: opengraph-image.tsx generates a per-post
      // card, and an explicit value would shadow that file convention.
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
    },
  }
}

function PostMedia({ post }: { post: Post }) {
  const media = post.media
  if (!media || media.type === 'none') return null

  if (media.type === 'cover' && media.image) {
    return (
      <div className={`rail ${styles.mediaSplit}`}>
        <div className={styles.mediaMain}>
          <Image
            src={media.image}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 75vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <aside className={styles.mediaAside}>
          <span className="label">In this post</span>
          <PostTocLinks post={post} />
        </aside>
      </div>
    )
  }

  if (media.type === 'video' && media.video) {
    return (
      <div className={`rail ${styles.mediaSplit}`}>
        <div className={styles.mediaMain}>
          <iframe
            src={media.video.url}
            title={post.title}
            allowFullScreen
            className={styles.embed}
          />
        </div>
        <aside className={styles.mediaAside}>
          <span className="label">Watch &amp; listen</span>
          <div className={styles.sourceList}>
            {(media.sources ?? []).map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sourceRow}
              >
                <span>{source.label}</span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          {media.video.duration ? <span className="meta">{media.video.duration}</span> : null}
        </aside>
      </div>
    )
  }

  return null
}

function PostTocLinks({ post }: { post: Post }) {
  const entries = Array.isArray(post.toc) ? post.toc.slice(0, 6) : []
  if (entries.length === 0) return null
  return (
    <nav className={styles.sourceList}>
      {entries.map((entry) => (
        <a key={entry.url} href={entry.url} className={styles.sourceRow}>
          <span>{entry.title}</span>
        </a>
      ))}
    </nav>
  )
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post || post.draft) notFound()

  const { prev, next } = getAdjacentPosts(post.slug)
  const published = getPublishedPosts()
  const shareUrl = `${siteMetadata.siteUrl}${post.permalink}`
  const readingTime = Math.max(1, Math.round(post.metadata.readingTime))

  const shareLinks = [
    {
      label: 'Share on X',
      href: `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`,
      Icon: XIcon,
    },
    {
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      Icon: LinkedInIcon,
    },
    {
      label: 'Share by email',
      href: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareUrl)}`,
      Icon: MailIcon,
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.structuredData) }}
      />

      {/* Black bar keeps the top edge consistent with the banded pages in light mode. */}
      <div className="bleed">
        <div className={`rail ${styles.topBar}`}>
          <SiteNav />
        </div>
      </div>

      <article className="container">
        <header className={`rail ${styles.header}`}>
          <Link href="/blog" className="label">
            ← Blog
          </Link>
          <h1 className={styles.title}>{post.title}</h1>
          <div className="meta">
            {formatMonthYear(post.date)}
            {post.tags[0] ? ` · ${formatTag(post.tags[0])}` : ''}
            {` · ${readingTime} min read`}
          </div>
        </header>

        <PostMedia post={post} />

        <div className={`rail split ${styles.bodySplit}`}>
          <div className={`splitMain ${styles.body}`}>
            <MDXContent code={post.body} />
          </div>

          <aside className={`splitAside ${styles.aside}`}>
            {post.tags.length > 0 && (
              <div>
                <span className="label">Tags</span>
                <div className={styles.tags}>
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/blog/tags/${tag}`} className="chip">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div>
              <span className="label">Share</span>
              <div className={styles.share}>
                {shareLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={19} />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <nav className={styles.adjacent}>
          <div className={styles.adjacentCell}>
            {prev && (
              <Link href={prev.permalink}>
                <span className="label">← Previous</span>
                <h2 className={styles.adjacentTitle}>{prev.title}</h2>
              </Link>
            )}
          </div>
          <div className={`${styles.adjacentCell} ${styles.adjacentRight}`}>
            {next && (
              <Link href={next.permalink}>
                <span className="label">Next →</span>
                <h2 className={styles.adjacentTitle}>{next.title}</h2>
              </Link>
            )}
          </div>
        </nav>

        <div className={styles.cta}>
          <Link href="/blog" className="btn">
            All posts ({published.length}) →
          </Link>
        </div>
      </article>
    </>
  )
}

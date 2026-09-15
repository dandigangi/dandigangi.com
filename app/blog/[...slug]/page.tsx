import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { getPublishedPosts, getPostBySlug, getAdjacentPosts } from '@/lib/blog'
import { formatMonthYear, formatTag } from '@/lib/format'
import MDXContent from '@/components/MDXContent'
import SiteNav from '@/components/SiteNav'
import styles from './post.module.css'

type Props = { params: Promise<{ slug: string[] }> }

export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug.split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug.join('/'))
  if (!post) return {}

  const images = post.images?.length ? post.images : [siteMetadata.socialBanner]

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
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug.join('/'))
  if (!post || post.draft) notFound()

  const { prev, next } = getAdjacentPosts(post.slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.structuredData) }}
      />

      {/* Black bar keeps the top edge consistent with the banded pages in light mode. */}
      <div className="bleed">
        <div className={`rail ${styles.topBar}`} style={{ color: '#F5F4F1' }}>
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
            {` · ${Math.max(1, Math.round(post.metadata.readingTime))} min read`}
          </div>
        </header>

        <div className={`rail ${styles.body}`}>
          <MDXContent code={post.body} />
        </div>

        {post.tags.length > 0 && (
          <div className={`rail ${styles.tags}`}>
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog/tags/${tag}`} className="chip">
                {formatTag(tag)}
              </Link>
            ))}
          </div>
        )}

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
            All posts ({getPublishedPosts().length}) →
          </Link>
        </div>
      </article>
    </>
  )
}

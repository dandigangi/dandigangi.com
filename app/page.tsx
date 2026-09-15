import Link from 'next/link'
import siteMetadata from '@/data/siteMetadata'
import { getPublishedPosts, type Post } from '@/lib/blog'
import { formatMonthYear, formatTag } from '@/lib/format'
import SiteNav from '@/components/SiteNav'
import Parallax from '@/components/Parallax'
import { ArrowRight, PlayIcon } from '@/components/Icons'
import styles from './home.module.css'

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteMetadata.author,
  url: siteMetadata.siteUrl,
  jobTitle: siteMetadata.role,
  description: siteMetadata.description,
  email: `mailto:${siteMetadata.email}`,
  image: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
  sameAs: [siteMetadata.linkedin, siteMetadata.twitter, siteMetadata.github],
}

function PostRow({ post, align = 'left' }: { post: Post; align?: 'left' | 'right' }) {
  return (
    <Link
      href={post.permalink}
      className={`${styles.row} ${align === 'right' ? styles.rowRight : ''}`}
    >
      <h3 className={styles.rowTitle}>{post.title}</h3>
      <span className="meta">
        {formatMonthYear(post.date)}
        {post.tags[0] ? ` · ${formatTag(post.tags[0])}` : ''}
      </span>
    </Link>
  )
}

function VideoCard({ post }: { post: Post }) {
  const video = post.video!
  return (
    <div className={styles.videoCard}>
      {video.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={video.thumbnail} alt="" className={styles.videoThumb} />
      ) : null}
      <div className={styles.videoBody}>
        <div className={`meta ${styles.videoMeta}`}>
          <span>Watch · Latest talk</span>
          {video.duration ? <span>{video.duration}</span> : null}
        </div>
        <h3 className={styles.videoTitle}>{post.title}</h3>
        <Link href={post.permalink} className={styles.playRow}>
          <span className={styles.playButton}>
            <PlayIcon size={13} />
          </span>
          <span className="meta">
            {video.platform} · {formatMonthYear(post.date)}
          </span>
        </Link>
      </div>
    </div>
  )
}

export default function Home() {
  const published = getPublishedPosts()
  const featured = published.find((post) => post.video)
  const rest = published.filter((post) => post !== featured)

  const leftPosts = rest.slice(0, 4)
  const rightPosts = rest.slice(4, featured ? 6 : 8)

  return (
    <>
      <Parallax />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <section className={`bleed ${styles.hero}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/static/images/hero-render.jpg" alt="" className={styles.heroImage} />
        <div className={styles.heroScrim} />
        <div className={`rail ${styles.heroInner}`}>
          <SiteNav />
          <div className={styles.heroBottom}>
            <h1 className={styles.name}>
              Dan
              <br />
              DiGangi
            </h1>
            <div className={styles.identityRow}>
              <p className={styles.role}>
                Senior Software
                <br />
                Engineering Manager
              </p>
              <span className={styles.tagline}>{siteMetadata.tagline}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className={styles.grid}>
          <div className={styles.column}>
            <div className={`label ${styles.labelRow}`}>
              <span>Latest writing</span>
              <span>01 — {String(leftPosts.length).padStart(2, '0')}</span>
            </div>
            {leftPosts.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </div>

          <div className={styles.column}>
            {featured ? <VideoCard post={featured} /> : null}
            {rightPosts.map((post) => (
              <PostRow key={post.slug} post={post} align="right" />
            ))}
          </div>
        </div>

        <div className={styles.cta}>
          <Link href="/blog" className="btn">
            All posts ({published.length}) <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </>
  )
}

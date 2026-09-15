import Link from 'next/link'
import Image from 'next/image'
import siteMetadata from '@/data/siteMetadata'
import { projects } from '@/data/projects'
import { getPublishedPosts, type Post } from '@/lib/blog'
import { formatMonthYear, formatTag } from '@/lib/format'
import SiteNav from '@/components/SiteNav'
import { ArrowRight, PlayIcon } from '@/components/Icons'
import styles from './home.module.css'

const HOME_POST_COUNT = 5

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteMetadata.author,
  url: siteMetadata.siteUrl,
  jobTitle: siteMetadata.role,
  description: siteMetadata.description,
  email: `mailto:${siteMetadata.email}`,
  image: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Chicago', addressRegion: 'IL' },
  sameAs: [siteMetadata.linkedin, siteMetadata.twitter, siteMetadata.github],
}

function PostRow({ post }: { post: Post }) {
  return (
    <Link href={post.permalink} className={styles.row}>
      <h3 className={styles.rowTitle}>{post.title}</h3>
      <span className="meta">
        {formatMonthYear(post.date)}
        {post.tags[0] ? ` · ${formatTag(post.tags[0])}` : ''}
      </span>
    </Link>
  )
}

function VideoCard({ post }: { post: Post }) {
  const video = post.media!.video!
  // Branded art by default — a 16:9 video frame cropped to square lands badly
  // far more often than not. video-card.jpg is pre-cropped square, so it needs
  // no object-position nudging the way the wide hero render did.
  const thumbnail = video.thumbnail ?? '/static/images/video-card.jpg'
  return (
    // The whole card is the link. It was previously only the play row, which
    // made the thumbnail and title look interactive without being so.
    <Link href={post.permalink} className={styles.videoCard}>
      {/* The wrapper owns the square; next/image with explicit width/height
          writes inline sizing that overrides an aspect-ratio set on the img. */}
      <div className={styles.videoThumbWrap}>
        <Image src={thumbnail} alt="" fill sizes="200px" style={{ objectFit: 'cover' }} />
      </div>
      <div className={styles.videoBody}>
        <div className={`meta ${styles.videoMeta}`}>
          <span>Watch · Latest talk</span>
          {video.duration ? <span>{video.duration}</span> : null}
        </div>
        <h3 className={styles.videoTitle}>{post.title}</h3>
        <span className={styles.playRow}>
          <span className={styles.playButton}>
            <PlayIcon size={13} />
          </span>
          <span className="meta">
            {video.provider} · {formatMonthYear(post.date)}
          </span>
        </span>
      </div>
    </Link>
  )
}

export default function Home() {
  const published = getPublishedPosts()
  const featured = published.find((post) => post.media?.video)
  const listed = published.filter((post) => post !== featured).slice(0, HOME_POST_COUNT)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <section className={`bleed ${styles.hero}`}>
        <div className={styles.heroImageWrap}>
          <Image
            src="/static/images/hero-render.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: '62% 45%' }}
          />
        </div>
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
              <span>01 — {String(listed.length).padStart(2, '0')}</span>
            </div>
            {listed.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </div>

          <div className={styles.column}>
            {featured ? <VideoCard post={featured} /> : null}

            <div className={`label ${styles.labelRow} ${styles.labelRowRight}`}>
              <span>Projects</span>
            </div>
            <div className={styles.projects}>
              {projects.map((project) => (
                <a
                  key={project.title}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.project}
                >
                  <span className="meta">{project.eyebrow}</span>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDescription}>{project.description}</p>
                </a>
              ))}
            </div>
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

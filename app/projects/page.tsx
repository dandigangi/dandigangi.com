import Image from 'next/image'
import PageBand from '@/components/PageBand'
import siteMetadata from '@/data/siteMetadata'
import { projects } from '@/data/projects'
import { genPageMetadata } from 'app/seo'
import styles from './projects.module.css'

export const metadata = genPageMetadata({
  title: 'Projects',
  description:
    'Selected work from Dan DiGangi — open source for engineering managers and Chicago’s React conference.',
  alternates: { canonical: '/projects' },
})

/** Makes the list itself machine-readable, not just the page around it. */
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Projects',
  url: `${siteMetadata.siteUrl}/projects`,
  description: 'Open source, conferences, and side projects by Dan DiGangi.',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: project.title,
        description: project.description,
        url: project.url,
        author: { '@type': 'Person', name: siteMetadata.author },
      },
    })),
  },
}

export default function Projects() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <PageBand title="Projects" objectPosition="50% 45%" />

      <div className="container">
        <section className={`rail railSection ${styles.intro}`}>
          <span className="label">Selected work</span>
          <p className={styles.lede}>
            Platform and product work I led or built + the side projects I keep coming back to.
          </p>
        </section>

        {/* Two-up grid of the home page's video-card treatment: square art on
            the left, body on the right. The 1px gap over a --line background
            is what draws the hairlines between cells. */}
        <div className={styles.grid}>
          {projects.map((project) => (
            <a
              key={project.slug}
              id={project.slug}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.thumbWrap}>
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(max-width: 700px) 40vw, 200px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.body}>
                <span className="meta">{project.eyebrow}</span>
                <h2 className={styles.cardTitle}>{project.title}</h2>
                <p className={styles.cardDescription}>{project.description}</p>
                {/* A span, not an anchor: the card already is one and anchors
                    cannot nest. It is the affordance, not the link. */}
                <span className={styles.linkRow}>
                  <span>{project.linkLabel}</span>
                  <span aria-hidden="true">↗</span>
                </span>
              </div>
            </a>
          ))}
          {projects.length % 2 === 1 && <div className={styles.filler} aria-hidden="true" />}
        </div>
      </div>
    </>
  )
}

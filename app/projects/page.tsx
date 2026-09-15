import Image from 'next/image'
import PageBand from '@/components/PageBand'
import { projects } from '@/data/projects'
import { genPageMetadata } from 'app/seo'
import styles from './projects.module.css'

export const metadata = genPageMetadata({
  title: 'Projects',
  description:
    'Selected work from Dan DiGangi — open source for engineering managers and Chicago’s React conference.',
  alternates: { canonical: '/projects' },
})

export default function Projects() {
  return (
    <>
      <PageBand title="Projects" objectPosition="50% 45%" />

      <div className="container">
        <section className={`rail railSection ${styles.intro}`}>
          <span className="label">Selected work</span>
          <p className={styles.lede}>
            Platform and product work I led or built, plus the side projects I keep coming back to.
          </p>
        </section>

        <div className={`rail ${styles.list}`}>
          {projects.map((project) => (
            /* Not a single wrapping <a>: each entry carries its own set of
               links, and anchors cannot nest. */
            <article key={project.slug} id={project.slug} className={styles.row}>
              <div className={styles.rowBody}>
                <span className="label">{project.eyebrow}</span>
                <h2 className={styles.rowTitle}>{project.title}</h2>
                <p className={styles.rowDescription}>{project.description}</p>
                {project.links.length > 0 && (
                  <div className={styles.links}>
                    {project.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        <span>{link.label}</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
              {project.image ? (
                <div className={styles.rowImage}>
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 45vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </>
  )
}

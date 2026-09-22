import PageBand from '@/components/PageBand'
import ProjectTable from '@/components/ProjectTable'
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
        // A project with no URL yet is still a real entry; omitting the key is
        // correct, an empty string is not.
        ...(project.url ? { url: project.url } : {}),
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

      <PageBand title="Projects" titleSuffix="Selected work" compact objectPosition="80% 30%" />

      <div className="container">
        <div className={`rail ${styles.intro}`}>
          <p className={styles.lede}>
            Platform and product work I led or built + the side projects I keep coming back to.
          </p>
          {/* Derived, not written down — the count and the row numbers come from
              the same collection, so they cannot disagree. */}
          <span className="label">{String(projects.length).padStart(2, '0')} entries</span>
        </div>

        <ProjectTable projects={projects} />
      </div>
    </>
  )
}

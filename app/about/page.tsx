import Link from 'next/link'
import PageBand from '@/components/PageBand'
import Portrait from '@/components/Portrait'
import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'
import { RESUME_PDF_URL } from '@/data/resume'
import {
  aboutOverview,
  aboutExperience,
  aboutIndustries,
  aboutCoaching,
  aboutLongerStory,
} from '@/data/about'
import styles from './about.module.css'

export const metadata = genPageMetadata({
  title: 'About',
  description:
    'Dan DiGangi — senior software engineering manager in Chicago building diverse, high performance teams.',
  alternates: { canonical: '/about' },
})

const elsewhere = [
  { href: '/resume', title: 'Résumé' },
  { href: '/blog', title: 'Blog' },
  { href: '/contact', title: 'Contact' },
]

/** About is the one page whose rail labels are display headings, not mono labels. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={`railSection ${styles.section}`}>
      <h2 className={styles.railHeading}>{title}</h2>
      <div>{children}</div>
    </section>
  )
}

export default function About() {
  return (
    <>
      <PageBand title="About" objectPosition="30% 60%" />

      <div className="container">
        {/* The sidebar is a page-level column, not part of Overview. Nesting it
            inside that one section forced the section to the taller of the two
            and left a void beside the short Overview prose; as a page column the
            rail sections below simply flow up alongside it. */}
        <div className={styles.page}>
          <div className={styles.pageMain} data-cameo>
            <Section title="Overview">
              <p className={styles.lede}>{aboutOverview.lede}</p>
              <blockquote className={styles.pullQuote}>{aboutOverview.pullQuote}</blockquote>
              <p className={styles.body}>{aboutOverview.support}</p>
            </Section>

            <Section title="Experience">
              <p className={`meta ${styles.headlineRow}`}>
                {aboutExperience.headline.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </p>
              {aboutExperience.paragraphs.map((paragraph) => (
                <p key={paragraph} className={styles.body}>
                  {paragraph}
                </p>
              ))}
            </Section>

            <Section title="Industries & projects">
              <div className={styles.listBlock}>
                <span className="label">Industries</span>
                <p className={styles.body}>{aboutIndustries.industries.join(', ')}</p>
              </div>
              <div className={styles.listBlock}>
                <span className="label">Project types</span>
                <p className={styles.body}>{aboutIndustries.projectTypes.join(', ')}</p>
              </div>
              <div className={styles.listBlock}>
                <span className="label">Additional experience</span>
                <p className={styles.body}>{aboutIndustries.additional.join(', ')}</p>
              </div>
            </Section>

            <Section title="Coaching & volunteering">
              <p className={styles.body}>{aboutCoaching.intro}</p>
              <div className={styles.listBlock}>
                <span className="label">Mentoring platforms</span>
                <p className={styles.body}>{aboutCoaching.mentoring.join(' · ')}</p>
              </div>
              <div className={styles.listBlock}>
                <span className="label">Volunteering</span>
                <ul className={styles.bulletList}>
                  {aboutCoaching.volunteering.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <p className={styles.body}>{aboutCoaching.closing}</p>
            </Section>

            <Section title="The longer story">
              {aboutLongerStory.map((paragraph) => (
                <p key={paragraph} className={styles.body}>
                  {paragraph}
                </p>
              ))}
            </Section>

            <section className={`railSection ${styles.section} ${styles.lastSection}`}>
              <h2 className={styles.railHeading}>Elsewhere</h2>
              <div>
                {elsewhere.map((item) => (
                  <Link key={item.href} href={item.href} className={styles.elsewhereRow}>
                    <span>{item.title}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className={styles.aside} data-cameo>
            <Portrait />
            <a
              href={siteMetadata.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              LinkedIn
            </a>
            <a href={RESUME_PDF_URL} target="_blank" rel="noopener noreferrer" className="btn">
              Download PDF
            </a>
            <div>
              <span className="label">Currently</span>
              <p className={styles.asideItem}>{aboutOverview.currently}</p>
            </div>
            <div>
              <span className="label">Previously</span>
              <ul className={styles.asideList}>
                {aboutOverview.previously.map((company) => (
                  <li key={company}>{company}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

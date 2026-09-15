import Link from 'next/link'
import Image from 'next/image'
import PageBand from '@/components/PageBand'
import { genPageMetadata } from 'app/seo'
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
    <section className="rail railSection">
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
        <section className="rail railSection">
          <h2 className={styles.railHeading}>Overview</h2>
          <div className="split">
            <div className="splitMain">
              <p className={styles.lede}>{aboutOverview.lede}</p>
              <blockquote className={styles.pullQuote}>{aboutOverview.pullQuote}</blockquote>
              <p className={styles.body}>{aboutOverview.support}</p>
            </div>
            <aside className={`splitAside ${styles.aside}`}>
              <div className={styles.portrait}>
                <Image
                  src="/static/images/dan-digangi-portrait.jpg"
                  alt="Dan DiGangi"
                  width={400}
                  height={400}
                  sizes="(max-width: 700px) 100vw, 300px"
                  priority
                />
                <span className="meta">Dan DiGangi · Chicago</span>
              </div>
              <Link href="/resume" className="btn">
                View Résumé
              </Link>
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
        </section>

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

        <section className={`rail railSection ${styles.lastSection}`}>
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
    </>
  )
}

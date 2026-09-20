import siteMetadata from '@/data/siteMetadata'
import {
  resumeSummary,
  resumeExperience,
  resumeEducation,
  resumeOther,
  RESUME_PDF_URL,
  RESUME_PDF_ENABLED,
} from '@/data/resume'
import Image from 'next/image'
import PageBand from '@/components/PageBand'
import Tagline from '@/components/Tagline'
import { ArrowRight } from '@/components/Icons'
import { genPageMetadata } from 'app/seo'
import styles from './resume.module.css'

export const metadata = genPageMetadata({
  title: 'Résumé',
  description:
    "Dan DiGangi's engineering leadership experience — Postmark, Arrive Logistics, DocuSign, and OpenLane.",
  alternates: { canonical: '/resume' },
})

/** Empty until the marks exist, so the layout is already reserving the space. */
function RoleLogo({ src, name }: { src?: string; name: string }) {
  return (
    <div className={styles.logo}>
      {src ? <Image src={src} alt="" width={30} height={30} /> : null}
      <span className="srOnly">{name}</span>
    </div>
  )
}

/**
 * The private build swaps in a personal address via RESUME_EMAIL, a
 * server-only variable that is never committed and is never set on Vercel — so
 * the deployed site and the public PDF always carry the Proton address.
 */
const contactEmail = process.env.RESUME_EMAIL || siteMetadata.email

export default function Resume() {
  return (
    <>
      <PageBand title="Résumé" objectPosition="70% 35%">
        {/* Column, because PageBand's bottom row lays its children out side by
            side and the line belongs above the buttons rather than beside. */}
        <div className={styles.bandStack}>
          <Tagline />
          <div className={styles.bandActions}>
            <a
              href={siteMetadata.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btnBand"
            >
              LinkedIn
            </a>
            {RESUME_PDF_ENABLED && (
              <a
                href={RESUME_PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btnBand"
              >
                Download PDF
              </a>
            )}
          </div>
        </div>
      </PageBand>

      {/* The band carries the name and actions on screen, but it is an image
          and is dropped from print. Paper needs its own masthead. */}
      <header className={styles.printHeader} data-print="only">
        {/* Name and tagline share a row on the same baseline; role and contact
            run underneath the pair. */}
        <div className={styles.printTopRow}>
          {/* The band above already carries the page's h1. On paper that band
              is gone and this is the heading, but it is still the same page —
              so it is a <p> and the document keeps exactly one h1. */}
          <p className={styles.printName}>{siteMetadata.author}</p>
          <p className={styles.printTagline}>{siteMetadata.tagline}</p>
        </div>
        <p className={styles.printRole}>{siteMetadata.role}</p>
        <p className={styles.printContact}>
          {siteMetadata.location} · {contactEmail} · {siteMetadata.siteUrl.replace('https://', '')}{' '}
          · {siteMetadata.linkedin.replace('https://www.', '')}
        </p>
      </header>

      <div className="container">
        {/* Dropped from print: the masthead above already carries the role,
            location and contact line. */}
        <section className={`rail railSection`} data-cameo data-print="hide">
          <span className="label">Summary</span>
          <div>
            <p className={styles.lede}>{resumeSummary}</p>
            <p className={`meta ${styles.summaryMeta}`}>
              <span>{siteMetadata.location}</span>
              <span aria-hidden="true">·</span>
              <a href={`mailto:${siteMetadata.email}`}>{siteMetadata.email}</a>
              <span aria-hidden="true">·</span>
              <span>{siteMetadata.tagline}</span>
            </p>
          </div>
        </section>

        <section className={`rail railSection`} data-cameo>
          <span className="label">Experience</span>
          <div>
            {resumeExperience.map((role) => (
              <article
                key={`${role.company}-${role.dates}`}
                className={styles.role}
                data-print-keep
              >
                <RoleLogo src={role.logo} name={role.company} />
                <div className={styles.roleMain}>
                  <h2 className={styles.roleTitle}>{role.title}</h2>
                  <p className={styles.company}>
                    {role.url ? (
                      <a href={role.url} target="_blank" rel="noopener noreferrer">
                        {role.company}
                      </a>
                    ) : (
                      role.company
                    )}
                  </p>
                  <ul className={styles.achievements}>
                    {role.achievements.map((achievement) => (
                      <li key={achievement}>{achievement}</li>
                    ))}
                  </ul>
                </div>
                <div className={`meta ${styles.dates}`}>{role.dates}</div>
              </article>
            ))}
          </div>
        </section>

        <section className={`rail railSection`} data-cameo>
          <span className="label">Education</span>
          <div>
            <article className={`${styles.role} ${styles.roleNoLogo}`} data-print-keep>
              <div className={styles.roleMain}>
                <h2 className={styles.roleTitle}>{resumeEducation.credential}</h2>
                <p className={styles.company}>{resumeEducation.institution}</p>
              </div>
              <div className={`meta ${styles.dates}`}>{resumeEducation.dates}</div>
            </article>
          </div>
        </section>

        <section className={`rail railSection`} data-cameo>
          <span className="label">Other</span>
          <ul className={styles.other}>
            {resumeOther.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Repeats the band's actions at the end of a long page, so the reader
            does not have to scroll back up to act on what they just read. */}
        <div className={styles.cta} data-print="hide">
          <a href={siteMetadata.linkedin} target="_blank" rel="noopener noreferrer" className="btn">
            LinkedIn <ArrowRight size={14} />
          </a>
          {RESUME_PDF_ENABLED && (
            <a href={RESUME_PDF_URL} target="_blank" rel="noopener noreferrer" className="btn">
              Download PDF <ArrowRight size={14} />
            </a>
          )}
        </div>
      </div>
    </>
  )
}

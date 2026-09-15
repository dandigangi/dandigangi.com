import siteMetadata from '@/data/siteMetadata'
import {
  resumeSummary,
  resumeExperience,
  resumeEducation,
  resumeOther,
  RESUME_PDF_URL,
} from '@/data/resume'
import { aboutCourses } from '@/data/about'
import PageBand from '@/components/PageBand'
import { genPageMetadata } from 'app/seo'
import styles from './resume.module.css'

export const metadata = genPageMetadata({
  title: 'Résumé',
  description:
    "Dan DiGangi's engineering leadership experience — Postmark, ActiveCampaign, Arrive Logistics, DocuSign, and OpenLane.",
  alternates: { canonical: '/resume' },
})

export default function Resume() {
  return (
    <>
      <PageBand title="Résumé" objectPosition="70% 35%">
        <div className={styles.bandActions}>
          <a
            href={RESUME_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btnBand"
          >
            Download PDF
          </a>
          <a
            href={siteMetadata.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btnBand"
          >
            LinkedIn
          </a>
        </div>
      </PageBand>

      <div className="container">
        <section className={`rail railSection`}>
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

        <section className={`rail railSection`}>
          <span className="label">Experience</span>
          <div>
            {resumeExperience.map((role) => (
              <article key={`${role.company}-${role.dates}`} className={styles.role}>
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

        <section className={`rail railSection`}>
          <span className="label">Education</span>
          <div>
            <article className={styles.role}>
              <div className={styles.roleMain}>
                <h2 className={styles.roleTitle}>{resumeEducation.credential}</h2>
                <p className={styles.company}>{resumeEducation.institution}</p>
              </div>
              <div className={`meta ${styles.dates}`}>{resumeEducation.dates}</div>
            </article>

            <article className={styles.role}>
              <div className={styles.roleMain}>
                <h2 className={styles.roleTitle}>Continuing education</h2>
                <p className={styles.company}>LinkedIn Learning</p>
                <ul className={styles.achievements}>
                  {aboutCourses.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section className={`rail railSection ${styles.lastSection}`}>
          <span className="label">Other</span>
          <ul className={styles.other}>
            {resumeOther.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

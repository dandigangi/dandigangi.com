import PageBand from '@/components/PageBand'
import { resumeXp, resumeOther } from '@/data/resume'
import { genPageMetadata } from 'app/seo'
import styles from './resume.module.css'

export const metadata = genPageMetadata({
  title: 'Résumé',
  description:
    "Dan DiGangi's engineering management and software engineering experience, speaking, and focus areas.",
  alternates: { canonical: '/resume' },
})

const DOWNLOAD_HREF =
  'https://drive.google.com/file/d/1aMeWulQo0745ip7tWXLliIuuwJm_Ns3S/view?usp=sharing'

type Experience = {
  id: number
  company: string
  url?: string
  jobTitle: string
  dates: string
  descriptions: string[]
}

export default function Resume() {
  return (
    <>
      <PageBand title="Résumé" objectPosition="70% 35%">
        <a href={DOWNLOAD_HREF} target="_blank" rel="noopener noreferrer" className="btn">
          Download PDF
        </a>
      </PageBand>

      <div className="container">
        <section className={`rail ${styles.section}`}>
          <span className="label">Experience</span>
          <div className={styles.sectionBody}>
            {(resumeXp as Experience[]).map((job) => (
              <article key={job.id} className={styles.entry}>
                <div>
                  <h2 className={styles.role}>{job.jobTitle}</h2>
                  <p className={styles.company}>
                    {job.url ? (
                      <a href={job.url} target="_blank" rel="noopener noreferrer">
                        {job.company}
                      </a>
                    ) : (
                      job.company
                    )}
                  </p>
                  <ul className={styles.descriptions}>
                    {job.descriptions.map((description) => (
                      <li key={description}>{description}</li>
                    ))}
                  </ul>
                </div>
                <div className={`meta ${styles.dates}`}>{job.dates}</div>
              </article>
            ))}
          </div>
        </section>

        <section className={`rail ${styles.section}`}>
          <span className="label">What I do</span>
          <div className={styles.sectionBody}>
            <ul className={styles.other}>
              {(resumeOther as string[]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  )
}

'use client'

import Link from 'next/link'
import { RESUME_PDF_URL } from '@/data/resume'
import styles from './download.module.css'

/** Screen-only bar over the paper view; hidden by its own @media print rule. */
export default function PaperBar() {
  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <Link href="/" aria-label="Dan DiGangi — home" className={styles.mark}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/static/images/dan-digangi-logo-light.png" alt="Dan DiGangi" height={30} />
        </Link>
        <nav aria-label="Résumé">
          <ul className={styles.links}>
            <li>
              <Link href="/resume" className="navLink">
                Résumé
              </Link>
            </li>
            <li>
              <a
                href={RESUME_PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="navLink"
              >
                Download
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => window.print()}
                className={`navLink ${styles.print}`}
              >
                Print
              </button>
            </li>
            <li aria-hidden="true" className={`navLink ${styles.dash}`}>
              —
            </li>
            <li>
              <Link href="/" className="navLink">
                dandigangi.com
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

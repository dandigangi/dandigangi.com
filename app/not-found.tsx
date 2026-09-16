import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import siteMetadata from '@/data/siteMetadata'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <>
      <div className="bleed">
        <div className={`rail ${styles.topBar}`}>
          <SiteNav />
        </div>
      </div>

      <div className={`container rail ${styles.wrap}`}>
        <p className="label">Error 404</p>
        <h1 className={styles.code}>Not found</h1>
        <p className={styles.body}>
          This page isn&rsquo;t here anymore, or never was. I&rsquo;ll pretend to check the error
          logs.
        </p>
        <div className={styles.actions}>
          {/* First, as on /admin/lulz — the two pages share this row. */}
          <a href={siteMetadata.linkedin} target="_blank" rel="noopener noreferrer" className="btn">
            Hire Me
          </a>
          <Link href="/" className="btn">
            Home
          </Link>
          <Link href="/blog" className="btn">
            Read the blog
          </Link>
        </div>
      </div>
    </>
  )
}

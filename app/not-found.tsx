import Link from 'next/link'
import GoBack from '@/components/GoBack'
import SiteNav from '@/components/SiteNav'
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
        {/* Both ways out of a dead end, and nothing else: where you just were,
            or the front door. /admin/lulz has its own pair — that page is a
            punchline rather than a mistake, so it sells instead. */}
        <div className={styles.actions}>
          <GoBack />
          <Link href="/" className="btn">
            Home
          </Link>
        </div>
      </div>
    </>
  )
}

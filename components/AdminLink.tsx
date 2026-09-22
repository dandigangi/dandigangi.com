import Link from 'next/link'
import styles from './Footer.module.css'

/**
 * The faint way in. Navigates in place rather than opening a tab — it goes to a
 * page on this site, and the arrow that used to say otherwise has gone with it.
 *
 * No longer a client component: it only needed to be one to tell whether you
 * were already under /admin, which mattered only for the new-tab decision.
 */
export default function AdminLink() {
  return (
    <Link href="/admin" className={styles.admin}>
      Admin
    </Link>
  )
}

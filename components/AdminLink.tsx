'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Footer.module.css'

/**
 * The faint way in. A client component only so it can tell whether you are
 * already under /admin — opening a new tab from the page you are standing on
 * leaves a duplicate behind, which is worse than just navigating.
 */
export default function AdminLink() {
  const pathname = usePathname()
  const inside = pathname?.startsWith('/admin') ?? false

  return (
    <Link
      href="/admin"
      className={styles.admin}
      target={inside ? undefined : '_blank'}
      rel={inside ? undefined : 'noopener noreferrer'}
    >
      Admin <span aria-hidden="true">↗</span>
    </Link>
  )
}

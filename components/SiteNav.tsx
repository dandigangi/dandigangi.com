import Link from 'next/link'
import navLinks from '@/data/navLinks'
import { getPublishedPosts } from '@/lib/blog'
import { projects } from '@/data/projects'
import MobileNav from './MobileNav'
import NavMark from './NavMark'
import InvoiceLink from './InvoiceLink'
import styles from './SiteNav.module.css'

/**
 * Logo + primary nav. Used inside the home hero and inside the band that tops
 * every other page, so it never sets its own background.
 *
 * Below 560px the link row is hidden and MobileNav's sheet takes over. Both are
 * rendered: the row stays in the server markup so a crawler always sees the real
 * navigation, and only CSS decides which one a reader gets.
 */
export default function SiteNav({ logoHeight = 36 }: { logoHeight?: number }) {
  // Counted here rather than inside MobileNav, which is a client component —
  // only the two numbers cross the boundary, not the post index.
  const counts = {
    '/blog': getPublishedPosts().length,
    '/projects': projects.length,
  }

  return (
    <div
      className={styles.nav}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px 40px',
        flexWrap: 'wrap',
      }}
    >
      {/* One group, not two siblings. The row is space-between, so a star left
          loose beside the mark got pushed into the middle of the container. */}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <Link
          href="/"
          aria-label="Dan DiGangi — home"
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/static/images/dan-digangi-logo-light.png"
            alt="Dan DiGangi"
            height={logoHeight}
            className={styles.logo}
            style={{ height: logoHeight, width: 'auto', display: 'block' }}
          />
        </Link>

        <NavMark size={Math.round(logoHeight * 0.85)} />
      </span>

      <nav aria-label="Main" className={styles.links}>
        <ul
          style={{
            display: 'flex',
            // Centred rather than stretched, so a button and an anchor sit on
            // the same line rather than each on its own intrinsic baseline.
            alignItems: 'center',
            flexWrap: 'wrap',
            // Tighter than it reads: .navLink now carries its own padding for
            // the sake of the tap target, and that padding is most of the gap.
            gap: 'clamp(2px, 1.4vw, 16px) clamp(2px, 1.4vw, 16px)',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="navLink">
                {link.title}
              </Link>
            </li>
          ))}
          {/* Last, after Contact — he is not part of the site's navigation. */}
          <InvoiceLink tone="plain" />
        </ul>
      </nav>

      <MobileNav counts={counts} />
    </div>
  )
}

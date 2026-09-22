import Link from 'next/link'
import navLinks from '@/data/navLinks'
import { getPublishedPosts } from '@/lib/blog'
import { projects } from '@/data/projects'
import MobileNav from './MobileNav'
import PayPikachuLink from './PayPikachuLink'
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
      <Link href="/" aria-label="Dan DiGangi — home" style={{ display: 'inline-flex' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/static/images/dan-digangi-logo-light.png"
          alt="Dan DiGangi"
          height={logoHeight}
          className={styles.logo}
          style={{ height: logoHeight, width: 'auto', display: 'block' }}
        />
      </Link>

      <nav aria-label="Main" className={styles.links}>
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(10px, 2.6vw, 34px) clamp(12px, 2.6vw, 34px)',
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
          <PayPikachuLink tone="plain" />
        </ul>
      </nav>

      <MobileNav counts={counts} />
    </div>
  )
}

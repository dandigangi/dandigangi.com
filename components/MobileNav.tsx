'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import navLinks from '@/data/navLinks'
import siteMetadata from '@/data/siteMetadata'
import { menuHue } from '@/lib/ramp'
import { LinkedInIcon, XIcon, GitHubIcon, MailIcon } from './Icons'
import ThemeToggle from './ThemeToggle'
import styles from './MobileNav.module.css'

const socials = [
  { href: siteMetadata.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
  { href: siteMetadata.twitter, label: 'X', Icon: XIcon },
  { href: siteMetadata.github, label: 'GitHub', Icon: GitHubIcon },
  { href: `mailto:${siteMetadata.email}`, label: 'Email', Icon: MailIcon },
]

/**
 * The phone nav. Five mono links at 0.22em tracking need roughly 300px, which
 * leaves nothing beside the mark at 390px — so below the breakpoint the row is
 * replaced by this and the links move into a full-height sheet.
 *
 * A sheet rather than a dropdown: at display scale the links read like the rest
 * of the site's type instead of like a shrunken desktop nav, and there is room
 * for the footer content that a phone otherwise has to scroll to the bottom for.
 *
 * The desktop link row stays in the server-rendered markup and is hidden by CSS,
 * so nothing here affects what a crawler sees.
 */
export default function MobileNav({ counts }: { counts: Record<string, number> }) {
  const [open, setOpen] = useState(false)
  const sheet = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const close = () => setOpen(false)
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    // Tapping a link closes the sheet directly; this covers the other way the
    // route can change while it is open, which is the back gesture.
    window.addEventListener('popstate', close)

    // The sheet covers the viewport, so the page behind it must not scroll —
    // on iOS a scrollable body under a fixed overlay is what makes the overlay
    // feel like it is sliding around.
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    sheet.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('popstate', close)
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.toggle}
        data-open={open}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((current) => !current)}
      >
        {/* Two bars that rotate into the ✕ rather than swapping for a different
            icon, so the control visibly stays the same control. */}
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>

      {open && (
        <div className={styles.sheet} id="mobile-menu" ref={sheet} tabIndex={-1}>
          {/* The band's own mark is behind a 93% scrim, which leaves it at
              roughly 7% — present but grey. This is the same white asset drawn
              at the same coordinates, at full strength, so the sheet reads as
              the page rather than as a layer over it. Always the light variant:
              the sheet is black in both themes. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/static/images/dan-digangi-logo-light.png"
            alt=""
            className={styles.sheetLogo}
          />

          <span className={`label ${styles.menuLabel}`}>Menu</span>

          <nav aria-label="Main">
            <ul className={styles.list}>
              {navLinks.map((link, index) => (
                <li
                  key={link.href}
                  className={styles.item}
                  style={{ '--link-hue': menuHue(index, navLinks.length) } as React.CSSProperties}
                >
                  <Link href={link.href} className={styles.link} onClick={() => setOpen(false)}>
                    <span>{link.title}</span>
                    {counts[link.href] !== undefined && (
                      <span className={styles.count}>
                        {String(counts[link.href]).padStart(2, '0')}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.foot}>
            <div className={styles.socials}>
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.social}
                >
                  <Icon size={18} />
                </a>
              ))}
              <ThemeToggle />
            </div>
            <span className={`label ${styles.byline}`}>{siteMetadata.author}</span>
          </div>
        </div>
      )}
    </div>
  )
}

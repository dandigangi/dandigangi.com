import Link from 'next/link'
import navLinks from '@/data/navLinks'
import siteMetadata from '@/data/siteMetadata'
import ThemeToggle from './ThemeToggle'
import { LinkedInIcon, XIcon, GitHubIcon, MailIcon } from './Icons'

const socials = [
  { href: siteMetadata.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
  { href: siteMetadata.twitter, label: 'X', Icon: XIcon },
  { href: siteMetadata.github, label: 'GitHub', Icon: GitHubIcon },
  { href: `mailto:${siteMetadata.email}`, label: 'Email', Icon: MailIcon },
]

export default function Footer() {
  const hash = process.env.NEXT_PUBLIC_BUILD_HASH
  const date = process.env.NEXT_PUBLIC_BUILD_DATE

  return (
    <footer style={{ borderTop: '1px solid var(--line)' }}>
      <div
        className="rail"
        style={{
          maxWidth: 'var(--container)',
          margin: '0 auto',
          paddingTop: 26,
          paddingBottom: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px 40px',
        }}
      >
        <div className="label" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px' }}>
          <span>Dan DiGangi</span>
          {hash ? (
            <span title={date || undefined} style={{ opacity: 0.7 }}>
              {date ? `${date} · ` : ''}
              {hash}
            </span>
          ) : null}
        </div>

        <nav>
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px 30px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="navLink" style={{ fontSize: 13 }}>
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', transition: 'opacity .15s ease' }}
            >
              <Icon size={19} />
            </a>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}

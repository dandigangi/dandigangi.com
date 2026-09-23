import Link from 'next/link'
import navLinks from '@/data/navLinks'
import siteMetadata from '@/data/siteMetadata'
import InvoiceLink from './InvoiceLink'
import ThemeToggle from './ThemeToggle'
import { LinkedInIcon, XIcon, GitHubIcon, MailIcon } from './Icons'
import AdminLink from './AdminLink'
import { LedgerLink } from './Ledger'
import { TrailToggleLink } from './Trail'
import footer from './Footer.module.css'

const socials = [
  { href: siteMetadata.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
  { href: siteMetadata.twitter, label: 'X', Icon: XIcon },
  { href: siteMetadata.github, label: 'GitHub', Icon: GitHubIcon },
  { href: `mailto:${siteMetadata.email}`, label: 'Email', Icon: MailIcon },
]

export default function Footer() {
  const hash = process.env.NEXT_PUBLIC_BUILD_HASH
  const date = process.env.NEXT_PUBLIC_BUILD_DATE
  const version = process.env.NEXT_PUBLIC_BUILD_VERSION

  return (
    <footer style={{ borderTop: '1px solid var(--line)' }} data-print="hide">
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
        {/* Build stamp, as the previous site carried. Both values come from
            scripts/prebuild-env.mjs and are absent in dev, so the domain stands
            alone rather than rendering an empty bracket. */}
        <div
          className="label"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            letterSpacing: '0.14em',
          }}
        >
          <span>
            dandigangi.com
            {version ? <span> v{version}</span> : null}
          </span>
          {/* Text, not a link. It pointed at the commit on GitHub, and that
              repository is private — so for everyone but me it was a 404 with a
              build hash in it. The stamp still identifies the deploy. */}
          {hash ? (
            <span>
              {date ? `${date} ` : ''}[{hash}]
            </span>
          ) : date ? (
            <span>{date}</span>
          ) : null}

          {/* Its own line under the stamp, and fainter still — findable rather
              than advertised. The egg count sits beside it and is not hidden at
              all: by the time it exists you have already found something, so
              there is nothing left to keep quiet about. */}
          <span className={footer.adminRow}>
            <AdminLink />
            <LedgerLink className={footer.aside} />
            <TrailToggleLink className={footer.aside} />
          </span>
        </div>

        <nav aria-label="Elsewhere">
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              // See .navLink: its padding now carries most of this.
              gap: '2px 12px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            <InvoiceLink fontSize={13} />
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

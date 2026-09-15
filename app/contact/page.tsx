import Link from 'next/link'
import siteMetadata from '@/data/siteMetadata'
import PageBand from '@/components/PageBand'
import { genPageMetadata } from 'app/seo'
import styles from './contact.module.css'

export const metadata = genPageMetadata({
  title: 'Contact',
  description:
    'Get in touch with Dan DiGangi — open to speaking, podcast appearances, writing collaborations, and mentoring engineers and leaders.',
  alternates: { canonical: '/contact' },
})

const channels = [
  { label: 'Email', value: siteMetadata.email, href: `mailto:${siteMetadata.email}` },
  { label: 'LinkedIn', value: 'linkedin.com/in/dandigangi', href: siteMetadata.linkedin },
  { label: 'X', value: '@dandigangi', href: siteMetadata.twitter },
]

const reasons = [
  'Speaking, podcasts, and livestreams',
  'Writing and collaborations',
  'Coaching and mentoring engineers or leaders',
  'Hiring, interviewing, and career questions',
]

export default function Connect() {
  return (
    <>
      <PageBand title="Contact" objectPosition="50% 70%" />

      <div className="container">
        <div className={`rail ${styles.grid}`}>
          <div>
            <p className={styles.lede}>
              The best way to reach me day to day is X or LinkedIn. Email works better for anything
              longer or detailed.
            </p>

            <div className={styles.channels}>
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className={styles.channel}
                >
                  <span className={styles.channelValue}>{channel.value}</span>
                  <span className="label">{channel.label}</span>
                </a>
              ))}
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div>
              <span className="label">Based in</span>
              <p className={styles.sidebarBody}>{siteMetadata.location} · Central time</p>
            </div>
            <div>
              <span className="label">Good reasons to write</span>
              <ul className={styles.reasons}>
                {reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
            <p className={styles.sidebarBody}>
              <Link href="/blog" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
                Examples of past work
              </Link>{' '}
              are on the blog.
            </p>
          </aside>
        </div>
      </div>
    </>
  )
}

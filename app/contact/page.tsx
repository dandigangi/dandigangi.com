import siteMetadata from '@/data/siteMetadata'
import PageBand from '@/components/PageBand'
import { genPageMetadata } from 'app/seo'
import styles from './contact.module.css'

export const metadata = genPageMetadata({
  title: 'Contact',
  description:
    'Get in touch with Dan DiGangi — open to senior engineering leadership roles, speaking, podcasts, and mentoring.',
  alternates: { canonical: '/contact' },
})

const channels = [
  { label: 'Email', value: siteMetadata.email, href: `mailto:${siteMetadata.email}` },
  { label: 'LinkedIn', value: 'linkedin.com/in/dandigangi', href: siteMetadata.linkedin },
  { label: 'X', value: 'x.com/dandigangi', href: siteMetadata.twitter },
  { label: 'GitHub', value: 'github.com/dandigangi', href: siteMetadata.github },
]

const reasons = [
  'Engineering leadership roles',
  'Podcast or webinar guest',
  'Mentoring an engineer or manager',
  'Speaking and writing',
]

const mentoring = ['Plato', 'MentorCruise', 'Private']

export default function Contact() {
  return (
    <>
      <PageBand title="Contact" objectPosition="50% 70%" />

      <div className="container">
        <div className={`rail ${styles.grid}`}>
          <div>
            <p className={styles.lede}>
              Open to senior engineering leadership roles, and always happy to talk hiring, teams,
              or developer platforms.
            </p>

            <div className={styles.channels}>
              {channels.map((channel) => {
                const isMail = channel.href.startsWith('mailto:')
                return (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={isMail ? undefined : '_blank'}
                    rel={isMail ? undefined : 'noopener noreferrer'}
                    className={styles.channel}
                  >
                    <span className={styles.channelValue}>{channel.value}</span>
                    <span className="label">{channel.label}</span>
                  </a>
                )
              })}
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div>
              <span className="label">Based in</span>
              <p className={styles.sidebarBody}>{siteMetadata.location} · Central time</p>
            </div>
            <div>
              <span className="label">Good reasons to write</span>
              <ul className={styles.list}>
                {reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="label">Mentoring</span>
              <p className={styles.sidebarBody}>{mentoring.join(' · ')}</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

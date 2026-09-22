import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import EggToast from '@/components/EggToast'
import SiteNav from '@/components/SiteNav'
import { PIKA_PASS } from '@/lib/pikaPass'
import siteMetadata from '@/data/siteMetadata'
import Gate from '../Gate'
import PikaTheme from '../PikaTheme'
import gate from '../gate.module.css'
import styles from '../../not-found.module.css'

/**
 * /admin gets the joke and /admin/lulz its punchline. Anything else below
 * /admin gets a real 404, which is the point: the editor must not exist outside
 * development, and a page answering 200 at /admin/write would say it does. In
 * production that path is not a route at all — `dev.tsx` is not a page
 * extension there — so it lands here and is refused; while developing, the
 * static /admin/write segment wins over this catch-all and never reaches it.
 *
 * These two render rather than calling notFound(), so they answer 200. A nested
 * not-found.tsx does not catch a notFound() thrown by a catch-all — it bubbles
 * past to the root one — and branching the root on usePathname() left
 * production serving the ordinary 404 until hydration, because the pathname is
 * empty while a prerendered 404 is being server-rendered. Both are noindexed
 * instead.
 */
const LULZ = 'lulz'

const isLulz = (rest?: string[]) => rest?.length === 1 && rest[0] === LULZ

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rest?: string[] }>
}): Promise<Metadata> {
  const { rest } = await params
  return {
    title: isLulz(rest) ? 'Lulz no' : 'Admin',
    robots: { index: false, follow: false },
  }
}

export default async function AdminGate({
  params,
  searchParams,
}: {
  params: Promise<{ rest?: string[] }>
  searchParams: Promise<{ pika?: string }>
}) {
  const { rest } = await params
  if (rest?.length && !isLulz(rest)) notFound()

  const lulz = isLulz(rest)
  /**
   * Two ways in, and both mean the same thing: the query param is the moment of
   * the guess, the cookie is the hour that follows it. The param is kept as
   * well as the cookie so that blocked cookies still get the reveal once.
   *
   * Only ever consulted on the lulz page — he is the punchline, not the prompt
   * — and the cookie's own Path keeps it away from the rest of the site.
   */
  const pika = lulz && ((await searchParams).pika === '1' || (await cookies()).has(PIKA_PASS))

  return (
    <>
      {pika && <PikaTheme />}

      {/* Same acknowledgement the blog-search egg gets. Rendered here rather
          than on the gate: the gate navigates away a couple of seconds after
          the guess lands, which would cut the toast off mid-read. */}
      <EggToast egg="admin" show={pika} />

      {pika && (
        <div className={gate.pikaLayer} aria-hidden="true">
          <Image
            src="/static/images/pikachu-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: '50% 28%' }}
          />
          <div className={gate.pikaScrim} />
        </div>
      )}

      <div className="bleed">
        <div className={`rail ${styles.topBar}`}>
          <SiteNav />
        </div>
      </div>

      <div className={`container rail ${styles.wrap}`}>{lulz ? <Lulz /> : <Gate />}</div>
    </>
  )
}

function Lulz() {
  return (
    <>
      <p className="label">You serious?</p>
      <h1 className={styles.code}>Lulz no</h1>
      <p className={styles.body}>
        I&rsquo;ve done enough security work to not put this up in production. This is all fake.
        Rekt.
      </p>
      <div className={styles.actions}>
        <a href={siteMetadata.linkedin} target="_blank" rel="noopener noreferrer" className="btn">
          Hire Me
        </a>
        <Link href="/blog" className="btn">
          Read the Blog
        </Link>
      </div>
    </>
  )
}

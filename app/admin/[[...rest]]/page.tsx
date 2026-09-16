import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteNav from '@/components/SiteNav'
import Gate from '../Gate'
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

export default async function AdminGate({ params }: { params: Promise<{ rest?: string[] }> }) {
  const { rest } = await params
  if (rest?.length && !isLulz(rest)) notFound()

  return (
    <>
      <div className="bleed">
        <div className={`rail ${styles.topBar}`}>
          <SiteNav />
        </div>
      </div>

      <div className={`container rail ${styles.wrap}`}>{isLulz(rest) ? <Lulz /> : <Gate />}</div>
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
        <Link href="/" className="btn">
          Home
        </Link>
        <Link href="/blog" className="btn">
          Read the blog
        </Link>
      </div>
    </>
  )
}

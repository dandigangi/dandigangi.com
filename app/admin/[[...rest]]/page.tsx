import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SiteNav from '@/components/SiteNav'
import Gate from '../Gate'
import styles from '../../not-found.module.css'

/**
 * /admin gets the joke. Anything below it gets a real 404, which is the point:
 * the editor must not exist outside development, and a page that answered 200
 * at /admin/write would say it does. In production that path is not a route at
 * all — `dev.tsx` is not a page extension there — so it lands here and is
 * refused; while developing, the static /admin/write segment wins over this
 * catch-all and never reaches it.
 *
 * The /admin page itself renders rather than calling notFound(), so it answers
 * 200. A nested not-found.tsx does not catch a notFound() thrown by a catch-all
 * — it bubbles past to the root one — and branching the root on usePathname()
 * left production serving the ordinary 404 until hydration, because the
 * pathname is empty while a prerendered 404 is server-rendered. It is noindexed
 * instead.
 */
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default async function AdminGate({ params }: { params: Promise<{ rest?: string[] }> }) {
  const { rest } = await params
  if (rest?.length) notFound()

  return (
    <>
      <div className="bleed">
        <div className={`rail ${styles.topBar}`}>
          <SiteNav />
        </div>
      </div>

      <div className={`container rail ${styles.wrap}`}>
        <Gate />
      </div>
    </>
  )
}

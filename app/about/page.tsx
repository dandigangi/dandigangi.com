import Link from 'next/link'
import { authors } from '@/content'
import PageBand from '@/components/PageBand'
import MDXContent from '@/components/MDXContent'
import { genPageMetadata } from 'app/seo'
import styles from './about.module.css'

export const metadata = genPageMetadata({
  title: 'About',
  description:
    'Dan DiGangi — senior software engineering manager in Chicago building diverse, high performance teams.',
  alternates: { canonical: '/about' },
})

export default function About() {
  const author = authors.find((a) => a.slug === 'default') ?? authors[0]

  return (
    <>
      <PageBand title="About" objectPosition="30% 60%" />

      <div className="container">
        <div className={`rail ${styles.grid}`}>
          <div className={styles.body}>
            <MDXContent code={author.body} />
          </div>

          <aside className={styles.sidebar}>
            <Link href="/resume" className="btn">
              View Résumé
            </Link>
          </aside>
        </div>

        <div className={`rail ${styles.elsewhere}`}>
          <span className="label">Elsewhere</span>
          <div>
            {[
              { href: '/resume', title: 'Résumé' },
              { href: '/contact', title: 'Contact' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={styles.elsewhereRow}>
                <span>{item.title}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

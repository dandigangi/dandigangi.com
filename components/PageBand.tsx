import Image from 'next/image'
import PikachuHero from './PikachuHero'
import SiteNav from './SiteNav'
import styles from './PageBand.module.css'

/**
 * The graphic band that tops every page except home and blog posts.
 * Only `objectPosition` varies per page — the render itself is shared.
 */
export default function PageBand({
  title,
  objectPosition = '20% 40%',
  children,
}: {
  title: string
  objectPosition?: string
  children?: React.ReactNode
}) {
  return (
    <section className={`bleed ${styles.band}`}>
      <div className={styles.imageWrap}>
        <Image
          src="/static/images/hero-render.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition }}
        />
        <PikachuHero objectPosition="50% 49%" />
      </div>
      <div className={styles.scrim} />
      <div className={`rail ${styles.inner}`}>
        <SiteNav />
        <div className={styles.bottom}>
          <h1 className={styles.title}>{title}</h1>
          {children}
        </div>
      </div>
    </section>
  )
}

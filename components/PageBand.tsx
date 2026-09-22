import Image from 'next/image'
import PikachuHero from './PikachuHero'
import SiteNav from './SiteNav'
import styles from './PageBand.module.css'

/**
 * The band title is set in a viewport clamp, which knows nothing about how many
 * characters it has to fit. "Blog" at 104px is the design; "Engineering
 * Management" at 104px is two lines of shouting that dwarfs the page under it.
 * So the ceiling comes down as the title gets longer — the clamp still handles
 * the viewport, this only handles the string.
 *
 * Steps rather than a formula: a continuous fit makes near-identical titles
 * render at visibly different sizes, which reads as a bug rather than a system.
 */
function titleCeiling(title: string, base: number): number {
  const length = title.length
  if (length <= 10) return base
  if (length <= 16) return Math.round(base * 0.86)
  if (length <= 24) return Math.round(base * 0.72)
  return Math.round(base * 0.58)
}

/** The design's ceiling for a page title. */
const BASE_CEILING = 104

/**
 * The graphic band that tops every page except home and blog posts.
 * Only `objectPosition` varies per page — the render itself is shared.
 */
export default function PageBand({
  title,
  /**
   * Rendered inside the h1, so "Engineering Management" + "Blog Posts" is one
   * heading to a screen reader and to the document outline — a second element
   * beside it would read as a page with two titles.
   */
  titleSuffix,
  /**
   * The 20%-down ceiling, used by any page that carries a `titleSuffix`. The
   * suffix is sized in `em`, so a title at the full 104px ceiling renders its
   * companion 25% larger than the same pairing on a tag page — which read as
   * two different treatments. Both now start from the same base.
   */
  compact = false,
  objectPosition = '20% 40%',
  children,
}: {
  title: string
  titleSuffix?: string
  compact?: boolean
  objectPosition?: string
  children?: React.ReactNode
}) {
  const ceiling = titleCeiling(title, compact ? Math.round(BASE_CEILING * 0.8) : BASE_CEILING)

  return (
    <section className={`bleed ${styles.band}`} data-print="hide">
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
          <h1
            className={styles.title}
            style={{ '--band-title-max': `${ceiling}px` } as React.CSSProperties}
          >
            {title}
            {/* The space is explicit: the suffix is inline-block with a margin,
                so without it the accessible name runs the two words together. */}
            {titleSuffix && (
              <>
                {' '}
                <span className={styles.titleSuffix}>{titleSuffix}</span>
              </>
            )}
          </h1>
          {children}
        </div>
      </div>
    </section>
  )
}

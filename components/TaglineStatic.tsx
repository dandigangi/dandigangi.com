import siteMetadata from '@/data/siteMetadata'
import styles from './Tagline.module.css'

/**
 * The canonical line, sitting still.
 *
 * The About band uses this rather than the interactive pill because that page
 * already carries the wheel further down, and two places to cycle the same set
 * on one page is one too many. A plain server component, so the band ships none
 * of the timer code it would never run.
 */
export default function TaglineStatic() {
  return <span className={styles.tagline}>{siteMetadata.tagline}</span>
}

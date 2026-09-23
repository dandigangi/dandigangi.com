import styles from './Glint.module.css'

/**
 * Rainbow Road's star sprite — the nav toggle, the footer's way out, and the
 * secret's row in the egg list all use it, so the mode has one mark everywhere.
 * Always decorative: each use carries its own label.
 */
export default function Glint({
  size,
  className,
  off,
}: {
  size: number
  className?: string
  /** Greyed out: the mode is off but the switch is there. */
  off?: boolean
}) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/static/images/glint.gif"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`${styles.glint} ${className ?? ''}`}
      data-off={off ? '' : undefined}
      // Pixel art — the browser's smoothing turns a 32px sprite into mush.
      style={{ width: size, height: size, imageRendering: 'pixelated', verticalAlign: 'middle' }}
    />
  )
}

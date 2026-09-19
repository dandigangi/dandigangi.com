import styles from './MissingEmbed.module.css'

/**
 * Stands in for an embed a post asks for that the build cannot supply — a
 * component renamed or removed while a published post still references it.
 *
 * `lib/mdx.test.ts` is meant to catch that before it ships. This is what
 * happens if it ever gets through anyway: the sentence the embed sat in stays
 * readable, and only the embed is missing.
 */
export default function MissingEmbed({ name }: { name: string }) {
  return (
    <p className={styles.missing} role="note">
      This embed failed to load.
      <span className={styles.name}>{name}</span>
    </p>
  )
}

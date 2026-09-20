import siteMetadata from '@/data/siteMetadata'

/**
 * The lines the hero pill and the About wheel both cycle through.
 *
 * The canonical one leads and is what every surface loads on — it is what the
 * OG image, the résumé and llms.txt all quote, so it has to be index 0. The
 * rest only exist to be found.
 *
 * Each one takes a position rather than describing one: a contrast, an "over",
 * or an imperative. A line that merely names something reads as filler next to
 * these and does not belong in the set.
 *
 * Shared from here rather than declared twice: the two components show the same
 * set in different shapes, and a line added to one and not the other would be
 * invisible until someone noticed the pages disagreed.
 *
 * ORDER IS DELIBERATE. The wheel shows three rows at once, so neighbours get
 * read together, and adding a line means re-checking all of this:
 *
 *  1. The canonical line stays at index 0.
 *  2. It and "Building exceptional software for humans" are the closest in
 *     wording, so they sit four apart and never share a window.
 *  3. No two lines of the same shape are adjacent — four of these are
 *     "X, not Y", and two in a row reads as one sentence stuttering.
 *  4. Paired themes are split: the two mentoring lines sit four apart, as do
 *     the two about the business.
 *
 * Rule 3 cannot be perfect. Four "X, not Y" lines in a ten-line cycle cannot
 * all be three apart, so some windows show two of them with another line
 * between. Non-adjacency is the part that matters, and that holds.
 */
export const TAGLINES = [
  siteMetadata.tagline,
  'Leadership over management',
  'Ship value, not features',
  "Mentor for where they're going",
  'Building exceptional software for humans',
  'Grow people, not headcount',
  'Tech debt is a decision, not an accident',
  'Know the business, not just the code',
  "You don't need a title to mentor",
  'Hire with intention',
]

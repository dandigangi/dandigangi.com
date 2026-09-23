'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { veiled } from '@/lib/copy'
import { EXTRA } from '@/lib/ledger'
import { isTrail, press, trailToggles, restoreTrail, setTrail, subscribe } from '@/lib/trail'
import Blip from './Blip'
import Drift from './Drift'
import Glint from './Glint'
import { useTrailMark } from './useTrailMark'

/**
 * The tenth egg, and the only one nothing on the page hints at.
 *
 * Listens for a phrase being typed anywhere, then flips the whole site into
 * Rainbow Road — see css/trail.css, which hangs off `data-trail` on <html>.
 * Typing it again turns it off, because a site that has permanently become a
 * rainbow with no way back is a prank rather than an easter egg.
 *
 * Renders nothing but its own toast.
 */
export default function Trail() {
  const [found, setFound] = useState(false)
  /**
   * Read from the store rather than counted here, so the stars fall however the
   * mode was flipped — the phrase, the footer link, or the egg list. Held in
   * component state it only ever saw the first of those.
   */
  const arrivals = useSyncExternalStore(subscribe, trailToggles, () => 0)

  // Re-paints the stored state onto a freshly loaded document. The attribute
  // lives on <html>, which React does not own, so it has to be put back by hand.
  useEffect(restoreTrail, [])

  useEffect(() => {
    const onPress = (event: KeyboardEvent) => {
      /*
       * Ignored inside a textarea — that is the post editor, where typing a
       * word about rainbows should not repaint the site out from under you.
       * Ordinary inputs are fair game: the blog search is a perfectly good
       * place to try a phrase, and someone who types it there has earned it.
       */
      const target = event.target as HTMLElement | null
      if (target?.tagName === 'TEXTAREA' || target?.isContentEditable) return
      if (event.metaKey || event.ctrlKey || event.altKey) return

      if (!press(event.key)) return
      setTrail(!isTrail())
      setFound(true)
    }

    window.addEventListener('keydown', onPress)
    return () => window.removeEventListener('keydown', onPress)
  }, [])

  return (
    <>
      <Blip egg={EXTRA} show={found} />
      <Drift trigger={arrivals} />
    </>
  )
}

/**
 * The footer's copy of the nav star — same rules (useTrailMark): there once
 * the mode is found or the hunt won, greyed out while off, one click to flip.
 */
export function TrailToggleLink({ className }: { className?: string }) {
  const { on, shown, label, toggle } = useTrailMark()
  if (!shown) return null

  return (
    <button type="button" className={className} onClick={toggle} aria-pressed={on} title={label}>
      <Glint size={16} off={!on} />
      <span className="srOnly">{label}</span>
    </button>
  )
}

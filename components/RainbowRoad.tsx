'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { EXTRA } from '@/lib/eggs'
import { isRainbow, press, restoreRainbow, setRainbow, subscribe } from '@/lib/rainbow'
import EggToast from './EggToast'
import StarFall from './StarFall'

/**
 * The tenth egg, and the only one nothing on the page hints at.
 *
 * Listens for a phrase being typed anywhere, then flips the whole site into
 * Rainbow Road — see css/rainbow.css, which hangs off `data-rainbow` on <html>.
 * Typing it again turns it off, because a site that has permanently become a
 * rainbow with no way back is a prank rather than an easter egg.
 *
 * Renders nothing but its own toast.
 */
export default function RainbowRoad() {
  const [found, setFound] = useState(false)
  /** Bumped on every switch-on, which is what drops a fresh set of stars. */
  const [arrivals, setArrivals] = useState(0)

  // Re-paints the stored state onto a freshly loaded document. The attribute
  // lives on <html>, which React does not own, so it has to be put back by hand.
  useEffect(restoreRainbow, [])

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
      const next = !isRainbow()
      setRainbow(next)
      setFound(true)
      // Only on the way in. Turning it off is not an arrival.
      if (next) setArrivals((at) => at + 1)
    }

    window.addEventListener('keydown', onPress)
    return () => window.removeEventListener('keydown', onPress)
  }, [])

  return (
    <>
      <EggToast egg={EXTRA} show={found} />
      <StarFall trigger={arrivals} />
    </>
  )
}

/**
 * The way out, for anyone who turned it on and does not fancy retyping the
 * phrase to stop. Absent while it is off — there is nothing to turn off, and a
 * rainbow sitting in the footer of an ordinary page is a clue nobody asked for.
 */
export function RainbowOffLink({ className }: { className?: string }) {
  const on = useSyncExternalStore(subscribe, isRainbow, () => false)
  if (!on) return null

  return (
    <button
      type="button"
      className={className}
      onClick={() => setRainbow(false)}
      title="Turn off Rainbow Road"
    >
      <span aria-hidden="true">🌈</span>
      <span className="srOnly">Turn off Rainbow Road</span>
    </button>
  )
}

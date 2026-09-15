'use client'

import { useEffect } from 'react'

/**
 * Writes the two offsets the graphic bands consume via translate3d.
 * The clamps must stay under each band's overscan (hero 12% of 740px, short
 * bands 24% of 300px) or the image edge becomes visible.
 */
export default function Parallax() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) return

    const root = document.documentElement
    let frame = 0

    const apply = () => {
      frame = 0
      const y = window.scrollY || 0
      root.style.setProperty('--par-hero', `${Math.round(Math.min(y * 0.26, 84))}px`)
      root.style.setProperty('--par-band', `${Math.round(Math.min(y * 0.2, 56))}px`)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
      root.style.removeProperty('--par-hero')
      root.style.removeProperty('--par-band')
    }
  }, [])

  return null
}

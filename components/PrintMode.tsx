'use client'

import { useEffect, useRef } from 'react'

/**
 * The marker css/print.css keys on. With `always` it is in the server markup,
 * so the page is paper from first paint with no script. Otherwise it is set
 * only between beforeprint and afterprint, which is what keeps ⌘P on /resume
 * producing the paper layout.
 */
export default function PrintMode({ always = false }: { always?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (always || !el) return
    const on = () => el.setAttribute('data-print-mode', '')
    const off = () => el.removeAttribute('data-print-mode')
    window.addEventListener('beforeprint', on)
    window.addEventListener('afterprint', off)
    return () => {
      window.removeEventListener('beforeprint', on)
      window.removeEventListener('afterprint', off)
    }
  }, [always])

  return <span ref={ref} hidden data-print-mode={always ? '' : undefined} />
}

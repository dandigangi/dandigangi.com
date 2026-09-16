'use client'

import { useEffect } from 'react'

/**
 * Pins the whole document to the dark palette while the full-bleed image is up.
 *
 * It has to reach the root element, not a wrapper: the header band and the site
 * footer sit outside this page's own markup, and in light mode their near-black
 * text would be sitting on a dimmed photograph. Setting the attribute here lets
 * one rule in globals.css cover all three.
 */
export default function PikaTheme() {
  useEffect(() => {
    const root = document.documentElement
    root.dataset.pika = 'true'
    return () => {
      delete root.dataset.pika
    }
  }, [])

  return null
}

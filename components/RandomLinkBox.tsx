'use client'

import { useEffect, useState } from 'react'

type LinkEntry = { url: string; label: string; weight?: number }

const RANDOM_LINKS: LinkEntry[] = [
  {
    url: 'https://github.com/dandigangi/engineering-manager-resources',
    label: 'Engineering Manager Resources',
  },
  { url: 'https://shouldyouwritetests.com/', label: 'ShouldYouWriteTests.com' },
  { url: 'https://github.com/dandigangi/canvas-things', label: 'Canvas 2D/3D Experiments' },
  { url: 'https://github.com/dandigangi/misc-code-things', label: 'Misc Code Things' },
  {
    url: 'https://x.com/search?q=from%3Adandigangi%20(ux%20OR%20ui)&src=typed_query&f=live',
    label: 'UX/UI Callouts',
  },
  {
    url: 'https://2019.reactloop.com/',
    label: 'React Chicago Conference',
  },
]

function pickWeightedRandom(entries: LinkEntry[]): LinkEntry {
  const total = entries.reduce((sum, e) => sum + (e.weight ?? 3), 0)
  let r = Math.random() * total
  for (const entry of entries) {
    const w = entry.weight ?? 3
    if (r < w) return entry
    r -= w
  }
  return entries[entries.length - 1]
}

export default function RandomLinkBox() {
  // null until after mount so server and client both render the same placeholder (no hydration mismatch).
  // Then we show the chosen label and fade it in so it doesn’t feel like a “wrong then right” flash.
  const [selected, setSelected] = useState<LinkEntry | null>(null)
  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    setSelected(pickWeightedRandom(RANDOM_LINKS))
  }, [])

  useEffect(() => {
    if (!selected) return
    const id = requestAnimationFrame(() => setReveal(true))
    return () => cancelAnimationFrame(id)
  }, [selected])

  const href = selected?.url ?? RANDOM_LINKS[0].url

  const violetShadow = '0px 0px 12px #4817b0' // same as AuthorLayout, PostBanner, Card, etc.

  return (
    <>
      <style>{`.random-link-box:hover { box-shadow: ${violetShadow}; }`}</style>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="random-link-box block w-full min-h-[200px] rounded bg-gray-50 dark:bg-gray-900/70 bg-page-pattern bg-repeat-x bg-bottom shadow-md dark:shadow-gray-800/40 py-5 px-6 flex items-center justify-center cursor-pointer hover:opacity-90 transition-all duration-150 text-center"
        aria-label={
          selected
            ? `Open ${selected.label} in new tab`
            : 'Open a random project or resource in new tab'
        }
      >
        <span
          className={`text-lg font-medium text-gray-700 dark:text-gray-300 transition-opacity duration-200 ${
            selected && reveal ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {selected ? (
            <>
              {selected.label}
              <span className="ml-2.5">→</span>
            </>
          ) : (
            '\u00A0'
          )}
        </span>
      </a>
    </>
  )
}

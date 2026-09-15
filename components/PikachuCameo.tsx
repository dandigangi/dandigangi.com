'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { PIKACHU_CAUGHT, PIKACHU_OPEN, markCaught } from '@/lib/pikachu'
import PikachuModal from './PikachuModal'
import styles from './PikachuCameo.module.css'

type Edge = 'top' | 'bottom' | 'left' | 'right'

type Cameo = {
  id: number
  edge: Edge
  top: number
  left: number
  /** The route he was measured on — his coordinates mean nothing anywhere else. */
  path: string
}

const SRC = '/static/images/pikachu.png'
const NATURAL = { width: 320, height: 258 }

/** Box side. Square so the 90° edges fit the same footprint as the 180° ones. */
const SIZE = 43

const HOLD_MS = 3400
const SLIDE_MS = 620
const GAP_MIN_MS = 7000
const GAP_MAX_MS = 15000
const RETRY_MS = 4000

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

/**
 * Containers opt in with `data-cameo`, so he only ever climbs on something a
 * page has nominated. A selector cannot do this job: every real container here
 * is a CSS module, and its class name is hashed at build time.
 */
const CONTAINERS = '[data-cameo]'

/** Edges of this rect that are currently on screen with room for him. */
function visibleEdges(rect: DOMRect): Edge[] {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const edges: Edge[] = []
  if (rect.top >= 0 && rect.top <= vh - SIZE) edges.push('top')
  if (rect.bottom >= SIZE && rect.bottom <= vh) edges.push('bottom')
  if (rect.left >= 0 && rect.left <= vw - SIZE) edges.push('left')
  if (rect.right >= SIZE && rect.right <= vw) edges.push('right')
  return edges
}

function candidates(): { rect: DOMRect; edges: Edge[] }[] {
  const vw = window.innerWidth
  const vh = window.innerHeight

  return Array.from(document.querySelectorAll<HTMLElement>(CONTAINERS))
    .filter((el) => {
      const style = window.getComputedStyle(el)
      return style.visibility !== 'hidden' && style.display !== 'none'
    })
    .map((el) => el.getBoundingClientRect())
    .filter((rect) => {
      // Measured against the part that is on screen, not the whole element: a
      // post list taller than the viewport is still a perfectly good container,
      // and judging it by its full height rules out every long page.
      const width = Math.min(rect.right, vw) - Math.max(rect.left, 0)
      const height = Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
      return width >= SIZE * 4 && height >= SIZE * 3
    })
    .map((rect) => ({ rect, edges: visibleEdges(rect) }))
    .filter((entry) => entry.edges.length > 0)
}

export default function PikachuCameo() {
  const [cameo, setCameo] = useState<Cameo | null>(null)
  const [shown, setShown] = useState(false)
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(100)
  const pathname = usePathname()
  const [previous, setPrevious] = useState<number | null>(null)
  const caught = useRef(false)
  // Lets the modal stop and restart the loop without re-running the effect,
  // which would reset every timer it owns.
  const loop = useRef<{ stop: () => void; start: () => void } | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timers: ReturnType<typeof setTimeout>[] = []
    let frame = 0
    let id = 0

    const later = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms))
    }

    // A function declaration rather than a useCallback: the loop schedules
    // itself, and a self-referencing callback cannot be built out of hooks.
    function appear() {
      if (document.hidden) {
        later(appear, RETRY_MS)
        return
      }

      const found = candidates()
      if (found.length === 0) {
        later(appear, RETRY_MS)
        return
      }

      const { rect, edges } = pick(found)
      const edge = pick(edges)
      const vw = window.innerWidth
      const vh = window.innerHeight

      // Slide along the edge, but only across the stretch of it that is on
      // screen, so he never rises somewhere the reader cannot see.
      const horizontal = edge === 'top' || edge === 'bottom'
      const from = horizontal ? Math.max(rect.left, 0) : Math.max(rect.top, 0)
      const to = horizontal ? Math.min(rect.right, vw) : Math.min(rect.bottom, vh)
      const along = rand(from, Math.max(from, to - SIZE))

      const pageTop = rect.top + window.scrollY
      const pageLeft = rect.left + window.scrollX

      setCameo({
        id: ++id,
        edge,
        path: window.location.pathname,
        top:
          edge === 'top'
            ? pageTop
            : edge === 'bottom'
              ? pageTop + rect.height - SIZE
              : along + window.scrollY,
        left:
          edge === 'left'
            ? pageLeft
            : edge === 'right'
              ? pageLeft + rect.width - SIZE
              : along + window.scrollX,
      })
      setShown(false)

      // One painted frame at the hidden offset, so the transition has a start.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setShown(true))
      })

      later(() => setShown(false), SLIDE_MS + HOLD_MS)
      later(() => setCameo(null), SLIDE_MS + HOLD_MS + SLIDE_MS)
      later(appear, SLIDE_MS + HOLD_MS + SLIDE_MS + rand(GAP_MIN_MS, GAP_MAX_MS))
    }

    const clear = () => {
      timers.forEach(clearTimeout)
      timers.length = 0
      cancelAnimationFrame(frame)
    }

    loop.current = { stop: clear, start: () => later(appear, 900) }
    later(appear, rand(1000, 1300))

    return () => {
      clear()
      loop.current = null
    }
  }, [])

  const onCatch = () => {
    // Each shakedown costs more than the last, cents and all.
    if (caught.current) {
      setPrevious(amount)
      setAmount(Math.round((amount + rand(25, 75)) * 100) / 100)
    }
    caught.current = true
    show()
  }

  useEffect(() => {
    // A new page has new containers, and the pending schedule was measured
    // against the old ones. No setState here on purpose — the render already
    // drops a cameo whose path no longer matches.
    loop.current?.stop()
    loop.current?.start()
  }, [pathname])

  // Reopening from the footer must not add to the tab: only he gets to do that.
  const show = () => {
    loop.current?.stop()
    setShown(false)
    setCameo(null)
    setOpen(true)
  }

  useEffect(() => {
    const onOpen = () => show()
    window.addEventListener(PIKACHU_OPEN, onOpen)
    return () => window.removeEventListener(PIKACHU_OPEN, onOpen)
  }, [])

  const onClose = () => {
    setOpen(false)
    loop.current?.start()
  }

  return (
    <>
      {open && <PikachuModal amount={amount} previous={previous} onClose={onClose} />}
      {cameo?.path === pathname && <Cameo cameo={cameo} shown={shown} onCatch={onCatch} />}
    </>
  )
}

function Cameo({ cameo, shown, onCatch }: { cameo: Cameo; shown: boolean; onCatch: () => void }) {
  return (
    <div
      key={cameo.id}
      className={`${styles.clip} ${styles[cameo.edge]}`}
      style={{ top: cameo.top, left: cameo.left, width: SIZE, height: SIZE }}
    >
      <button
        type="button"
        className={`${styles.slider} ${shown ? styles.shown : ''}`}
        aria-label="Pikachu"
        onClick={() => {
          markCaught()
          window.dispatchEvent(new CustomEvent(PIKACHU_CAUGHT))
          onCatch()
        }}
      >
        <Image
          src={SRC}
          alt=""
          width={NATURAL.width}
          height={NATURAL.height}
          sizes={`${SIZE * 2}px`}
          className={styles.pika}
          draggable={false}
        />
      </button>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  PIKACHU_CAUGHT,
  PIKACHU_OPEN,
  getInitialTab,
  getTab,
  markCaught,
  raiseTab,
  softenTab,
  subscribe,
} from '@/lib/pikachu'
import PikachuModal from './PikachuModal'
import styles from './PikachuCameo.module.css'

type Edge = 'top' | 'bottom' | 'left' | 'right'

type Cameo = {
  id: number
  edge: Edge
  top: number
  left: number
  /** Drives the CSS transition, which is no longer one fixed duration. */
  slide: number
  /** The route he was measured on — his coordinates mean nothing anywhere else. */
  path: string
}

const SRC = '/static/images/pikachu.png'
const NATURAL = { width: 320, height: 258 }

/** Box side. Square so the 90° edges fit the same footprint as the 180° ones. */
const SIZE = 43

/**
 * He is wider than he is tall, so at SIZE across he leaves this much empty at
 * each end of the square box. Centring him there puts that gap on the edge he
 * is rising from, which reads as him floating off the container — so the CSS
 * pushes him out by exactly this much, toward whichever edge he entered by.
 */
const SLACK = (SIZE - (SIZE * NATURAL.height) / NATURAL.width) / 2

/**
 * Each pair runs cold (he has all the time in the world) to hot (he is on you).
 * The loop interpolates between them by how many invoices he has raised, so the
 * chase tightens as it goes instead of being the same lull twenty times over.
 */
const HOLD_MS = [3400, 1150] as const
const SLIDE_MS = [480, 300] as const
const GAP_MIN_MS = [7000, 2200] as const
const GAP_MAX_MS = [15000, 4200] as const

const RETRY_MS = 4000

/** What a hug is worth. */
const HUG_RELIEF = 50

/** Invoices it takes to reach full speed — just short of the last state, so
 *  he is at his most frantic right before he gives up. */
const HEAT_OVER = 15

/** What each shakedown adds. Tuned against the last state's figure: at this
 *  spread it lands in 14–17 catches 97% of the time, mean 16. */
const RAISE = [110, 220] as const

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const ramp = ([cold, hot]: readonly [number, number], heat: number) => cold + (hot - cold) * heat
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

/**
 * Containers opt in with `data-cameo`, so he only ever climbs on something a
 * page has nominated. A selector cannot do this job: every real container here
 * is a CSS module, and its class name is hashed at build time.
 *
 * `body` is in as well, which is what puts him on the page's own left and right
 * edges — those are on screen at any scroll position, unlike a container's.
 */
const CONTAINERS = '[data-cameo], body'

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
  const pathname = usePathname()
  // The tab lives in the module store so it survives both a client-side
  // navigation and the browser tab closing.
  const { amount, invoices, wonAt } = useSyncExternalStore(subscribe, getTab, getInitialTab)
  const [previous, setPrevious] = useState<number | null>(null)
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

      // Read through the store rather than closing over state: this effect runs
      // once, so a captured count would never move off zero.
      const heat = Math.min(getTab().invoices / HEAT_OVER, 1)
      const hold = ramp(HOLD_MS, heat)
      const slide = ramp(SLIDE_MS, heat)
      const gap = rand(ramp(GAP_MIN_MS, heat), ramp(GAP_MAX_MS, heat))

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
        slide,
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

      later(() => setShown(false), slide + hold)
      later(() => setCameo(null), slide + hold + slide)
      later(appear, slide + hold + slide + gap)
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
    const tab = getTab()
    // Each shakedown costs more than the last, cents and all — but the opening
    // ask stands on the very first catch, including across visits.
    if (tab.invoices > 0) {
      setPrevious(tab.amount)
      raiseTab(Math.round((tab.amount + rand(RAISE[0], RAISE[1])) * 100) / 100)
    } else {
      raiseTab(tab.amount)
    }
    show()
  }

  // Not a catch: it changes the figure without raising an invoice, and leaves
  // the modal open so the number can be seen rolling back down.
  const onHug = () => {
    const before = getTab().amount
    if (softenTab(HUG_RELIEF)) setPrevious(before)
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
      {open && (
        <PikachuModal
          amount={amount}
          previous={previous}
          invoices={invoices}
          won={wonAt !== null}
          onHug={onHug}
          onClose={onClose}
        />
      )}
      {cameo?.path === pathname && <Cameo cameo={cameo} shown={shown} onCatch={onCatch} />}
    </>
  )
}

function Cameo({ cameo, shown, onCatch }: { cameo: Cameo; shown: boolean; onCatch: () => void }) {
  return (
    <div
      key={cameo.id}
      className={`${styles.clip} ${styles[cameo.edge]}`}
      data-print="hide"
      style={
        {
          top: cameo.top,
          left: cameo.left,
          width: SIZE,
          height: SIZE,
          '--slack': `${SLACK}px`,
        } as React.CSSProperties
      }
    >
      <button
        type="button"
        className={`${styles.slider} ${shown ? styles.shown : ''}`}
        style={{ transitionDuration: `${cameo.slide}ms` }}
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

import { ROUNDS, hash } from './hash'
import { expireIfStale, touch } from './stale'

/**
 * Rainbow Road.
 *
 * Typed, not clicked: a rolling buffer of the last few keystrokes, checked
 * against a handful of phrases.
 *
 * Hashed, not encoded. Everything else on this site that needs hiding ships
 * base64, which keeps it out of a grep — but base64 is not a secret, and
 * anything reading this file, a person or a model, decodes it in a moment.
 *
 * This comment used to claim the phrases could not be read back out of the
 * hashes. They can, and were: pointed at the built bundle with nothing else to
 * go on, a model reimplemented FNV-1a and guessed four of the six in minutes.
 * That is the expected result, not a surprise — the search space is short
 * phrases a person might plausibly type about a rainbow, and a fast hash over a
 * small guessable set is a speed bump by construction.
 *
 * What it actually buys is that the phrases are not sitting in the bundle to be
 * grepped or decoded, so finding them costs deliberate effort rather than
 * curiosity. That is the whole claim. Anything stronger would need the check to
 * happen somewhere the visitor cannot read, and none of this is worth a server
 * round trip.
 */
const HASHED = [
  '2otf83.jmugoh',
  'x0cw1x.1tq2evv',
  'knjpiz.1c26jn1',
  '1fkbi9e.1kybxhu',
  'qkb16h.s5z0ld',
  'vu9pz.qz76ix',
]

/**
 * The range of suffix lengths checked, and the buffer that feeds them.
 *
 * The hashes used to be bucketed by phrase length, which handed an attacker the
 * exact lengths to generate candidates at — and that is most of what made a
 * dictionary sweep cheap. They are a flat list now and every length in this
 * window is tried, so the lengths cannot be read off the table. The window is
 * deliberately wider than the phrases need.
 *
 * This is the minor half of the change; ROUNDS in lib/hash.ts is the half that
 * does the work.
 */
const SHORTEST = 8
const BUFFER = 14

const STORE_KEY = 'dd:f3'
const RETIRED = ['dd:x3', 'dd:e3']

/** Set on <html>, which is what every rule in css/trail.css hangs off. */
const FLAG = 'data-trail'

let on = false
let read = false

/**
 * How many times the mode has actually flipped this page view.
 *
 * Kept here rather than in the component that listens for the phrase, because
 * that is no longer the only thing that flips it — the footer link and the egg
 * list both do too, and the stars have to fall for all of them. A counter
 * rather than a boolean: arriving is a moment, and `on` is already true by the
 * time anything reads it.
 */
let toggles = 0

export const trailToggles = (): number => toggles

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())

export const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const load = () => {
  if (read) return
  read = true
  try {
    for (const key of RETIRED) localStorage.removeItem(key)
    expireIfStale()
    on = localStorage.getItem(STORE_KEY) === '1'
  } catch {
    // Private mode. It just will not be remembered between visits.
  }
}

export const isTrail = (): boolean => {
  if (typeof window === 'undefined') return false
  load()
  return on
}

/** Mirrors the state onto <html>. Called on change and once after hydration. */
const paint = () => {
  const root = document.documentElement
  if (on) root.setAttribute(FLAG, '')
  else root.removeAttribute(FLAG)
}

export const setTrail = (next: boolean): void => {
  load()
  if (on === next) return
  on = next
  try {
    if (on) localStorage.setItem(STORE_KEY, '1')
    else localStorage.removeItem(STORE_KEY)
    touch()
  } catch {
    // Same again; it holds for this page view either way.
  }
  // Both directions. Leaving Rainbow Road is as much of an event as arriving,
  // and a send-off costs nothing the arrival did not already pay for.
  toggles += 1
  paint()
  emit()
}

/** Re-applies the stored state to a freshly loaded document. */
export const restoreTrail = (): void => {
  load()
  paint()
}

/**
 * Feeds a keystroke in and reports whether it completed a phrase.
 *
 * The buffer is trimmed to the longest phrase, so it cannot grow without bound
 * on a page someone types into all day.
 */
let buffer = ''

export const press = (key: string): boolean => {
  // Single printable characters only — modifiers and arrows would otherwise
  // shift the window and break a phrase mid-word.
  if (key.length !== 1) return false
  buffer = (buffer + key.toLowerCase()).slice(-BUFFER)
  let hit = false
  for (let length = SHORTEST; length <= BUFFER && !hit; length += 1) {
    if (buffer.length >= length) hit = HASHED.includes(hash(buffer.slice(-length), ROUNDS))
  }
  // Cleared on a hit, so holding the last letter down does not toggle repeatedly.
  if (hit) buffer = ''
  return hit
}

/** Test seam; nothing in the app calls this. */
export const clearBuffer = () => {
  buffer = ''
}

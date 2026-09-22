/**
 * Rainbow Road.
 *
 * Typed, not clicked: a rolling buffer of the last few keystrokes, checked
 * against a handful of phrases.
 *
 * Hashed, not encoded. Everything else on this site that needs hiding ships
 * base64, which keeps it out of a grep — but base64 is not a secret, and
 * anything reading this file, a person or a model, decodes it in a moment. This
 * one has no plaintext anywhere else on the site to give it away, so it is the
 * one worth actually protecting: only lengths and hashes are stored, and the
 * phrases cannot be read back out of them.
 *
 * FNV-1a, which is not a cryptographic hash and does not need to be. It is not
 * guarding anything of value — it only has to be worth more effort than the
 * joke is, which a brute-force over candidate phrases already is.
 */
const HASHED: [length: number, hashes: number[]][] = [
  [9, [3322859397]],
  [10, [1417010091]],
  [11, [967314927, 3351101760]],
  [12, [221995161, 2910764354]],
]

const hash = (value: string): number => {
  let h = 0x811c9dc5
  for (let at = 0; at < value.length; at += 1) {
    h ^= value.charCodeAt(at)
    // The FNV prime, via shifts: a plain multiply overflows past 2^32 and the
    // low bits — the only ones that matter here — come out wrong.
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0
  }
  return h >>> 0
}

/** The longest phrase, which is all the buffer ever needs to hold. */
const BUFFER = Math.max(...HASHED.map(([length]) => length))

const STORE_KEY = 'dd:e3'
const RETIRED = 'dd:x3'

/** Set on <html>, which is what every rule in css/rainbow.css hangs off. */
const FLAG = 'data-rainbow'

let on = false
let read = false

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
    localStorage.removeItem(RETIRED)
    on = localStorage.getItem(STORE_KEY) === '1'
  } catch {
    // Private mode. It just will not be remembered between visits.
  }
}

export const isRainbow = (): boolean => {
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

export const setRainbow = (next: boolean): void => {
  load()
  if (on === next) return
  on = next
  try {
    if (on) localStorage.setItem(STORE_KEY, '1')
    else localStorage.removeItem(STORE_KEY)
  } catch {
    // Same again; it holds for this page view either way.
  }
  paint()
  emit()
}

/** Re-applies the stored state to a freshly loaded document. */
export const restoreRainbow = (): void => {
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
  // Only the suffixes that could match: one per distinct phrase length.
  const hit = HASHED.some(
    ([length, hashes]) => buffer.length >= length && hashes.includes(hash(buffer.slice(-length)))
  )
  // Cleared on a hit, so holding the last letter down does not toggle repeatedly.
  if (hit) buffer = ''
  return hit
}

/** Test seam; nothing in the app calls this. */
export const clearBuffer = () => {
  buffer = ''
}

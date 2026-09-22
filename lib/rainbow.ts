import { veiled } from './copy'

/**
 * Rainbow Road.
 *
 * Typed, not clicked: a rolling buffer of the last few keystrokes, checked
 * against a handful of phrases. That is the only way in, which is why the
 * phrases ship encoded like everything else — a grep of the bundle should not
 * hand over the password to the one egg that is not listed anywhere.
 */
const TRIGGERS = [
  'cmFpbmJvd3JvYWQ=',
  'cmFpbmJvdyByb2Fk',
  'bWFyaW82NA==',
  'cmFpbmJvd3RpbWU=',
  'cmFpbmJvdyB0aW1l',
].map(veiled)

/** The longest phrase, which is all the buffer ever needs to hold. */
const BUFFER = Math.max(...TRIGGERS.map((phrase) => phrase.length))

const STORE_KEY = 'dd:x3'

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
  const hit = TRIGGERS.some((phrase) => buffer.endsWith(phrase))
  // Cleared on a hit, so holding the last letter down does not toggle repeatedly.
  if (hit) buffer = ''
  return hit
}

/** Test seam; nothing in the app calls this. */
export const clearBuffer = () => {
  buffer = ''
}

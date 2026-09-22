/**
 * The easter eggs worth counting, and how many of them have been found.
 *
 * Adding one means adding it here — the denominator in the toast is this
 * array's length, so a new egg that skips this list silently makes the count
 * wrong for everybody who has already found the others.
 *
 * Four of them are the Pikachu chase: meeting him, and each of the three
 * figures he passes on the way up. Finding him once is a different discovery
 * from finding out how far he will take it.
 *
 * Only the eggs that announce themselves are in here. The Pay Pikachu link is a
 * discovery too, but it never says so, and a counter that moves without telling
 * you is worse than no counter.
 */
export const EGGS = [
  'pikachu',
  'angry',
  'over',
  'final',
  'search',
  'admin',
  'sprite',
  'wheel',
  'hidden',
  'alterego',
] as const

export type Egg = (typeof EGGS)[number]

export const TOTAL_EGGS = EGGS.length

/**
 * What each one is called once it has been found. Encoded for the reason in
 * lib/copy.ts — decoded together these are a walkthrough, which is the one
 * thing the bundle must not hand over. Only ever rendered for eggs already in
 * the tally; the rest show as blanks.
 */
const NAMES: Record<Egg, string> = {
  pikachu: 'TWV0IFBpa2FjaHU=',
  angry: 'UHVzaGVkIGhpbSBwYXN0ICQ1MDA=',
  over: 'UHVzaGVkIGhpbSBwYXN0ICQxLDAwMA==',
  final: 'UHVzaGVkIGhpbSBwYXN0ICQxLDUwMA==',
  search: 'U2VhcmNoZWQgdGhlIGJsb2cgZm9yIGhpbQ==',
  admin: 'R3Vlc3NlZCB0aGUgYWRtaW4gcGFzc3dvcmQ=',
  sprite: 'VGhyZXcgYSBQb2tlYmFsbCBhdCBoaW0=',
  wheel: 'VHVybmVkIHRoZSB3aG9sZSB0YWdsaW5lIHdoZWVs',
  hidden: 'Rm91bmQgdGhlIGNoaXAgdGhhdCBpcyBub3QgdGhlcmU=',
  alterego: 'TWV0IHRoZSBhbHRlciBlZ28=',
}

export const eggName = (egg: Egg): string => veiled(NAMES[egg])

/** The found ones, in registry order, for listing. */
export const foundList = (): Egg[] => {
  if (typeof window === 'undefined') return []
  load()
  return EGGS.filter((egg) => found.has(egg))
}

// Opaque on purpose: "dd:eggs" sitting in localStorage is an invitation.
import { veiled } from './copy'

const STORE_KEY = 'dd:x1'
const CLAIM_KEY = 'dd:x2'

/**
 * Module state over an event, for the same reason the Pikachu tab is: anything
 * rendering this unmounts on a client-side navigation and has to be able to ask
 * what happened while it was gone.
 */
let found = new Set<Egg>()
let claimed = false
let read = false

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())

export const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const isEgg = (value: unknown): value is Egg => EGGS.includes(value as Egg)

/** Read once per page load, then kept in memory. */
const load = () => {
  if (read) return
  read = true
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return
    const saved: unknown = JSON.parse(raw)
    // Filtered rather than trusted: a stale name from an egg that has since been
    // removed would otherwise count toward a total that no longer includes it.
    if (Array.isArray(saved)) found = new Set(saved.filter(isEgg))
    claimed = localStorage.getItem(CLAIM_KEY) === '1'
  } catch {
    // Private mode, blocked storage, or a value written by an older shape.
  }
}

/** Whether one particular egg is already in the tally. */
export const hasEgg = (egg: Egg): boolean => {
  if (typeof window === 'undefined') return false
  load()
  return found.has(egg)
}

/** Every egg found. What the prize now hangs on, in place of a figure on the tab. */
export const allFound = (): boolean => foundEggs() === TOTAL_EGGS

/**
 * Whether the prize has already been collected. Persisted, or the modal would
 * reopen on every load for anyone who has finished — the set stays complete
 * afterwards, so completeness alone cannot be the condition.
 */
export const hasClaimed = (): boolean => {
  if (typeof window === 'undefined') return false
  load()
  return claimed
}

/** Called when the prize modal is dismissed. */
export const claimPrize = (): void => {
  if (claimed) return
  claimed = true
  try {
    localStorage.setItem(CLAIM_KEY, '1')
  } catch {
    // It will offer the prize again next visit. Worse things.
  }
  emit()
}

/** How many have been found. Safe before hydration — returns 0 on the server. */
export const foundEggs = (): number => {
  if (typeof window === 'undefined') return 0
  load()
  return found.size
}

/**
 * Records an egg. Idempotent, so a component that re-renders or remounts cannot
 * inflate the count, and only emits when something actually changed.
 */
export const findEgg = (egg: Egg): void => {
  if (typeof window === 'undefined') return
  load()
  if (found.has(egg)) return
  found.add(egg)
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...found]))
  } catch {
    // It just will not be remembered between visits.
  }
  emit()
}

/** Back to nothing found. The dev dock's reset calls this. */
export const resetEggs = (): void => {
  found = new Set()
  claimed = false
  read = true
  try {
    localStorage.removeItem(STORE_KEY)
    localStorage.removeItem(CLAIM_KEY)
  } catch {
    // The in-memory reset still stands for this page.
  }
  emit()
}

/**
 * The easter eggs worth counting, and how many of them have been found.
 *
 * Adding one means adding it here — the denominator in the toast is this
 * array's length, so a new egg that skips this list silently makes the count
 * wrong for everybody who has already found the others.
 *
 * Only the eggs that announce themselves are in here. The alter-ego portrait
 * and the Pay Pikachu link are discoveries too, but neither says so, and a
 * counter that moves without telling you is worse than no counter.
 */
export const EGGS = ['pikachu', 'search', 'admin'] as const

export type Egg = (typeof EGGS)[number]

export const TOTAL_EGGS = EGGS.length

const STORE_KEY = 'dd:eggs'

/**
 * Module state over an event, for the same reason the Pikachu tab is: anything
 * rendering this unmounts on a client-side navigation and has to be able to ask
 * what happened while it was gone.
 */
let found = new Set<Egg>()
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
  } catch {
    // Private mode, blocked storage, or a value written by an older shape.
  }
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
  read = true
  try {
    localStorage.removeItem(STORE_KEY)
  } catch {
    // The in-memory reset still stands for this page.
  }
  emit()
}

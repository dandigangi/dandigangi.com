/**
 * The easter eggs worth counting, and how many of them have been found.
 *
 * Adding one means adding it here — the denominator in the toast is this
 * array's length, so a new egg that skips this list silently makes the count
 * wrong for everybody who has already found the others.
 *
 * Three of them are the Pikachu chase: meeting him, and each of the two figures
 * he passes on the way up. Finding him once is a different discovery from
 * finding out how far he will take it.
 *
 * Only the eggs that announce themselves are in here. The Pay Pikachu link is a
 * discovery too, but it never says so, and a counter that moves without telling
 * you is worse than no counter.
 */
export const EGGS = [
  'pikachu',
  'angry',
  'final',
  'search',
  'admin',
  'sprite',
  'wheel',
  'hidden',
  'alterego',
] as const

/**
 * The ones that are not on the board.
 *
 * Deliberately outside EGGS: until one of these is found there is nothing to
 * say it exists — the count reads out of nine, the list has nine rows, and
 * nothing hints at more. Finding one adds it to both, at the top.
 *
 * This is also what keeps the prize honest. Winning is finding the nine, and it
 * has to stay that way: one of these is only reachable from inside the prize
 * itself, so counting it toward the total up front would make the prize its own
 * prerequisite. Counted on discovery, the bar never moves — you always have the
 * off-board ones you are being counted for.
 *
 * Named blandly because export names survive minification and ship in the
 * bundle; `SECRET` sitting in there was an invitation to go looking.
 */
export const OFF_BOARD = ['rainbow', 'paid'] as const

/** The one with a mark of its own in the list. */
export const EXTRA = 'rainbow' as const

const ALL = [...EGGS, ...OFF_BOARD] as const

export type Egg = (typeof ALL)[number]

/**
 * Nine, or ten once the secret is out. A function rather than a constant
 * because it genuinely changes — every caller reads it through the store, so
 * the denominator updates the moment it is found.
 */
export const totalEggs = (): number => EGGS.length + OFF_BOARD.filter((egg) => hasEgg(egg)).length

/**
 * What each one is called once it has been found. Encoded for the reason in
 * lib/copy.ts — decoded together these are a walkthrough, which is the one
 * thing the bundle must not hand over. Only ever rendered for eggs already in
 * the tally; the rest show as blanks.
 */
const NAMES: Record<Egg, string> = {
  pikachu: 'TWV0IFBpa2FjaHU=',
  angry: 'UHVzaGVkIGhpbSBwYXN0ICQyNTA=',
  final: 'UHVzaGVkIGhpbSBwYXN0ICQ1MDA=',
  search: 'U2VhcmNoZWQgdGhlIGJsb2cgZm9yIGhpbQ==',
  admin: 'R3Vlc3NlZCB0aGUgYWRtaW4gcGFzc3dvcmQ=',
  sprite: 'VGhyZXcgYSBQb2tlYmFsbCBhdCBoaW0=',
  wheel: 'VHVybmVkIHRoZSB3aG9sZSB0YWdsaW5lIHdoZWVs',
  hidden: 'Rm91bmQgdGhlIGNoaXAgdGhhdCBpcyBub3QgdGhlcmU=',
  alterego: 'TWV0IHRoZSBhbHRlciBlZ28=',
  rainbow: 'W1NFQ1JFVF0gUkFJTkJPVyBST0FEIERJU0NPVkVSRUQ=',
  paid: 'VHJpZWQgZXZlcnkgd2F5IHRvIGdldCBwYWlk',
}

export const eggName = (egg: Egg): string => veiled(NAMES[egg])

/** The found ones with their timestamps, in the order they were found. */
export const foundList = (): { egg: Egg; at: number }[] => {
  if (typeof window === 'undefined') return []
  load()
  const entries = [...found.entries()].map(([egg, at]) => ({ egg, at })).sort((a, b) => a.at - b.at)
  // The off-board ones go to the top however late they turned up.
  const off = (egg: Egg) => (OFF_BOARD as readonly string[]).includes(egg)
  return [
    ...entries.filter((entry) => off(entry.egg)),
    ...entries.filter((entry) => !off(entry.egg)),
  ]
}

// Opaque on purpose: "dd:eggs" sitting in localStorage is an invitation.
import { veiled } from './copy'
import { expireIfStale, touch } from './stale'

/*
 * Bumped Sep 2026. The eggs changed shape enough — tiers moved, one was split
 * in two, a secret was added — that a tally written before then describes a
 * game that no longer exists. A new key is the whole migration: everyone starts
 * from nothing, which is the only state that is correct for all of them.
 *
 * The retired keys are removed on first read rather than left to rot.
 */
const STORE_KEY = 'dd:e1'
const CLAIM_KEY = 'dd:e2'
const RETIRED = ['dd:x1', 'dd:x2']

/**
 * Module state over an event, for the same reason the Pikachu tab is: anything
 * rendering this unmounts on a client-side navigation and has to be able to ask
 * what happened while it was gone.
 */
/** Egg -> when it was found. A Map rather than a Set so the list can say when. */
let found = new Map<Egg, number>()
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

const isEgg = (value: unknown): value is Egg => ALL.includes(value as Egg)

/** Read once per page load, then kept in memory. */
const load = () => {
  if (read) return
  read = true
  try {
    /*
     * Both of these come before the early return below, and that ordering is
     * the whole point. Someone arriving from the previous version has no new
     * key at all, so `raw` is null and anything after that check never runs —
     * which was exactly the case the cleanup existed for.
     */
    for (const key of RETIRED) localStorage.removeItem(key)
    // Before anything is read: a stale hunt is cleared rather than resumed.
    expireIfStale()
    claimed = localStorage.getItem(CLAIM_KEY) === '1'

    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return
    const saved: unknown = JSON.parse(raw)
    /*
     * Two shapes. The current one is [id, timestamp] pairs; the first version
     * stored bare ids, and those are kept with an unknown time rather than
     * dropped — losing a find to a format change would be the worse trade.
     *
     * Filtered rather than trusted either way: a stale id from an egg that has
     * since been removed would count toward a total that no longer includes it.
     */
    if (Array.isArray(saved)) {
      for (const entry of saved) {
        if (typeof entry === 'string' && isEgg(entry)) found.set(entry, 0)
        else if (Array.isArray(entry) && isEgg(entry[0])) {
          found.set(entry[0], typeof entry[1] === 'number' ? entry[1] : 0)
        }
      }
    }
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

/**
 * Every egg found. What the prize hangs on, in place of a figure on the tab.
 *
 * Compared against the live total, so someone who has turned up the secret has
 * to find that one too — it counts once it exists.
 */
export const allFound = (): boolean => foundEggs() === totalEggs()

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
  found.set(egg, Date.now())
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...found]))
    touch()
  } catch {
    // It just will not be remembered between visits.
  }
  emit()
}

/** Back to nothing found. The dev dock's reset calls this. */
export const resetEggs = (): void => {
  found = new Map()
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

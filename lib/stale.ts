/**
 * How long a hunt stays yours.
 *
 * Someone who found three eggs in March and comes back in June is not resuming
 * anything — they are starting again, and a half-finished tally they no longer
 * remember earning is worse than a clean one. Fourteen days of not visiting
 * clears it.
 *
 * Measured from the last write, not the first: anyone still playing keeps
 * pushing the deadline out in front of them.
 */
const KEY = 'dd:f4'

export const STALE_MS = 14 * 24 * 60 * 60 * 1000

/** Every key the hunt writes. Listed here so expiry clears all of it at once. */
const KEYS = ['dd:f1', 'dd:f2', 'dd:f3', 'dd:f5', 'dd:f6', 'dd:pk3', KEY]

/**
 * Clears everything if the last write is older than the window, and reports
 * whether it did.
 *
 * Each store calls this at the top of its own load. The first one through does
 * the clearing and the rest then find nothing, which is the same answer — so it
 * does not matter which of them reads first, and that is worth more here than
 * saving the duplicate call.
 */
export const expireIfStale = (): boolean => {
  if (typeof window === 'undefined') return false
  try {
    const last = localStorage.getItem(KEY)
    if (!last) return false
    if (Date.now() - Number(last) <= STALE_MS) return false
    for (const key of KEYS) localStorage.removeItem(key)
    return true
  } catch {
    // Private mode or blocked storage. There is nothing stored to expire.
    return false
  }
}

/** Pushes the deadline out. Called on every write that is worth remembering. */
export const touch = (): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, String(Date.now()))
  } catch {
    // Same — it simply will not be remembered.
  }
}

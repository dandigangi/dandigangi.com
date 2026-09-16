/**
 * Window events rather than shared React state: the cameo lives at the end of
 * the root layout and its listeners sit inside server-rendered components, so
 * the two have no common client ancestor to hold a provider.
 */
export const PIKACHU_CAUGHT = 'pikachu:caught'

/** Reopens the invoice without adding to the tab — clicking him does that. */
export const PIKACHU_OPEN = 'pikachu:open'

/**
 * Module state, because an event only reaches whoever was mounted when it
 * fired. Anything inside a page unmounts on a client-side navigation and has to
 * be able to ask what happened while it was gone.
 *
 * Two independent sources drive the hero swap. Catching him is permanent — you
 * met him, that is that. The About page's Alter Ego button is a toggle, so it
 * can put the abstract render back, but only if he was never caught.
 */
let caught = false
let alterEgo = false
/**
 * Sticky. Once the layer has been shown it stays mounted so it can transition
 * out as well as in — an unmounted element cannot animate away. It is still
 * never mounted for people who do not trigger it, so they never fetch it.
 */
let everActive = false

/** When the layer last went from off to on, so a fresh mount can tell whether
 *  it is witnessing that change or arriving on a page where it already held. */
let activatedAt = 0

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())

export const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const hasCaught = () => caught
export const isAlterEgo = () => alterEgo
export const heroActive = () => caught || alterEgo

export const heroEverActive = () => everActive

const changed = (wasActive: boolean) => {
  if (heroActive()) {
    everActive = true
    if (!wasActive) activatedAt = Date.now()
  }
  emit()
}

/** Within a couple of frames of the layer switching on. */
export const justActivated = () => Date.now() - activatedAt < 150

export const markCaught = () => {
  if (caught) return
  const wasActive = heroActive()
  caught = true
  changed(wasActive)
}

export const setAlterEgo = (on: boolean) => {
  if (alterEgo === on) return
  const wasActive = heroActive()
  alterEgo = on
  changed(wasActive)
}

/**
 * The running tab, kept here for the same reason the flags above are: it has to
 * outlive any component that unmounts on a client-side navigation. It also
 * outlives the browser tab closing, which is the point — sixteen catches is not
 * a sitting, it is something you come back to.
 *
 * Shaped for `useSyncExternalStore`, so the snapshot has to stay referentially
 * stable between changes or the store re-renders forever.
 */
export type Tab = {
  amount: number
  invoices: number
  /** When the last state was reached, or null. Expires — see WON_MS. */
  wonAt: number | null
}

const OPENING = 100

/** Where the last state takes over. Lives here rather than in the modal so the
 *  store can stamp `wonAt` at the moment it is crossed. */
export const FINAL_TIER = 2500

/** How long the last state outlives the tab that earned it. After this the
 *  whole thing resets, so it can be found again. */
const WON_MS = 24 * 60 * 60 * 1000

const STORE_KEY = 'dd:pk'

const OPENING_TAB: Tab = { amount: OPENING, invoices: 0, wonAt: null }

let tab: Tab = OPENING_TAB
/** Constant identity: what the server renders, and what hydration matches. */
const INITIAL: Tab = OPENING_TAB
let read = false

const persist = () => {
  try {
    localStorage.setItem(STORE_KEY, btoa(JSON.stringify(tab)))
  } catch {
    // Nothing to do — he just forgets you next time.
  }
}

const stored = (): Tab | null => {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return null
    const saved: unknown = JSON.parse(atob(raw))
    if (typeof saved !== 'object' || saved === null) return null
    const { amount, invoices, wonAt } = saved as Partial<Tab>
    if (typeof amount !== 'number' || typeof invoices !== 'number') return null
    if (!Number.isFinite(amount) || amount < OPENING || invoices < 0) return null
    const won = typeof wonAt === 'number' && Number.isFinite(wonAt) ? wonAt : null
    // Evaluated once per page load rather than on every read, so the modal
    // cannot change state under someone who is looking at it.
    if (won !== null && Date.now() - won >= WON_MS) {
      localStorage.removeItem(STORE_KEY)
      return null
    }
    return { amount, invoices, wonAt: won }
  } catch {
    // Private mode, blocked storage, or a value written by an older shape.
    return null
  }
}

export const getTab = (): Tab => {
  if (!read) {
    read = true
    const saved = stored()
    if (saved) tab = saved
  }
  return tab
}

export const getInitialTab = (): Tab => INITIAL

/** Raises the tab and counts the invoice. Only he may call this. */
export const raiseTab = (amount: number) => {
  tab = {
    amount,
    invoices: tab.invoices + 1,
    // Stamped once. A hug can take the figure back down; it cannot un-win.
    wonAt: tab.wonAt ?? (amount >= FINAL_TIER ? Date.now() : null),
  }
  persist()
  emit()
}

/** A hug is worth something. Never below the opening ask. */
export const softenTab = (by: number): boolean => {
  const next = Math.max(OPENING, Math.round((tab.amount - by) * 100) / 100)
  if (next === tab.amount) return false
  tab = { ...tab, amount: next }
  persist()
  emit()
  return true
}

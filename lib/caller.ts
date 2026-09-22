import { expireIfStale, touch } from './stale'
import { T } from '@/lib/ledger'

/**
 * Window events rather than shared React state: the cameo lives at the end of
 * the root layout and its listeners sit inside server-rendered components, so
 * the two have no common client ancestor to hold a provider.
 */
/** Reopens the invoice without adding to the tab — clicking him does that. */
export const CALLER_OPEN = 'dd:co'

/** Reopens the prize, for anyone who dismissed it and wants another look. */
export const CALLER_OFFER = 'dd:cf'

/**
 * Module state, because an event only reaches whoever was mounted when it
 * fired. Anything inside a page unmounts on a client-side navigation and has to
 * be able to ask what happened while it was gone.
 *
 * `caught` is permanent and only opens the footer link — you met him, that is
 * that. The hero swap is a separate, higher bar: see layerActive below.
 */
let caught = false
let alterEgo = false
/**
 * Typing his name into the blog search puts the hero up for as long as that
 * exact text is in the box. Separate from the tab on purpose: it is a wink, not
 * a catch, so it costs nothing, earns nothing, and leaves the moment you clear
 * the field.
 */
let searchEgg = false
/**
 * Sticky. Once the layer has been shown it stays mounted so it can transition
 * out as well as in — an unmounted element cannot animate away. It is still
 * never mounted for people who do not trigger it, so they never fetch it.
 */
let everActive = false

/** When the layer last went from off to on, so a fresh mount can tell whether
 *  it is witnessing that change or arriving on a page where it already held. */
let activatedAt = 0

/**
 * Whether the hero swap is up, and it lives no longer than the page it happened
 * on.
 *
 * This was a five-minute timer, which was the wrong shape twice over: it
 * outlived the moment that earned it by several navigations, and it needed a
 * setTimeout to push the expiry because nothing else would repaint at the
 * deadline. Crossing the last milestone is a payoff, not a state — you see it,
 * and then you carry on reading. Caller clears it on the next route change.
 *
 * Never persisted, so a reload clears it too.
 */
let swap = false

const disarm = () => {
  swap = false
}

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())

export const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const hasMet = () => caught
export const isAlt = () => alterEgo
export const isHinted = () => searchEgg

/** Driven by the blog search. Transient — never persisted, never counted. */
export const setHinted = (on: boolean) => {
  if (searchEgg === on) return
  const wasActive = layerActive()
  searchEgg = on
  changed(wasActive)
}

/**
 * Meeting him is not enough to take over the page — he has to have escalated
 * past the figure that earns an egg, which is higher than the one that turns
 * the modal red. Repainting every hero on the site is a bigger swing than the
 * first flash of temper deserves. The tab is the only way
 * in: the alter ego toggle deliberately does not count, because a button on
 * /about that repaints every hero on the site is a bigger swing than a photo
 * swap advertises.
 *
 * Derived from the tab rather than a flag of its own, so a hug that drops him
 * back under the line puts the abstract render back exactly as it puts the
 * modal back to black.
 */
export const layerActive = () => searchEgg || swap

/** Derived too, or a reload with an escalated tab stored would never mount the
 *  layer that `layerActive` is about to switch on. */
export const layerEverActive = () => everActive || layerActive()

const changed = (wasActive: boolean) => {
  if (layerActive()) {
    everActive = true
    if (!wasActive) activatedAt = Date.now()
  }
  emit()
}

/** Within a couple of frames of the layer switching on. */
export const justActivated = () => Date.now() - activatedAt < 150

export const markMet = () => {
  if (caught) return
  const wasActive = layerActive()
  caught = true
  changed(wasActive)
}

/** Portrait only — see layerActive for why this no longer reaches the hero. */
export const setAlt = (on: boolean) => {
  if (alterEgo === on) return
  alterEgo = on
  emit()
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
}

/** His opening ask, and the floor a hug cannot take him below. */
export const OPENING = 100

/** Where he stops being polite, and where the hero swap earns its keep. */
export const OVER_TIER = 250

/**
 * The last milestone, not a finish line. The tab keeps climbing past it — the
 * prize hangs on finding every easter egg, not on reaching a figure.
 *
 * It is also where the hero swaps. That used to be a tier of its own, sitting
 * between this and OVER_TIER; with the chase this short there is no room for a
 * third figure, and the top of it is the right place for the biggest effect.
 */
export const FINAL_TIER = 500

/**
 * What the prize is worth.
 *
 * Here rather than in the modal because the egg list quotes it too, and a
 * figure written out in two components is a figure that will disagree with
 * itself the first time one of them is edited.
 */
export const OFFER_FIGURE = 50

/**
 * The three crossings worth an egg, in order. Kept here rather than in the
 * cameo so the figures and the ids that depend on them cannot drift apart.
 */
export const MONEY_TIERS = [
  { at: OVER_TIER, egg: T.tier1 },
  { at: FINAL_TIER, egg: T.tier2 },
] as const

/* Bumped alongside the egg tally — a tab carried over from before tonight is
   money owed in a game whose rules have changed. See lib/eggs.ts. */
const STORE_KEY = 'dd:pk2'
const RETIRED = 'dd:pk'

const OPENING_TAB: Tab = { amount: OPENING, invoices: 0 }

let tab: Tab = OPENING_TAB
/** Constant identity: what the server renders, and what hydration matches. */
const INITIAL: Tab = OPENING_TAB
let read = false

const persist = () => {
  try {
    localStorage.setItem(STORE_KEY, btoa(JSON.stringify(tab)))
    touch()
  } catch {
    // Nothing to do — he just forgets you next time.
  }
}

const stored = (): Tab | null => {
  try {
    localStorage.removeItem(RETIRED)
    expireIfStale()
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return null
    const saved: unknown = JSON.parse(atob(raw))
    if (typeof saved !== 'object' || saved === null) return null
    const { amount, invoices } = saved as Partial<Tab>
    if (typeof amount !== 'number' || typeof invoices !== 'number') return null
    if (!Number.isFinite(amount) || amount < OPENING || invoices < 0) return null
    // A `wonAt` from the old shape is simply dropped: the prize no longer hangs
    // on the tab, so there is nothing for it to mean.
    return { amount, invoices }
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
  const wasActive = layerActive()
  tab = { amount, invoices: tab.invoices + 1 }
  // After the figure moves: this is the crossing that puts the swap up.
  if (tab.amount >= FINAL_TIER) swap = true
  persist()
  // Not emit(): crossing FINAL_TIER is what switches the hero on, and only this
  // knows whether that just happened.
  changed(wasActive)
}

/**
 * Expires the hero window now instead of waiting it out. Exists for the local
 * dev dock: the five-minute lapse is the one behaviour here that cannot be
 * watched in a reasonable sitting, and the fade-out is worth seeing.
 */
export const lapseLayer = () => {
  if (!swap) return
  const wasActive = layerActive()
  disarm()
  changed(wasActive)
}

/**
 * Back to the opening ask, as though he had never been found. Called when the
 * last state is dismissed: winning is the end of the game, not somewhere to
 * live afterwards, and the swap standing down is most of the point.
 *
 * Clears storage as well as memory, so the next visit starts the chase over
 * rather than reopening on a settled invoice.
 */
export const resetTab = () => {
  const wasActive = layerActive()
  disarm()
  tab = OPENING_TAB
  try {
    localStorage.removeItem(STORE_KEY)
  } catch {
    // Blocked storage. The in-memory reset still stands for this page.
  }
  changed(wasActive)
}

/**
 * Everything back to a cold start: no tab, no invoices, never met him, no hero.
 * `resetTab` deliberately leaves `caught` standing, because meeting him is
 * permanent within a session — that is right for winning, and wrong for a dev
 * control whose whole job is to get back to what a first-time visitor sees.
 *
 * Clears `everActive` too, so the hero layer unmounts rather than sitting there
 * transparent; the next trigger mounts it fresh and fades in properly.
 */
export const resetAll = () => {
  const wasActive = layerActive()
  disarm()
  caught = false
  alterEgo = false
  searchEgg = false
  everActive = false
  activatedAt = 0
  tab = OPENING_TAB
  try {
    localStorage.removeItem(STORE_KEY)
  } catch {
    // Blocked storage. The in-memory reset still stands for this page.
  }
  changed(wasActive)
}

/** A hug is worth something. Never below the opening ask. */
export const softenTab = (by: number): boolean => {
  const next = Math.max(OPENING, Math.round((tab.amount - by) * 100) / 100)
  if (next === tab.amount) return false
  const wasActive = layerActive()
  tab = { ...tab, amount: next }
  // A hug that drops him back under the line puts the abstract render back, the
  // same way it puts the modal back to black.
  if (tab.amount < FINAL_TIER) swap = false
  persist()
  changed(wasActive)
  return true
}

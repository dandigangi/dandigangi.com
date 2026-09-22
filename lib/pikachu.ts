/**
 * Window events rather than shared React state: the cameo lives at the end of
 * the root layout and its listeners sit inside server-rendered components, so
 * the two have no common client ancestor to hold a provider.
 */
/** Reopens the invoice without adding to the tab — clicking him does that. */
export const PIKACHU_OPEN = 'pikachu:open'

/**
 * Module state, because an event only reaches whoever was mounted when it
 * fired. Anything inside a page unmounts on a client-side navigation and has to
 * be able to ask what happened while it was gone.
 *
 * `caught` is permanent and only opens the footer link — you met him, that is
 * that. The hero swap is a separate, higher bar: see heroActive below.
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
 * How long the hero swap outlives the catch that armed it.
 *
 * The tab persists and the swap does not, deliberately. Gating the hero on the
 * stored figure alone meant one good run left every page yellow on every later
 * visit, for people who were only here to read something.
 */
const ARM_MS = 5 * 60 * 1000

/** When he was last caught, or 0. Never persisted, so a reload is a way out
 *  too — but nobody should have to discover that. */
let armedAt = 0
let armTimer: ReturnType<typeof setTimeout> | null = null

const armed = () => armedAt > 0 && Date.now() - armedAt < ARM_MS

/**
 * Catching him puts the swap in play and re-arms it if it had lapsed, which is
 * what lets someone come back days later, click him once and pick up where the
 * tab left off.
 *
 * The lapse has to push rather than be polled: `heroActive` is read through
 * `useSyncExternalStore`, so a bare `Date.now()` comparison would repaint
 * nothing at the deadline and the swap would linger until something unrelated
 * happened to emit.
 */
const arm = () => {
  armedAt = Date.now()
  if (armTimer) clearTimeout(armTimer)
  armTimer = setTimeout(() => {
    armTimer = null
    emit()
  }, ARM_MS)
}

const disarm = () => {
  armedAt = 0
  if (armTimer) clearTimeout(armTimer)
  armTimer = null
}

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
export const isSearchEgg = () => searchEgg

/** Driven by the blog search. Transient — never persisted, never counted. */
export const setSearchEgg = (on: boolean) => {
  if (searchEgg === on) return
  const wasActive = heroActive()
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
export const heroActive = () => searchEgg || (armed() && getTab().amount >= EGG_TIER)

/** Derived too, or a reload with an escalated tab stored would never mount the
 *  layer that `heroActive` is about to switch on. */
export const heroEverActive = () => everActive || heroActive()

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

/** Portrait only — see heroActive for why this no longer reaches the hero. */
export const setAlterEgo = (on: boolean) => {
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
export const OVER_TIER = 500

/**
 * The figure that swaps the hero. Deliberately above OVER_TIER: repainting every
 * hero on the site is a bigger swing than the first flash of temper deserves.
 */
export const EGG_TIER = 1000

/**
 * The last milestone, not a finish line. The tab keeps climbing past it — the
 * prize hangs on finding every easter egg, not on reaching a figure.
 */
export const FINAL_TIER = 1500

/**
 * The three crossings worth an egg, in order. Kept here rather than in the
 * cameo so the figures and the ids that depend on them cannot drift apart.
 */
export const MONEY_TIERS = [
  { at: OVER_TIER, egg: 'angry' },
  { at: EGG_TIER, egg: 'over' },
  { at: FINAL_TIER, egg: 'final' },
] as const

const STORE_KEY = 'dd:pk'

const OPENING_TAB: Tab = { amount: OPENING, invoices: 0 }

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
  const wasActive = heroActive()
  // Before the figure moves, so `changed` below sees the armed state that this
  // catch has just established rather than the one it is replacing.
  arm()
  tab = { amount, invoices: tab.invoices + 1 }
  persist()
  // Not emit(): crossing EGG_TIER is what switches the hero on, and only this
  // knows whether that just happened.
  changed(wasActive)
}

/**
 * Expires the hero window now instead of waiting it out. Exists for the local
 * dev dock: the five-minute lapse is the one behaviour here that cannot be
 * watched in a reasonable sitting, and the fade-out is worth seeing.
 */
export const lapseHero = () => {
  if (!armed()) return
  const wasActive = heroActive()
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
  const wasActive = heroActive()
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
  const wasActive = heroActive()
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
  const wasActive = heroActive()
  tab = { ...tab, amount: next }
  persist()
  changed(wasActive)
  return true
}

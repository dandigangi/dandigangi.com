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

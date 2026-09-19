/**
 * The component names a compiled post expects to be handed.
 *
 * Velite compiles an unresolved component into a guard that throws while React
 * is rendering — `Spotify||function(e,n){throw new Error(...)}("Spotify",!0)` —
 * and it reads the real one out of a *spread* of the components object. The
 * spread is why a Proxy cannot stand in: spreading copies own enumerable keys
 * and never triggers a `get` trap for a name nobody has heard of.
 *
 * Reading the names back out of that guard is what lets the gaps be filled
 * before React renders anything, so one bad embed degrades to a notice instead
 * of throwing the whole route.
 */
const REQUIRED = /\(\s*"([A-Za-z_$][\w$]*)"\s*,\s*!0\s*\)/g

export const requiredComponents = (body: string): string[] => [
  ...new Set([...body.matchAll(REQUIRED)].map((match) => match[1])),
]

/**
 * Base64 for strings that would give the surprises away.
 *
 * Not secrecy, and it is worth being precise about that: this bundle ships to
 * every visitor, `atob` is one DevTools call away, and the repo is public. What
 * it buys is that grepping the deployed JS — or pointing a model at it — does
 * not return a map of every easter egg on the site. The bar it raises is
 * "skimming", not "looking".
 *
 * Encode a string before putting it here; decode one before editing it.
 */
export const veiled = (value: string): string =>
  new TextDecoder().decode(Uint8Array.from(atob(value), (character) => character.charCodeAt(0)))

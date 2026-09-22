/**
 * Base64 for strings that would give the surprises away.
 *
 * Not secrecy, and it is worth being precise about that: this bundle ships to
 * every visitor and `atob` is one DevTools call away. What it buys is that
 * grepping the deployed JS — or pointing a model at it — does not return a map
 * of every surprise on the site. The bar it raises is "skimming", not
 * "looking", and nothing client-side can raise it further: anything the browser
 * renders, the bundle contains.
 *
 * The repo itself is private, so this and the file names are the whole surface.
 *
 * Encode a string before putting it here; decode one before editing it.
 */
export const veiled = (value: string): string =>
  new TextDecoder().decode(Uint8Array.from(atob(value), (character) => character.charCodeAt(0)))

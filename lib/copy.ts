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
 * How much this is worth depends entirely on whether the repository is
 * readable, and that is not a question this file can answer. If it is, the
 * comments throughout lib/ and components/ describe every surprise in plain
 * English on purpose — so none of this defends anything, and it is not trying
 * to. It defends the bundle, which is a different and much smaller claim.
 *
 * Encode a string before putting it here; decode one before editing it.
 */
export const veiled = (value: string): string =>
  new TextDecoder().decode(Uint8Array.from(atob(value), (character) => character.charCodeAt(0)))

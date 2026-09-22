/**
 * FNV-1a, 32-bit.
 *
 * Here so the handful of places that compare a typed word against an expected
 * one can do it without shipping the word. Base64 keeps a string out of a grep;
 * it does not keep it from anyone who runs `atob`, and for the two or three
 * strings that are genuinely instructions rather than confirmations that is not
 * enough.
 *
 * Not cryptographic, and it does not need to be. It guards a joke. All it has to
 * be is worth more effort than the joke is, which brute-forcing over candidate
 * words already is.
 */
export const hash = (value: string): number => {
  let h = 0x811c9dc5
  for (let at = 0; at < value.length; at += 1) {
    h ^= value.charCodeAt(at)
    // The FNV prime, via shifts: a plain multiply overflows past 2^32 and the
    // low bits — the only ones that matter here — come out wrong.
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0
  }
  return h >>> 0
}

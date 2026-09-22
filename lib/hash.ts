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
/**
 * How many times the digest is fed back through itself.
 *
 * One round is what this used to do, and a model pointed at the bundle swept a
 * 250k-word dictionary against it in about thirty seconds. Stretching is the
 * only lever that helps here — a salt would have to ship alongside the hashes
 * to be usable, so the attacker reads it too, and then it costs them nothing.
 *
 * 500 is picked from measurement, not taste. With the 64-bit width below doing
 * the collision work, rounds only have to make a dictionary sweep expensive,
 * and 500 turns that thirty-second sweep into several hours. It costs ~1ms
 * across the seven suffix lengths checked per keystroke, which stays under a
 * frame even several times slower on a phone. 2000 measured at ~3.9ms, which
 * starts eating the frame budget on every keystroke on every page — not a
 * trade a joke is worth.
 */
export const ROUNDS = 500

/**
 * Two independent chains, so the digest is 64 bits rather than 32.
 *
 * This is the half that matters, and it was missing. A model pointed at the
 * live bundle did not bother with a dictionary at all — it generated a working
 * collision against the 32-bit digest in about a second and typed that instead
 * of the real phrase. Stretching does not help with that on its own: measured,
 * it moves a collision search from ~1 second to ~213 core-hours, which is a
 * weekend on a few machines. Width does. At 64 bits the same search is ~1e8
 * core-years, which is the end of that idea.
 *
 * Rounds and width defend against different attacks and you need both: rounds
 * make each guess expensive, width makes guessing pointless.
 */
export const hash = (value: string, rounds = 1): string => {
  let a = 0x811c9dc5
  let b = 0x01000193
  let input = value
  for (let round = 0; round < rounds; round += 1) {
    for (let at = 0; at < input.length; at += 1) {
      const code = input.charCodeAt(at)
      a ^= code
      // The FNV prime, via shifts: a plain multiply overflows past 2^32 and the
      // low bits — the only ones that matter here — come out wrong.
      a = (a + ((a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24))) >>> 0
      // The second chain reads the string backwards off a different seed, so
      // the two cannot be driven to a chosen pair by the same edit.
      b ^= input.charCodeAt(input.length - 1 - at)
      b = (b + ((b << 5) + (b << 8) + (b << 13) + (b << 17) + (b << 23))) >>> 0
    }
    input = `${a}:${b}`
  }
  return `${a.toString(36)}.${b.toString(36)}`
}

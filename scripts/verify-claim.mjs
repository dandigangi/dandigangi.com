/**
 * Checks a claim code against the secret that minted it.
 *
 * Usage: EGG_SECRET=... node scripts/verify-claim.mjs DDG-xxxx-yyyyyy
 *
 * A pass means this code came from the site. It does not mean the person
 * holding it found anything — see the note in app/c/route.ts.
 */
import { createHmac, timingSafeEqual } from 'node:crypto'

const [, , code] = process.argv
const secret = process.env.EGG_SECRET

if (!secret) {
  console.error('✖ Set EGG_SECRET to the value the deployment uses.')
  process.exit(1)
}
if (!code) {
  console.error('✖ Pass a code: node scripts/verify-claim.mjs DDG-xxxx-yyyyyy')
  process.exit(1)
}

const parts = code.trim().split('-')
const ok = (() => {
  if (parts.length !== 3 || parts[0] !== 'DDG') return false
  const expected = Buffer.from(
    createHmac('sha256', secret).update(parts[1]).digest('hex').slice(0, 6)
  )
  const given = Buffer.from(parts[2])
  return expected.length === given.length && timingSafeEqual(expected, given)
})()

console.log(ok ? `✓ ${code} was issued by the site` : `✖ ${code} was not issued by the site`)
process.exit(ok ? 0 : 1)

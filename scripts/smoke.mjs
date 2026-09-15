/**
 * Sweeps every URL in the sitemap plus the standalone routes it does not list,
 * asserting each returns 200. Catches the class of breakage that only shows up
 * at a URL nobody clicks — a page still importing something that was deleted,
 * or a route that stopped generating.
 *
 * Usage: yarn serve (in one shell), then `node scripts/smoke.mjs`
 * Override the target with BASE_URL for a deployed environment.
 */

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const EXTRA_ROUTES = ['/robots.txt', '/llms.txt', '/feed.xml', '/sitemap.xml']
const CONCURRENCY = 8

const fail = (message) => {
  console.error(`\n✖ ${message}`)
  process.exit(1)
}

const sitemapUrls = async () => {
  const res = await fetch(`${BASE}/sitemap.xml`)
  if (!res.ok) fail(`sitemap.xml returned ${res.status} — is \`yarn serve\` running on ${BASE}?`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
}

const check = async (path) => {
  try {
    const res = await fetch(`${BASE}${path}`, { redirect: 'manual' })
    const ok = res.status === 200 || res.status === 308
    return { path, status: res.status, ok }
  } catch (error) {
    return { path, status: error.code ?? 'ERR', ok: false }
  }
}

const run = async () => {
  const paths = [...new Set([...(await sitemapUrls()), ...EXTRA_ROUTES])]
  const results = []

  for (let i = 0; i < paths.length; i += CONCURRENCY) {
    results.push(...(await Promise.all(paths.slice(i, i + CONCURRENCY).map(check))))
  }

  const broken = results.filter((r) => !r.ok)
  for (const b of broken) console.error(`  ${b.status}  ${b.path}`)

  if (broken.length > 0) fail(`${broken.length} of ${results.length} routes broken`)
  console.log(`✓ ${results.length} routes OK`)
}

run()

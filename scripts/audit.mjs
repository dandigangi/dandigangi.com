/**
 * A11y (axe-core) and SEO sweep over a running build. The companion to
 * smoke.mjs: that one asserts every URL answers, this one asserts the answers
 * are sound.
 *
 * Usage: `yarn build && yarn serve` in one shell, then `yarn audit:site`.
 * Override the target with BASE_URL.
 *
 * Colour contrast is switched off deliberately — jsdom computes no layout, so
 * the rule has nothing real to measure and only emits noise. Checking contrast
 * needs an actual browser.
 */
import { JSDOM, VirtualConsole } from 'jsdom'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

const require = createRequire(import.meta.url)
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'

/** Noindexed, so absent from the sitemap, but still public pages. */
const EXTRA_ROUTES = ['/admin', '/admin/lulz']

const routes = async () => {
  const res = await fetch(`${BASE}/sitemap.xml`)
  if (!res.ok) {
    console.error(`✖ sitemap.xml returned ${res.status} — is \`yarn serve\` running on ${BASE}?`)
    process.exit(1)
  }
  const xml = await res.text()
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  return [...new Set([...urls, ...EXTRA_ROUTES])]
}

/**
 * The checks axe does not make, because they are about how a page presents in a
 * search result rather than about the DOM being sound.
 */
const seoChecks = (doc) => {
  const out = []
  const q = (s) => doc.querySelector(s)
  const all = (s) => [...doc.querySelectorAll(s)]

  const title = q('title')?.textContent?.trim()
  if (!title) out.push('no <title>')
  else if (title.length > 60) out.push(`title ${title.length} chars (>60, Google truncates)`)

  const desc = q('meta[name="description"]')?.content?.trim()
  if (!desc) out.push('no meta description')
  else if (desc.length > 160) out.push(`description ${desc.length} chars (>160)`)

  if (!q('link[rel="canonical"]')) out.push('no canonical')
  if (!doc.documentElement.getAttribute('lang')) out.push('no lang on <html>')
  if (!q('meta[property="og:image"]')) out.push('no og:image')

  const h1 = all('h1')
  if (h1.length === 0) out.push('no h1')
  if (h1.length > 1) out.push(`${h1.length} h1s`)

  const levels = all('h1,h2,h3,h4,h5,h6').map((h) => Number(h.tagName[1]))
  for (let i = 1; i < levels.length; i += 1) {
    if (levels[i] - levels[i - 1] > 1) {
      out.push(`heading jump h${levels[i - 1]}->h${levels[i]}`)
      break
    }
  }

  const noAlt = all('img:not([alt])').length
  if (noAlt) out.push(`${noAlt} img without an alt attribute`)

  return out
}

const run = async () => {
  const paths = await routes()
  const a11y = new Map()
  const seo = []

  for (const path of paths) {
    const res = await fetch(`${BASE}${path}`)
    if (!res.ok) {
      seo.push([path, [`HTTP ${res.status}`]])
      continue
    }
    const dom = new JSDOM(await res.text(), {
      runScripts: 'outside-only',
      pretendToBeVisual: true,
      virtualConsole: new VirtualConsole(),
    })
    dom.window.eval(AXE)
    const { violations } = await dom.window.axe.run(dom.window.document, {
      rules: { 'color-contrast': { enabled: false } },
      resultTypes: ['violations'],
    })
    for (const v of violations) {
      if (!a11y.has(v.id)) a11y.set(v.id, { impact: v.impact, help: v.help, pages: [], sample: '' })
      const entry = a11y.get(v.id)
      entry.pages.push(path)
      if (!entry.sample) entry.sample = v.nodes[0]?.html?.slice(0, 160) ?? ''
    }
    const problems = seoChecks(dom.window.document)
    if (problems.length) seo.push([path, problems])
    dom.window.close()
  }

  console.log(`\nswept ${paths.length} pages on ${BASE}\n`)
  console.log('── ACCESSIBILITY (axe-core, contrast excluded) ──')
  if (!a11y.size) console.log('  no violations')
  for (const [id, v] of [...a11y].sort((a, b) => b[1].pages.length - a[1].pages.length)) {
    console.log(`\n  [${v.impact}] ${id} — ${v.help}`)
    console.log(
      `    ${v.pages.length} page(s): ${v.pages.slice(0, 5).join(', ')}${v.pages.length > 5 ? ' …' : ''}`
    )
    console.log(`    e.g. ${v.sample}`)
  }
  console.log('\n── SEO / STRUCTURE ──')
  if (!seo.length) console.log('  no issues')
  for (const [path, problems] of seo) console.log(`  ${path}: ${problems.join('; ')}`)
  console.log()

  // Never fails the shell: this is a report to read, not a gate. smoke.mjs is
  // the thing that fails a build.
}

run()

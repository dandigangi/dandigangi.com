/**
 * Prints /resume/download to PDF using the Chrome that is already installed.
 *
 * No Puppeteer or Playwright: both ship their own ~150MB browser to do exactly
 * this, and the only thing needed here is Chrome's own --print-to-pdf. It also
 * means the PDF is rendered by the same engine that renders the site, with the
 * self-hosted Archivo and IBM Plex Mono already in place — which is the whole
 * reason this beats maintaining a separate LaTeX document.
 *
 * Usage: yarn serve (in one shell), then `node scripts/resume-pdf.mjs`.
 * Pass `--out <path>` to write somewhere other than public/static.
 * Override the target with BASE_URL for a deployed environment.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const outArg = process.argv.indexOf('--out')
const OUT =
  outArg > -1 && process.argv[outArg + 1]
    ? resolve(process.argv[outArg + 1])
    : join(process.cwd(), 'public/static/dan-digangi-resume.pdf')

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
]

const fail = (message) => {
  console.error(`\n✖ ${message}`)
  process.exit(1)
}

const chrome = CHROME_CANDIDATES.find((path) => existsSync(path))
if (!chrome) fail(`No Chrome found. Looked in:\n  ${CHROME_CANDIDATES.join('\n  ')}`)

const res = await fetch(`${BASE}/resume/download`).catch(() => null)
if (!res?.ok) {
  fail(`${BASE}/resume/download did not respond — is \`yarn serve\` running on ${BASE}?`)
}

mkdirSync(dirname(OUT), { recursive: true })

execFileSync(
  chrome,
  [
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    // Chrome will otherwise print before webfonts and images have settled.
    '--virtual-time-budget=6000',
    `--print-to-pdf=${OUT}`,
    // The paper view carries its print marker in the markup; /resume only gets
    // it from a beforeprint listener, which headless printing isn't promised to fire.
    `${BASE}/resume/download`,
  ],
  { stdio: 'inherit' }
)

if (!existsSync(OUT)) fail('Chrome exited without writing a PDF.')

const kb = Math.round(statSync(OUT).size / 1024)
console.log(`\n✓ ${OUT.replace(process.cwd() + '/', '')} — ${kb}KB`)
console.log('  Source: data/resume.ts via /resume/download. Re-run after editing either.')

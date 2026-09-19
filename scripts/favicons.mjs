/**
 * Regenerates the favicon set from the brand mark.
 *
 * Why this exists rather than a folder of hand-exported files: the old set had
 * drifted. Some sizes carried an alpha channel and some a baked-in background,
 * the glyph sat 1–3px off centre at several sizes, apple-touch-icon-180.png
 * bled to all four edges, and mstile-150x150.png was actually 229px square.
 *
 * Two constraints drive the numbers:
 *
 *  - Google masks favicons into a *circle* in search results. A centred glyph
 *    survives that only if its corners stay inside the inscribed circle, which
 *    caps it at 1/√2 ≈ 70% of the canvas. The old set ran 80–87%, so its
 *    corners were being clipped.
 *  - A transparent icon with a near-black glyph is close to invisible on a dark
 *    browser tab strip, which is what the old 32px PNG was. An opaque field
 *    fixes that everywhere at once.
 *
 * The source is the white mark on transparent, so it composites straight onto
 * the brand black with no recolouring. It is 198x211, which is enough for every
 * size generated here — 512 is deliberately not, since that would mean
 * upscaling. A vector master would lift that limit.
 *
 * Usage: yarn favicons
 */
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { Buffer } from 'node:buffer'

const OUT = 'public/static/favicons'

/** The mark in each ink, on transparent. Same artwork, two colourways. */
const WHITE_MARK = 'public/static/images/dan-digangi-logo-light.png'
const BLACK_MARK = 'public/static/images/dan-digangi-logo-dark.png'

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 }

/** Share of the canvas the glyph occupies. See the circle note above. */
const SCALE = 0.7

/** Trimmed to the ink, so every size is centred on the mark's true bounding
 *  box rather than on whatever padding the source file happens to carry. */
const inked = async (src) => sharp(src).ensureAlpha().trim().png().toBuffer()

const marks = { white: await inked(WHITE_MARK), black: await inked(BLACK_MARK) }

const square = async (size, { ink, background }) => {
  const inner = Math.round(size * SCALE)
  const scaled = await sharp(marks[ink])
    .resize(inner, inner, { fit: 'contain', background: TRANSPARENT })
    .toBuffer()
  const { width, height } = await sharp(scaled).metadata()
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([
      {
        input: scaled,
        // Rounded, not floored: a half-pixel bias is exactly how the old set
        // ended up sitting off-centre at the small sizes.
        left: Math.round((size - width) / 2),
        top: Math.round((size - height) / 2),
      },
    ])
    .png()
    .toBuffer()
}

/**
 * The tab icon and the search-result icon want opposite things, and they are
 * different files, so they get different treatments:
 *
 *  - TAB (16/32, and the SVG): the mark on transparent, so it sits on the
 *    browser's own chrome instead of punching a tile into it.
 *  - SEARCH (48 and up, and the ICO): black on white. Google masks these into
 *    a circle on a light card, and a white field is what reads there.
 */
const TAB = { ink: 'white', background: TRANSPARENT }
const SEARCH = { ink: 'black', background: WHITE }

/**
 * ICO, written by hand because sharp cannot encode one and this needs no
 * dependency for it: a 6-byte header, one 16-byte directory entry per image,
 * then the PNG payloads. PNG-inside-ICO is supported everywhere that matters.
 */
const ico = (images) => {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)

  let offset = 6 + images.length * 16
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0)
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt8(0, 2)
    entry.writeUInt8(0, 3)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    return entry
  })

  return Buffer.concat([header, ...entries, ...images.map((image) => image.data)])
}

/**
 * Both colourways at 96px, embedded in one SVG that switches on the browser's
 * colour scheme.
 *
 * This is the piece that makes a transparent tab icon safe: white-on-transparent
 * alone disappears on a light tab strip. Anything supporting SVG favicons gets
 * the ink that suits its chrome; the PNGs below stay as the fallback.
 *
 * Rasters embedded rather than paths because there is no vector master of this
 * mark in the repo — replace this with real geometry when there is one.
 */
const adaptiveSvg = async () => {
  const light = (await square(96, { ink: 'black', background: TRANSPARENT })).toString('base64')
  const dark = (await square(96, { ink: 'white', background: TRANSPARENT })).toString('base64')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
<style>.dark{display:none}@media(prefers-color-scheme:dark){.light{display:none}.dark{display:inline}}</style>
<image class="light" width="96" height="96" href="data:image/png;base64,${light}"/>
<image class="dark" width="96" height="96" href="data:image/png;base64,${dark}"/>
</svg>
`
}

writeFileSync(`${OUT}/favicon-16x16.png`, await square(16, TAB))
writeFileSync(`${OUT}/favicon-32x32.png`, await square(32, TAB))
writeFileSync(`${OUT}/favicon-48x48.png`, await square(48, SEARCH))
writeFileSync(`${OUT}/android-chrome-96x96.png`, await square(96, SEARCH))
writeFileSync(`${OUT}/android-chrome-192x192.png`, await square(192, SEARCH))
writeFileSync(`${OUT}/apple-touch-icon-180.png`, await square(180, SEARCH))
writeFileSync(`${OUT}/favicon.svg`, await adaptiveSvg())

const searchIco = new Map()
for (const size of [16, 32, 48]) searchIco.set(size, await square(size, SEARCH))
const icoBuffer = ico([16, 32, 48].map((size) => ({ size, data: searchIco.get(size) })))
writeFileSync(`${OUT}/favicon.ico`, icoBuffer)
// Next serves this one at /favicon.ico through the app-directory convention.
writeFileSync('app/favicon.ico', icoBuffer)

console.log(`favicons rebuilt — glyph at ${SCALE * 100}% of canvas; tabs transparent, search on white`)

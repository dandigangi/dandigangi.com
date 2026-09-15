import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

/**
 * Shared chrome for every OpenGraph card, so the site card and the post cards
 * cannot drift apart.
 *
 * Two Satori constraints drive the markup here:
 *  - there is no `inset` shorthand, so absolutely positioned layers need
 *    explicit top/left/width/height or they collapse to nothing;
 *  - gradients must be set through backgroundImage, not background.
 */
export async function loadOgAssets() {
  const [font, render] = await Promise.all([
    readFile(join(process.cwd(), 'assets/fonts/Archivo-Bold.ttf')),
    readFile(join(process.cwd(), 'public/static/images/wave-render.jpg')),
  ])
  return { font, bg: `data:image/jpeg;base64,${render.toString('base64')}` }
}

export function ogFonts(font: Buffer) {
  return [{ name: 'Archivo', data: font, style: 'normal' as const, weight: 700 as const }]
}

export function OgCard({
  bg,
  eyebrow,
  title,
  titleSize,
  footerLeft,
  footerRight = 'dandigangi.com',
}: {
  bg: string
  eyebrow: string
  title: React.ReactNode
  titleSize: number
  footerLeft: string
  footerRight?: string
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        background: '#000000',
        fontFamily: 'Archivo',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bg}
        alt=""
        width={OG_SIZE.width}
        height={OG_SIZE.height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: OG_SIZE.width,
          height: OG_SIZE.height,
          objectFit: 'cover',
          opacity: 0.72,
        }}
      />

      {/* Near-opaque through the type, falling away so the render keeps its
          colour on the right. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: OG_SIZE.width,
          height: OG_SIZE.height,
          backgroundImage:
            'linear-gradient(90deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.93) 46%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.15) 88%, rgba(0,0,0,0.38) 100%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          padding: '72px 80px',
          color: '#F5F4F1',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(245,244,241,0.72)',
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: titleSize,
            lineHeight: 1.02,
            letterSpacing: '-0.04em',
            maxWidth: 940,
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div style={{ display: 'flex', height: 1, background: 'rgba(245,244,241,0.22)' }} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 22,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
            }}
          >
            <span>{footerLeft}</span>
            <span style={{ color: 'rgba(245,244,241,0.72)' }}>{footerRight}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

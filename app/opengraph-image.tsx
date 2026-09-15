import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import siteMetadata from '@/data/siteMetadata'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Dan DiGangi — Senior Software Engineering Manager'

/** Committed rather than fetched, so a build never depends on Google Fonts. */
const archivo = () => readFile(join(process.cwd(), 'assets/fonts/Archivo-Bold.ttf'))

/**
 * Satori cannot load a URL at build time, so the render is inlined as a data
 * URI. It is read from the 1600px wide copy rather than the 2400px hero to keep
 * the encode fast.
 */
const renderDataUri = async () => {
  const buf = await readFile(join(process.cwd(), 'public/static/images/wave-render.jpg'))
  return `data:image/jpeg;base64,${buf.toString('base64')}`
}

export default async function OpengraphImage() {
  const [font, bg] = await Promise.all([archivo(), renderDataUri()])

  return new ImageResponse(
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
      {/* The render, dimmed so the type stays dominant. */}
      <img
        src={bg}
        alt=""
        width={1200}
        height={630}
        style={{ position: 'absolute', inset: 0, objectFit: 'cover', opacity: 0.62 }}
      />

      {/* Same left-heavy scrim the site uses, so the type sits on near-black
            while the render stays visible on the right. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.82) 42%, rgba(0,0,0,0.28) 78%, rgba(0,0,0,0.5) 100%)',
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
          {siteMetadata.role}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 132,
            lineHeight: 0.86,
            letterSpacing: '-0.055em',
            textTransform: 'uppercase',
          }}
        >
          <span>Dan</span>
          <span>DiGangi</span>
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
            <span>{siteMetadata.tagline}</span>
            <span style={{ color: 'rgba(245,244,241,0.72)' }}>dandigangi.com</span>
          </div>
        </div>
      </div>
    </div>,
    { ...size, fonts: [{ name: 'Archivo', data: font, style: 'normal', weight: 700 }] }
  )
}

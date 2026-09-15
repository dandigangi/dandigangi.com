import { ImageResponse } from 'next/og'
import siteMetadata from '@/data/siteMetadata'
import { OG_SIZE, OG_CONTENT_TYPE, OgCard, loadOgAssets, ogFonts } from '@/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Dan DiGangi — Senior Software Engineering Manager'

export default async function OpengraphImage() {
  const { font, bg } = await loadOgAssets()

  return new ImageResponse(
    <OgCard
      bg={bg}
      eyebrow={siteMetadata.role}
      // The name gets the display treatment: uppercase, two forced lines and
      // tighter tracking than a sentence-case post title.
      title={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 0.86,
            letterSpacing: '-0.055em',
            textTransform: 'uppercase',
          }}
        >
          <span>Dan</span>
          <span>DiGangi</span>
        </div>
      }
      titleSize={132}
      footerLeft={siteMetadata.tagline}
    />,
    { ...OG_SIZE, fonts: ogFonts(font) }
  )
}

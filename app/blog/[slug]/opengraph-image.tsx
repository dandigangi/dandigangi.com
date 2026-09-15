import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import siteMetadata from '@/data/siteMetadata'
import { getPostBySlug, getPublishedPosts } from '@/lib/blog'
import { formatMonthYear, formatTag } from '@/lib/format'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Dan DiGangi'

export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }))
}

/**
 * The font is committed rather than fetched from Google at build time so a
 * build never depends on their availability.
 */
const archivo = () => readFile(join(process.cwd(), 'assets/fonts/Archivo-Bold.ttf'))

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  const title = post?.title ?? siteMetadata.author
  const meta = post
    ? [formatMonthYear(post.date), post.tags[0] ? formatTag(post.tags[0]) : null]
        .filter(Boolean)
        .join('  ·  ')
    : siteMetadata.role

  // Long titles need to step down or they overflow the card.
  const fontSize = title.length > 70 ? 62 : title.length > 45 ? 76 : 92

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#000000',
        color: '#F5F4F1',
        padding: '72px 80px',
        fontFamily: 'Archivo',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 22,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: 'rgba(245,244,241,0.62)',
        }}
      >
        {meta}
      </div>

      <div
        style={{
          display: 'flex',
          fontSize,
          lineHeight: 1.02,
          letterSpacing: '-0.04em',
          maxWidth: 1000,
        }}
      >
        {title}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div style={{ display: 'flex', height: 1, background: 'rgba(245,244,241,0.14)' }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 22,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
          }}
        >
          <span>Dan DiGangi</span>
          <span style={{ color: 'rgba(245,244,241,0.62)' }}>dandigangi.com</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: 'Archivo', data: await archivo(), style: 'normal', weight: 700 }],
    }
  )
}

import { ImageResponse } from 'next/og'
import siteMetadata from '@/data/siteMetadata'
import { getPostBySlug, getPublishedPosts } from '@/lib/blog'
import { formatMonthYear, formatTag } from '@/lib/format'
import { OG_SIZE, OG_CONTENT_TYPE, OgCard, loadOgAssets, ogFonts } from '@/lib/og'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Dan DiGangi'

export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }))
}

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  const { font, bg } = await loadOgAssets()

  const title = post?.title ?? siteMetadata.author
  const eyebrow = post
    ? [formatMonthYear(post.date), post.tags[0] ? formatTag(post.tags[0]) : null]
        .filter(Boolean)
        .join('  ·  ')
    : siteMetadata.role

  // Long titles step down so they cannot overrun the card.
  const titleSize = title.length > 70 ? 62 : title.length > 45 ? 76 : 92

  return new ImageResponse(
    <OgCard
      bg={bg}
      eyebrow={eyebrow}
      title={title}
      titleSize={titleSize}
      footerLeft="Dan DiGangi"
    />,
    { ...OG_SIZE, fonts: ogFonts(font) }
  )
}

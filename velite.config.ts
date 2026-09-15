import { defineConfig, defineCollection, s } from 'velite'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'
import remarkGfm from 'remark-gfm'
import siteMetadata from './data/siteMetadata'

/**
 * Existing public URLs are /blog/<slug> and must not change — inbound links and
 * search rankings depend on them. `s.path()` yields 'blog/<slug>', so the
 * directory prefix is stripped rather than the slug being regenerated.
 */
const stripCollectionDir = (path: string) => path.replace(/^.+?\//, '')

/**
 * YouTube serves a thumbnail at a predictable URL per video id, so a video post
 * only needs its watch/embed URL — no separate image to produce or keep in sync.
 */
const youtubeThumbnail = (url: string): string | undefined => {
  const id = url.match(/(?:embed\/|watch\?v=|youtu\.be\/)([\w-]{11})/)?.[1]
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : undefined
}

const posts = defineCollection({
  name: 'Post',
  pattern: 'blog/**/*.mdx',
  schema: s
    .object({
      title: s.string(),
      date: s.isodate(),
      lastmod: s.isodate().optional(),
      tags: s.array(s.string()).default([]),
      draft: s.boolean().default(false),
      summary: s.string().optional(),
      images: s.array(s.string()).optional(),
      authors: s.array(s.string()).optional(),
      layout: s.string().optional(),
      canonicalUrl: s.string().optional(),
      /**
       * Selects the post header variant and drives the home page's featured
       * card. Absent means the 'none' variant: body follows the header directly.
       */
      media: s
        .object({
          type: s.enum(['cover', 'video', 'none']).default('none'),
          image: s.string().optional(),
          video: s
            .object({
              provider: s.string().default('YouTube'),
              url: s.string(),
              duration: s.string().optional(),
              thumbnail: s.string().optional(),
            })
            .optional(),
          sources: s.array(s.object({ label: s.string(), url: s.string() })).optional(),
        })
        .optional(),
      path: s.path(),
      body: s.mdx(),
      raw: s.raw(),
      toc: s.toc(),
      metadata: s.metadata(),
    })
    .transform((data) => {
      const slug = stripCollectionDir(data.path)
      const url = `${siteMetadata.siteUrl}/blog/${slug}`
      const rawImage = data.images?.[0] ?? siteMetadata.socialBanner
      const image = rawImage.startsWith('http')
        ? rawImage
        : `${siteMetadata.siteUrl}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`

      const media = data.media?.video
        ? {
            ...data.media,
            video: {
              ...data.media.video,
              thumbnail: data.media.video.thumbnail ?? youtubeThumbnail(data.media.video.url),
            },
          }
        : data.media

      return {
        ...data,
        media,
        slug,
        permalink: `/blog/${slug}`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: data.title,
          datePublished: data.date,
          dateModified: data.lastmod || data.date,
          description: data.summary,
          image,
          url,
        },
      }
    }),
})

const authors = defineCollection({
  name: 'Author',
  pattern: 'authors/**/*.mdx',
  schema: s
    .object({
      name: s.string(),
      avatar: s.string().optional(),
      occupation: s.string().optional(),
      company: s.string().optional(),
      email: s.string().optional(),
      twitter: s.string().optional(),
      linkedin: s.string().optional(),
      github: s.string().optional(),
      layout: s.string().optional(),
      path: s.path(),
      body: s.mdx(),
    })
    .transform((data) => ({ ...data, slug: stripCollectionDir(data.path) })),
})

export default defineConfig({
  root: 'data',
  output: {
    data: '.velite',
    // Deliberately NOT the default 'public/static' — `--clean` empties this
    // directory, and public/static holds hand-managed images and favicons.
    assets: 'public/static/velite',
    base: '/static/velite/',
    name: '[name]-[hash:8].[ext]',
    clean: true,
  },
  collections: { posts, authors },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
      [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
})

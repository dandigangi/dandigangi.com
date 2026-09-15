import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

interface PageSEOProps {
  title: string
  description?: string
  image?: string

  [key: string]: any
}

export function genPageMetadata({ title, description, image, ...rest }: PageSEOProps): Metadata {
  // The root opengraph-image.tsx does not propagate into child segments, so
  // these pages have to name it explicitly or they ship no og:image at all.
  const ogImage = image
    ? typeof image === 'string'
      ? { url: image, width: 1200, height: 630 }
      : image
    : { url: '/opengraph-image', width: 1200, height: 630 }
  return {
    title,
    // Without this the page inherits the layout's description, so every page
    // ships the same one — duplicate meta descriptions across the whole site.
    description: description || siteMetadata.description,
    openGraph: {
      title: `${title} - ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: './',
      siteName: siteMetadata.title,
      images: [ogImage],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      card: 'summary_large_image',
      images: [ogImage],
    },
    ...rest,
  }
}

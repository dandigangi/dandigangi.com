import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

const defaultOgImage = {
  url: siteMetadata.socialBanner,
  width: 1200,
  height: 630,
}

export function genPageMetadata({ title, description, image, ...rest }: PageSEOProps): Metadata {
  const ogImage = image
    ? typeof image === 'string'
      ? { url: image, width: 1200, height: 630 }
      : image
    : defaultOgImage
  return {
    title,
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

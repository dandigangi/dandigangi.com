import '@/css/globals.css'
import '@/css/prism.css'

import type { Metadata } from 'next'
import { Archivo, IBM_Plex_Mono } from 'next/font/google'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import siteMetadata from '@/data/siteMetadata'
import ThemeScript from '@/components/ThemeScript'
import Footer from '@/components/Footer'
import PikachuCameo from '@/components/PikachuCameo'
import Parallax from '@/components/Parallax'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-display',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    // Named explicitly rather than left to opengraph-image.tsx: the file
    // convention appends a content hash, and LinkedIn shrinks any og:image
    // carrying a query string to a 160px thumbnail. The home page repeats this
    // in its own metadata, since layout metadata loses to the convention file.
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    card: 'summary_large_image',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={siteMetadata.language}
      className={`${archivo.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        {/* Purpose-built favicons exist in /static/favicons; the previous site
            pointed these at the full logo PNG, which browsers then downscaled. */}
        <link rel="icon" type="image/x-icon" href="/static/favicons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/static/favicons/apple-touch-icon-180.png"
        />
        <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#000000" />
        <link rel="manifest" href="/static/favicons/site.webmanifest" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#EDEDEB" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body>
        <a href="#main-content" className="srOnly">
          Skip to main content
        </a>
        {/* Mounted here, not per page: every banded page consumes --par-band,
            so the scroll listener has to run site-wide, not just on home. */}
        <Parallax />
        <main id="main-content">{children}</main>
        <Footer />
        <PikachuCameo />
        <VercelAnalytics />
      </body>
    </html>
  )
}

import '@/css/globals.css'
import '@/css/prism.css'

import type { Metadata } from 'next'
import { Archivo, IBM_Plex_Mono } from 'next/font/google'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import Script from 'next/script'
import siteMetadata from '@/data/siteMetadata'
import ThemeScript from '@/components/ThemeScript'
import Footer from '@/components/Footer'

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
    images: [{ url: siteMetadata.socialBanner, width: 1200, height: 630 }],
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
    images: [{ url: siteMetadata.socialBanner, width: 1200, height: 630 }],
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
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/static/images/dan-digangi-logo-light.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/images/dan-digangi-logo-light.png"
        />
        <link rel="manifest" href="/static/favicons/site.webmanifest" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#EDEDEB" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body>
        <a href="#main-content" className="srOnly">
          Skip to main content
        </a>
        <main id="main-content">{children}</main>
        <Footer />
        <VercelAnalytics />
        {process.env.ANALYTICS_SMARTLOOK_ID?.length === 40 && (
          <Script
            id="analytics-smartlook"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `window.smartlook||(function(d) {var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);})(document);smartlook('init', '${process.env.ANALYTICS_SMARTLOOK_ID}', { region: 'eu' });`,
            }}
          />
        )}
      </body>
    </html>
  )
}

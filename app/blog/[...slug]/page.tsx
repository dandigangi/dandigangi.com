import 'css/prism.css'
import 'katex/dist/katex.css'

import PageTitle from '@/components/PageTitle'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent, type CoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import type { Authors, Blog } from 'contentlayer/generated'
import { getPublishedBlogs } from '@/lib/blog'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import Link from '@/components/Link'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join('/'))
  const post = allBlogs.find((p) => p.slug === slug)
  if (!post) {
    return
  }

  const defaultAuthor = allAuthors.find((p) => p.slug === 'default')
  const authorList = post.authors || ['default']
  const authorDetails = authorList
    .map((author) => {
      const found = allAuthors.find((p) => p.slug === author) ?? defaultAuthor
      return found ? coreContent(found as Authors) : null
    })
    .filter((a): a is CoreContent<Authors> => a != null)

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    const url = img.includes('http') ? img : siteMetadata.siteUrl + img
    return { url, width: 1200, height: 630 }
  })

  const canonicalUrl =
    (post as Blog & { canonicalUrl?: string }).canonicalUrl ||
    `${siteMetadata.siteUrl}/blog/${slug}`

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: canonicalUrl,
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: ogImages,
    },
  }
}

export const generateStaticParams = async () => {
  const paths = getPublishedBlogs().map((p) => ({ slug: p.slug.split('/') }))

  return paths
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))
  const sortedCoreContents = allCoreContent(sortPosts(getPublishedBlogs()))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)

  if (postIndex === -1) {
    return (
      <div className="mt-24 text-center">
        <PageTitle>Oops. This isn't here.</PageTitle>
        <br />
        <h2>
          Looks like this content isn't here right now. Head back to my{' '}
          <Link href="/blog">blog</Link> for other things & stuff.
        </h2>
      </div>
    )
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = allBlogs.find((p) => p.slug === slug) as Blog
  const defaultAuthor = allAuthors.find((p) => p.slug === 'default')
  const authorList = post?.authors || ['default']
  const authorDetails = authorList
    .map((author) => {
      const found = allAuthors.find((p) => p.slug === author) ?? defaultAuthor
      return found ? coreContent(found as Authors) : null
    })
    .filter((a): a is CoreContent<Authors> => a != null)
  const mainContent = coreContent(post)
  const jsonLd = post.structuredData

  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    }
  })

  const Layout = layouts[post.layout || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}

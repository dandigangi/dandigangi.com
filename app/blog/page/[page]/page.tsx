import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { getPublishedBlogs } from '@/lib/blog'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

const POSTS_PER_PAGE = 7

const BLOG_DESCRIPTION =
  'Blog posts and articles on engineering leadership, management, hiring, and career.'

export async function generateMetadata({
  params,
}: {
  params: { page: string }
}): Promise<Metadata> {
  const pageNumber = parseInt(params.page, 10)
  const title = pageNumber === 1 ? 'Blog' : `Blog – Page ${pageNumber}`
  const canonicalUrl =
    pageNumber === 1
      ? `${siteMetadata.siteUrl}/blog`
      : `${siteMetadata.siteUrl}/blog/page/${pageNumber}`

  return {
    title,
    description: BLOG_DESCRIPTION,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${title} - ${siteMetadata.title}`,
      description: BLOG_DESCRIPTION,
      url: canonicalUrl,
      siteName: siteMetadata.title,
      images: [siteMetadata.socialBanner],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteMetadata.title}`,
      description: BLOG_DESCRIPTION,
      images: [siteMetadata.socialBanner],
    },
  }
}

export const generateStaticParams = async () => {
  const published = getPublishedBlogs()
  const totalPages = Math.ceil(published.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export default function Page({ params }: { params: { page: string } }) {
  const posts = allCoreContent(sortPosts(getPublishedBlogs()))
  const pageNumber = parseInt(params.page as string)
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}

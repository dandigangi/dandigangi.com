import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { getPublishedBlogs } from '@/lib/blog'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'

function getTagTitle(tagSlug: string): string {
  // Prettify slug like "engineering-management" -> "Engineering Management"
  return tagSlug
    .split('-')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ')
}

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = decodeURI(params.tag)
  const prettyTag = getTagTitle(tag)
  const title = `${prettyTag} Blog Posts`
  return genPageMetadata({
    title,
    description: `${siteMetadata.title} ${prettyTag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/blog/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const paths = tagKeys.map((tag) => ({
    tag: tag,
  }))
  return paths
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURI(params.tag)
  const title = getTagTitle(tag)
  const published = getPublishedBlogs()
  const filteredPosts = allCoreContent(
    sortPosts(published.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  )
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <PageHeader title="Blog" />
        <ListLayout posts={filteredPosts} title={title} />
      </div>
    </>
  )
}

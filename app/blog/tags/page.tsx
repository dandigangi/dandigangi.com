import Link from 'next/link'
import { getTagCounts } from '@/lib/blog'
import { formatTag } from '@/lib/format'
import PageBand from '@/components/PageBand'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Tags',
  description: 'Browse posts by topic.',
  alternates: { canonical: '/blog/tags' },
})

export default function TagsPage() {
  const tags = Object.entries(getTagCounts()).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  )

  return (
    <>
      <PageBand title="Tags" objectPosition="45% 50%" />

      <div className="container">
        <div
          className="rail"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            paddingTop: 72,
            paddingBottom: 110,
          }}
        >
          {tags.map(([tag, count]) => (
            <Link key={tag} href={`/blog/tags/${tag}`} className="chip">
              {formatTag(tag)} ({count})
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

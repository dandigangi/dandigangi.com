import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
        <p className="pb-2">
          Currently looking for a new software engineering manager role opportunity after an
          unfortunate layoff.
        </p>
        <p className="pb-2">
          Ready for the next move to follow my passion for building and leading high performance,
          diverse teams with the track record to back it up. 20+ years in engineering and 5+ years
          of management.
        </p>
        <p className="pb-2">
          In the past my teams have delivered large-scale, complex software projects for companies
          like DocuSign, Apartments.com, and ActiveCampaign to name a few.
        </p>
      </AuthorLayout>
    </>
  )
}

import PageHeader from '@/components/PageHeader'
import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Connect - Contact Dan DiGangi',
  description: 'Get in touch – speaking, writing, mentoring, and contact information.',
  alternates: { canonical: '/connect' },
})

export default function Connect() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <PageHeader title="Connect" />
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="prose max-w-none pb-8 pt-8 dark:prose-invert xl:col-span-2 text-2xl font-normal">
            <p className="pb-2">
              <span className="font-semibold">Email</span>:{' '}
              <a href="mail&#116;o&#58;d&#37;61nd%69%67a%6E&#103;i&#64;pr&#111;t&#111;n&#46;&#37;6D&#101;">
                da&#110;d&#105;gangi&#64;pr&#111;&#116;on&#46;m&#101;
              </a>
            </p>
            <div className="text-lg">
              <h2>Speaking, Writing, and Related</h2>
              <p>
                I'm interested in doing more speaking, writing, videocasts, and podcasts. My typical
                topics include technical leadership, engineering management, building high
                performance teams, hiring and interviews, mental health in tech, and DEI.
              </p>
              <p>
                <Link href="/blog">Examples of past work</Link> are posted on my blog.
              </p>
              <hr className="h-px my-12 bg-gray-200 border-0 dark:bg-gray-700" />
              <h2>Coaching & Mentoring</h2>
              <p>
                If you're a software engineer, engineering leader, product owner, or designer at any
                level I'd love to connect. I've worked with engineers ranging from junior to staff
                and technical leaders across a variety of industries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

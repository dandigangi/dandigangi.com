import PageHeader from '@/components/PageHeader'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Connect' })

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
              <h3>Speaking, Writing, and Related</h3>
              <p>
                I'm interested in doing more speaking, writing, videocasts, and podcasts. Technical
                leadership, management, building high performance teams, hiring/interviews, and DEI
                are my typical topics.
              </p>
              <p>
                <a href="/blog">Examples of what I've done in the past</a> are posted on my blog.
              </p>
              <hr className="h-px my-12 bg-gray-200 border-0 dark:bg-gray-700" />
              <h3>Coaching/Mentoring</h3>
              <p>
                If you're a software engineer, product owner, or designer at any level of
                experience/role I'd be happy to connect on coaching.
              </p>
              <p>Look forward to hearing from you soon.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

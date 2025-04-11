import Button from '@/components/Button'
import PageHeader from '@/components/PageHeader'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Connect' })

export default function Connect() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <PageHeader title="Connect" />
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="prose max-w-none pb-8 dark:prose-invert xl:col-span-2 text-2xl font-normal">
            <div className="text-lg">
              <h2>Contact Me</h2>
              <p>
                The best way to get ahold of me is via <a href="https://x.com/dandigangi" target="_blank">X</a>, <a href="https://linkedin.com/in/dandigangi" target="_blank">LinkedIn</a>, or <a href="mail&#116;o&#58;d&#37;61nd%69%67a%6E&#103;i&#64;pr&#111;t&#111;n&#46;&#37;6D&#101;">email</a>.
              </p>
              <hr className="h-px my-12 bg-gray-200 border-0 dark:bg-gray-700" />
              <h3>Content Creation</h3>
              <p>
                I'm interested in doing more content such as speaking, writing, streams, podcasts, etc. Typically I talk about engineering leadership, management, building high performance engineering teams, and hiring processes.
              </p>
              <p>
                <a href="/blog">Examples of what I've done in the past</a> are posted on my blog.
              </p>
              <hr className="h-px my-12 bg-gray-200 border-0 dark:bg-gray-700" />
              <h3>Mentoring</h3>
              <p>
                If you're a software engineer, product owner, designer, or engineering leader at any level of
                experience/role I'd be happy to connect on mentoring. I mentor 2-3 individuals every few months, free.
              </p>
              <p>Please get in touch anytime. Look forward to hearing from you. 🥸</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

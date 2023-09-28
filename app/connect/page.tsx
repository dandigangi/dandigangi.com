import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Connect' })

export default function Connect() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Connect
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="prose max-w-none pb-8 pt-8 dark:prose-invert xl:col-span-2 text-2xl font-normal">
            <p className="pb-2">
              Email:{' '}
              <a href="mail&#116;o&#58;d&#37;61nd%69%67a%6E&#103;i&#64;pr&#111;t&#111;n&#46;&#37;6D&#101;">
                da&#110;d&#105;gangi&#64;pr&#111;&#116;on&#46;m&#101;
              </a>
            </p>
            <p className="pb-2">
              Currently looking for a new software engineering manager role opportunity after an
              unfortunate layoff. Check out the <a href="/about">About page</a> and my{' '}
              <a target="_blank" href="https://linkedin.com/in/dandigangi">
                LinkedIn
              </a>{' '}
              for more info.
            </p>
            <p className="text-base">
              <em>Resume and references available on request.</em>
            </p>
            <hr className="h-px my-12 bg-gray-200 border-0 dark:bg-gray-700" />
            <div className="text-lg">
              <p>
                Other than that I'm interested in speaking and writing on technical leadership,
                building teams, and software engineering. Areas I've been deep into are
                hiring/interviewing, user experience/design, strategy, and coaching/mentoring. See
                below for info on mentoring.
              </p>
              <p>
                Outside of the 9-5 I'm building a variety of businesses/side hustles. Would love to
                connect.
              </p>
              <p>
                <a href="/blog">Examples of what I've done in the past</a> are posted on my blog.
              </p>
              <hr className="h-px my-12 bg-gray-200 border-0 dark:bg-gray-700" />
              <p>
                Paid and free coaching spots open if you're a software engineer, product owner, or
                designer at any level of experience/role. Recently crossed coaching over 100 people
                ranging from junior to senior, staff, and even high level leadership.
              </p>
              <p>
                Last thing! Looking for potential partners and collaboraters on a conference I
                co-founded. It's called{' '}
                <a target="_blank" href="https://2019.reactloop.com">
                  React Loop
                </a>{' '}
                and it's the only ReactJS conference in Chicago.
              </p>
              <p>
                Look forward to hearing from you -{' '}
                <a href="mail&#116;o&#58;d&#37;61nd%69%67a%6E&#103;i&#64;pr&#111;t&#111;n&#46;&#37;6D&#101;">
                  da&#110;d&#105;gangi&#64;pr&#111;&#116;on&#46;m&#101;
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

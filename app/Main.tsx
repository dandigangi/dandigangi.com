import Link from '@/components/Link'
import RandomLinkBox from '@/components/RandomLinkBox'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import NewsletterForm from 'pliny/ui/NewsletterForm'

const MAX_DISPLAY = 5

/** Parse as calendar date so the same day displays in all timezones. */
function toCalendarDate(date) {
  const iso =
    typeof date === 'string'
      ? date.includes('T')
        ? date
        : `${date}T12:00:00Z`
      : new Date(date).toISOString()
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d)
}

const listDateTemplate: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}

/** Fisher–Yates shuffle; returns a new array. */
function shuffle(arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export default function Home({ posts }) {
  const remainingPosts = posts.slice(MAX_DISPLAY).filter((p) => !p.draft)
  const morePosts = shuffle(remainingPosts).slice(0, 5)
  return (
    <>
      <div id="layout-main" className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-7 lg:pt-14 md:space-y-5">
          <h3 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl sm:leading-10 md:text-4xl md:leading-9">
            Latest Posts
          </h3>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 !border-t-0">
          {!posts.length && 'No blog posts just yet but they are coming.'}

          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags, draft } = post
            {
              if (draft) {
                return false
              }
            }

            return (
              <li key={slug} className="py-8 first:pt-7">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>
                          {toCalendarDate(date).toLocaleDateString(
                            siteMetadata.locale,
                            listDateTemplate
                          )}
                        </time>
                      </dd>
                    </dl>
                    <div className="space-y-4 xl:col-span-3">
                      <div className="space-y-5">
                        <div>
                          <h2 className="mb-2 text-2xl font-bold leading-8 tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                              aria-label={`Blog post "${title}"`}
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none md:text-lg text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="pt-4 text-base font-medium leading-6">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read blog post "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
        {posts.length > MAX_DISPLAY && (
          <div className="pt-6 pb-6 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 md:gap-8">
            <RandomLinkBox />
            <div className="min-w-0">
              <h4 className="mb-3 text-base font-semibold text-gray-700 dark:text-gray-300">
                More things & stuff to check out.
              </h4>
              <ul className="list-none space-y-1.5 text-base">
                {morePosts.map((post) => {
                  const { slug, title } = post
                  return (
                    <li key={slug} className="min-w-0 overflow-hidden">
                      <Link
                        href={`/blog/${slug}`}
                        className="block truncate text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                        aria-label={`Blog post "${title}"`}
                        title={title}
                      >
                        {title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6 pt-4">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="View all blog posts"
          >
            All Posts ({posts.length}) &rarr;
          </Link>
        </div>
      )}
      {/* {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )} */}
    </>
  )
}

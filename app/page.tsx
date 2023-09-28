import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  const getRandomQuote = () => {
    const quotes = ['Build experiences, not software', 'Lift others before yourself']
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
          Dan DiGangi
        </h1>
        <h2 className="text-2xl md:text-2xl">
          Senior Software Engineering Manager, Tech Mentor, Conference Organizer
        </h2>
        <div className="mt-6">
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            <em>{getRandomQuote()}</em>
          </p>
        </div>
        <br />
        <div className="mt-8">
          <p className="mb-2">Looking for new engineering management opportunities</p>
          <p>
            <a
              target="_blank"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              href="https://linkedin.com/in/dandigangi"
            >
              LinkedIn &rarr;
            </a>
            &nbsp;&nbsp;&nbsp;
            <a
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              href="/connect"
            >
              Contact Me &rarr;
            </a>
          </p>
        </div>
      </div>
      <Main posts={posts} />
    </div>
  )
}

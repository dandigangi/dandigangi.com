import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'

// Page: Home
export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
          Dan DiGangi
        </h1>
        <h2 className="text-2xl md:text-2xl">
          Software Engineering Manager, Tech Instructor/Mentor
        </h2>
        <div className="mt-6">
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            <em>Build experiences, not software</em>
          </p>
        </div>
        <br />
        <div className="mt-8">
          <p className="mb-2 pt-3">
            Looking for new engineering management opportunities (Laid Off)
          </p>
          <p>
            <a
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              href="/about"
            >
              About Me &rarr;
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              href="/connect"
            >
              Connect &rarr;
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a
              target="_blank"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              href="https://linkedin.com/in/dandigangi"
            >
              LinkedIn &rarr;
            </a>
          </p>
        </div>
      </div>
      <Main posts={posts} />
    </div>
  )
}

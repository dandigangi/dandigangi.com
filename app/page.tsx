import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  const getRandomQuote = () => {
    const quotes = [
      'Build experiences, not software',
      'Lift others before yourself',
      'Your success is making your team successful',
      'The best teams are diverse in thought, background, and experience',
      'Code is always ones and zeroes but people are dynamic and change often',
      'Build the best experiences with customer first thinking and add value through impact',
      'Always consider context in your actions and decisions',
      'Dogma is a dangerous style of thinking in technology',
      'Use the right tools for the right problem',
      'Build and enable a team of superheroes, not just your best engineers',
      'Ownership is ensuring the success from A-Z, not doing all the work yourself',
      'Mentoring can flow in any direction, not just downward',
    ]

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
          <p className="mb-2">Looking for new engineering management opportunities (Laid Off)</p>
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

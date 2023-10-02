import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'

// Page: Home
export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  const getRandomQuote = () => {
    const DANS_QUOTES = [
      'Build experiences, not software',
      'Lift others before yourself',
      "A leader's success is making their team successful",
      'The best teams are diverse in thought, background, and experience',
      'Code is ones/zeroes but people are dynamic and change often',
      'Build the best experiences with customer first thinking',
      'True impact pushes the needle forward',
      'Perfect code does not exist',
      'Complex problems are made simpler by compartmentalizing',
      'Always consider context in your actions and decisions',
      'Dogma is in technology',
      'Absolutes are rarely true',
      'Use the right tools for the right problem',
      'Enable a team of superheroes vs one or two of your best',
      'Ownership is ensuring success from A-Z, not doing all the work yourself',
      'Leaders scale teams, people, and themselves',
      'All roles on a team matter and can offer value/impact',
      'Support every level of engineer',
      'Mentoring can flow in any direction, not just downward',
      'Be a leader, not a manager',
    ]

    // TODO: Timeout to rotate and check localStorage for prev quote but Next SSR so need to ensure window.localStorage is available to call
    // Will return same quote again and again without checking prev val
    // Maybe just useState but in async fx need different impl, will do later so site can go live
    return DANS_QUOTES[Math.floor(Math.random() * DANS_QUOTES.length)]
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

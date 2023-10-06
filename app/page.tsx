import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import random from 'lodash/random'

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
      'Complex problems are made simpler by compartmentalization',
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
      'Be a leader before a manager',
      'Never forget the importance of relationships with cross functional partners',
      'Good solutions come from understanding the pros and cons of different approaches',
    ]

    return DANS_QUOTES[random(0, DANS_QUOTES.length)]
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
            {/* <em>{getRandomQuote()}</em> */}
            <em>Build experiences, not software</em>
          </p>
        </div>
        <br />
        <div
          className="flex items-center p-4 mb-4 text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 mr-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div>
            Attending the{' '}
            <a
              target="_blank"
              href="https://leaddev.com/leaddev-west-coast"
              className="font-semibold underline hover:no-underline"
            >
              LeadDev West Coast
            </a>{' '}
            engineering manager conference Oct. 15-18th in SF/Oakland. Let's meet up!
          </div>
        </div>
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

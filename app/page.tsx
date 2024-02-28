import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import Link from 'next/link'
import Image from 'next/image'

import DocuSignLogoLeft from '/public/static/images/xp/docusign-left.png'
import DocuSignLogoCenter from '/public/static/images/xp/docusign-center.png'
import ApartmentsComLogo from '/public/static/images/xp/apartmentscom.png'
import ArriveLogisticsLogo from '/public/static/images/xp/arrivelogistics.png'
import ActiveCampaignLogo from '/public/static/images/xp/activecampaign.png'
import OpenLaneLogo from '/public/static/images/xp/openlane.png'

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
        <div className="mt-7">
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            <em>Build experiences, not software</em>
          </p>
        </div>
        <div className="mt-8 pt-4">
          <p className="mb-2 pt-3">
            Looking for new engineering management opportunities (Laid Off)
          </p>
          <p>
            <a
              rel="noopener"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              href="/about"
            >
              About Me &rarr;
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a
              rel="noopener"
              target="_blank"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              href="https://linkedin.com/in/dandigangi"
            >
              LinkedIn &rarr;
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a
              rel="noopener"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              href="/connect"
            >
              Connect &rarr;
            </a>
          </p>
        </div>
        <div className="pb-4">
          <h2 className="pt-8 mb-6 text-md text-gray-900 dark:text-white md:sm">[ PREVIOUSLY ]</h2>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-3 xl:grid xl:grid-cols-5 xl:gap-6">
            <div>
              <Link
                className="hidden xl:inline-block"
                href="https://docusign.com"
                aria-label="Link to DocuSign"
                target="_blank"
              >
                <Image
                  alt={'Previously worked at DocuSign'}
                  src={DocuSignLogoLeft}
                  width={544}
                  height={306}
                />
              </Link>
              <Link
                href="https://docusign.com"
                aria-label="Link to DocuSign"
                target="_blank"
                className="xl:hidden"
              >
                <Image
                  alt={'Previously worked at DocuSign'}
                  src={DocuSignLogoCenter}
                  width={544}
                  height={306}
                />
              </Link>
            </div>
            <div className="relative xl:right-12">
              <Link
                href="https://apartments.com"
                aria-label="Link to Apartments.com"
                target="_blank"
              >
                <Image
                  alt={'Previously worked at Apartments.com'}
                  src={ApartmentsComLogo}
                  width={544}
                  height={306}
                />
              </Link>
            </div>
            <div className="relative xl:right-8">
              <Link
                href="https://activecampaign.com"
                aria-label="Link to Active Campaign"
                target="_blank"
              >
                <Image
                  alt={'Previously worked at Active Campaign'}
                  src={ActiveCampaignLogo}
                  width={544}
                  height={306}
                />
              </Link>
            </div>
            <div className="relative xl:right-2">
              <Link
                href="https://arrivelogistics.com"
                aria-label="Link to DocuSign"
                target="_blank"
              >
                <Image
                  alt={'Previously worked at Arrive Logistics'}
                  src={ArriveLogisticsLogo}
                  width={544}
                  height={306}
                />
              </Link>
            </div>
            <div className="hidden sm:inline-block md:inline-block">
              <Link
                className="hidden sm:inline-block md:inline-block"
                href="https://openlane.com"
                aria-label="Link to OpenLane"
                target="_blank"
              >
                <Image
                  alt={'Previously worked at OpenLane'}
                  src={OpenLaneLogo}
                  width={544}
                  height={306}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Main posts={posts} />
    </div>
  )
}

import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { getPublishedBlogs } from '@/lib/blog'
import Main from './Main'
import Link from 'next/link'
import Image from 'next/image'

import DocuSignLogoCenter from '/public/static/images/xp/docusign.png'
import ApartmentsComLogo from '/public/static/images/xp/apartmentscom.png'
import ArriveLogisticsLogo from '/public/static/images/xp/arrivelogistics.png'
import ActiveCampaignLogo from '/public/static/images/xp/activecampaign.png'
import OpenLaneLogo from '/public/static/images/xp/openlane.png'

// Page: Home
export default async function Page() {
  const sortedPosts = sortPosts(getPublishedBlogs())
  const posts = allCoreContent(sortedPosts)

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
          Dan DiGangi
        </h1>
        <h2 className="text-2xl md:text-2xl">Senior Software Engineering Manager</h2>
        <div className="mt-7">
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            <em>build experiences, not software</em>
          </p>
        </div>
        <div className="flex flex-col gap-8 pt-8 pb-4 lg:flex-row lg:gap-20">
          <div className="lg:min-w-0 lg:max-w-[360px] lg:flex-shrink-0">
            <h2 className="mb-6 text-sm text-gray-900 dark:text-white md:text-base">[ CURRENT ]</h2>
            <Link
              href="https://postmarkapp.com"
              aria-label="Link to Postmark"
              target="_blank"
              className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            >
              <Image
                alt="Postmark"
                src="/static/images/xp/postmark.svg"
                width={245}
                height={54}
                className="dark:invert"
              />
            </Link>
            <p className="mt-4 text-gray-900 dark:text-white">
              Senior Software Engineering Manager
            </p>
          </div>
          <div className="lg:min-w-0 lg:flex-1">
            <h2 className="mb-6 text-sm text-gray-900 dark:text-white md:text-base">
              [ PREVIOUSLY ]
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              <Link
                href="https://docusign.com"
                aria-label="Link to DocuSign.com"
                target="_blank"
                className="flex items-center justify-start focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                <span className="inline-block dark:[filter:brightness(0)_invert(1)]">
                  <Image
                    alt="Previously worked at DocuSign"
                    src={DocuSignLogoCenter}
                    width={180}
                    height={100}
                    className="object-contain"
                  />
                </span>
              </Link>
              <Link
                href="https://apartments.com"
                aria-label="Link to Apartments.com"
                target="_blank"
                className="flex items-center justify-start focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                <span className="inline-block dark:[filter:brightness(0)_invert(1)]">
                  <Image
                    alt="Previously worked at Apartments.com"
                    src={ApartmentsComLogo}
                    width={180}
                    height={100}
                    className="object-contain"
                  />
                </span>
              </Link>
              <Link
                href="https://activecampaign.com"
                aria-label="Link to ActiveCampaign.com"
                target="_blank"
                className="flex items-center justify-start focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                <span className="inline-block dark:[filter:brightness(0)_invert(1)]">
                  <Image
                    alt="Previously worked at Active Campaign"
                    src={ActiveCampaignLogo}
                    width={180}
                    height={100}
                    className="object-contain"
                  />
                </span>
              </Link>
              <Link
                href="https://arrivelogistics.com"
                aria-label="Link to ArriveLogistics.com"
                target="_blank"
                className="flex items-center justify-start focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                <span className="inline-block dark:[filter:brightness(0)_invert(1)]">
                  <Image
                    alt="Previously worked at Arrive Logistics"
                    src={ArriveLogisticsLogo}
                    width={180}
                    height={100}
                    className="object-contain"
                  />
                </span>
              </Link>
              <Link
                href="https://openlane.com"
                aria-label="Link to OpenLane.com"
                target="_blank"
                className="flex items-center justify-start focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                <span className="inline-block dark:[filter:brightness(0)_invert(1)]">
                  <Image
                    alt="Previously worked at OpenLane"
                    src={OpenLaneLogo}
                    width={180}
                    height={100}
                    className="object-contain"
                  />
                </span>
              </Link>
              <Link
                href="https://www.clearstorydata.com"
                aria-label="Link to ClearStory Data"
                target="_blank"
                className="flex items-center justify-start focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                <span className="inline-block dark:[filter:brightness(0)_invert(1)]">
                  <Image
                    alt="Previously worked at ClearStory Data"
                    src="/static/images/xp/clearstorydata.svg"
                    width={180}
                    height={68}
                    className="object-contain"
                  />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Main posts={posts} />
    </div>
  )
}

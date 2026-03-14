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
        <div className="space-y-1.5">
          <h1 className="text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            Dan DiGangi
          </h1>
          <h2 className="text-2xl md:text-2xl">Senior Software Engineering Manager</h2>
        </div>
        <div className="mt-7">
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            <em>build experiences, not software</em>
          </p>
        </div>
        <div className="flex flex-col gap-8 pt-8 pb-4 lg:flex-row lg:gap-24">
          <div className="flex flex-col lg:min-w-0 lg:max-w-[420px] lg:flex-shrink-0">
            <h2 className="mb-6 text-xs text-gray-900 dark:text-white md:text-sm">[ CURRENT ]</h2>
            <div className="flex flex-1 flex-col justify-center">
              <Link
                href="https://postmarkapp.com"
                aria-label="Link to Postmark"
                target="_blank"
                className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                <Image
                  alt="Postmark"
                  src="/static/images/xp/postmark.svg"
                  width={200}
                  height={44}
                  className="dark:invert"
                />
              </Link>
              <p className="mt-4 text-gray-900 dark:text-white">
                Senior Software Engineering Manager
              </p>
              <Link
                href="https://linkedin.com/in/dandigangi"
                aria-label="Dan DiGangi on LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                LinkedIn
              </Link>
            </div>
          </div>
          <div className="flex flex-col lg:min-w-0 lg:flex-1">
            <h2 className="mb-6 text-xs text-gray-900 dark:text-white md:text-sm">[ PREVIOUS ]</h2>
            <div className="flex flex-1 items-center">
              <div className="grid auto-rows-[68px] grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-2">
                <Link
                  href="https://docusign.com"
                  aria-label="Link to DocuSign.com"
                  target="_blank"
                  className="flex items-center justify-start focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  <span className="inline-block max-w-[180px] max-h-[60px] dark:[filter:brightness(0)_invert(1)]">
                    <Image
                      alt="Previously worked at DocuSign"
                      src={DocuSignLogoCenter}
                      width={180}
                      height={60}
                      className="object-contain max-w-full max-h-full"
                    />
                  </span>
                </Link>
                <Link
                  href="https://apartments.com"
                  aria-label="Link to Apartments.com"
                  target="_blank"
                  className="flex items-center justify-start focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  <span className="inline-block max-w-[160px] max-h-[56px] dark:[filter:brightness(0)_invert(1)]">
                    <Image
                      alt="Previously worked at Apartments.com"
                      src={ApartmentsComLogo}
                      width={160}
                      height={56}
                      className="object-contain max-w-full max-h-full"
                    />
                  </span>
                </Link>
                <Link
                  href="https://activecampaign.com"
                  aria-label="Link to ActiveCampaign.com"
                  target="_blank"
                  className="flex items-center justify-start focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  <span className="inline-block max-w-[160px] max-h-[56px] dark:[filter:brightness(0)_invert(1)]">
                    <Image
                      alt="Previously worked at Active Campaign"
                      src={ActiveCampaignLogo}
                      width={160}
                      height={56}
                      className="object-contain max-w-full max-h-full"
                    />
                  </span>
                </Link>
                <Link
                  href="https://arrivelogistics.com"
                  aria-label="Link to ArriveLogistics.com"
                  target="_blank"
                  className="flex items-center justify-start focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  <span className="inline-block max-w-[160px] max-h-[56px] dark:[filter:brightness(0)_invert(1)]">
                    <Image
                      alt="Previously worked at Arrive Logistics"
                      src={ArriveLogisticsLogo}
                      width={160}
                      height={56}
                      className="object-contain max-w-full max-h-full"
                    />
                  </span>
                </Link>
                <Link
                  href="https://openlane.com"
                  aria-label="Link to OpenLane.com"
                  target="_blank"
                  className="flex items-center justify-start focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  <span className="inline-block max-w-[140px] max-h-[48px] dark:[filter:brightness(0)_invert(1)]">
                    <Image
                      alt="Previously worked at OpenLane"
                      src={OpenLaneLogo}
                      width={140}
                      height={48}
                      className="object-contain max-w-full max-h-full"
                    />
                  </span>
                </Link>
                <Link
                  href="https://www.alteryx.com/"
                  aria-label="Link to Alteryx (ClearStory Data acquired by Alteryx)"
                  target="_blank"
                  className="flex items-center justify-start focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  <span className="inline-block max-w-[160px] max-h-[56px] dark:[filter:brightness(0)_invert(1)]">
                    <Image
                      alt="Previously worked at ClearStory Data"
                      src="/static/images/xp/clearstorydata.svg"
                      width={160}
                      height={56}
                      className="object-contain max-w-full max-h-full"
                    />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Main posts={posts} />
    </div>
  )
}

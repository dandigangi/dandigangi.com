/* eslint-disable react/no-unescaped-entities */
'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import navLinks from '@/data/navLinks'
import LogoLight from '/public/static/images/dan-digangi-logo-light.png'
import Image from '@/components/Image'
import Link from './Link'
import MobileNav from './MobileNav'

const SearchButton = dynamic(() => import('@/components/SearchButton'), { ssr: false })

const Header = () => {
  const pathname = usePathname()
  const isResumePage =
    pathname === '/resume' || (pathname.startsWith('/resume') && pathname !== '/resume/')
  const downloadHref =
    'https://drive.google.com/file/d/11-rvQ2_RwaGHVLORNI5Vv-A4f8Llyy0s/view?usp=sharing'

  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link
          href="/"
          aria-label={siteMetadata.headerTitle}
          className="-m-2 inline-block p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 rounded"
        >
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <Image
                alt="Dan DiGangi - Senior Software Engineering Manager"
                src={LogoLight}
                width={39}
                height={39}
                priority
                style={{
                  boxShadow: '0 !important',
                  borderRadius: '0 !important',
                  border: 0,
                  width: 'auto',
                  height: 'auto',
                }}
              />
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-6 text-2xl font-semibold sm:block">
                {siteMetadata.headerTitle}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
      </div>
      <nav>
        <div className="flex items-center leading-5 space-x-4 sm:space-x-6">
          {isResumePage ? (
            <div className="flex flex-col items-end">
              <Link
                href={downloadHref}
                aria-label="Download resume"
                className="inline-flex items-center justify-center bg-violet-800 hover:bg-violet-900 px-3 py-1.5 rounded-md text-white text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                Download Resume
              </Link>
              <Link
                href="/"
                aria-label="Back to website"
                className="mt-4 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-light inline-flex items-center gap-1 text-sm"
              >
                &larr; Back to website
              </Link>
            </div>
          ) : (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="hidden sm:block font-medium text-gray-900 dark:text-gray-100 py-2.5 px-3 -my-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 rounded"
                  aria-label={`Link to ${link.title} page`}
                >
                  {link.title}
                </Link>
              ))}
              <SearchButton />
              {/* <ThemeSwitch /> */}
              <MobileNav />
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header

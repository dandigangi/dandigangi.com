'use client'

import { useState } from 'react'
import Link from './Link'
import navLinks from '@/data/navLinks'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto'
      } else {
        // Prevent scrolling
        document.body.style.overflow = 'hidden'
      }
      return !status
    })
  }

  return (
    <>
      <button aria-label="Toggle Menu" onClick={onToggleNav} className="sm:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="text-gray-900 dark:text-gray-100 h-8 w-8"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={`fixed inset-0 z-10 flex flex-col transform opacity-95 dark:opacity-[0.98] bg-white duration-300 ease-in-out dark:bg-gray-950 pt-[env(safe-area-inset-top)] ${
          navShow ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end shrink-0">
          <button
            className="mr-6 mt-6 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close menu"
            onClick={onToggleNav}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="text-gray-900 dark:text-gray-100 h-8 w-8"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-auto px-8 pb-[env(safe-area-inset-bottom)]">
          {navLinks.map((link) => (
            <div key={link.title} className="py-4">
              <Link
                href={link.href}
                className="flex min-h-[44px] items-center py-2 text-2xl font-bold tracking-widest text-gray-900 dark:text-gray-100"
                onClick={onToggleNav}
                aria-label={`Link to ${link.title} page`}
              >
                {link.title}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}

export default MobileNav

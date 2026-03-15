/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import RandomLinkBox from '@/components/RandomLinkBox'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div id="layout-listlayoutwithtags" className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex items-center justify-between gap-4" aria-label="Blog pagination">
        {!prevPage && (
          <button
            type="button"
            className="min-h-[44px] min-w-[44px] cursor-auto rounded px-4 disabled:opacity-50"
            disabled
            aria-disabled="true"
          >
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
            className="min-h-[44px] flex items-center px-4"
          >
            Previous
          </Link>
        )}
        <span className="shrink-0 text-sm">
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button
            type="button"
            className="min-h-[44px] min-w-[44px] cursor-auto rounded px-4 disabled:opacity-50"
            disabled
            aria-disabled="true"
          >
            Next
          </button>
        )}
        {nextPage && (
          <Link
            href={`/${basePath}/page/${currentPage + 1}`}
            rel="next"
            className="min-h-[44px] flex items-center px-4"
          >
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div>
        <div className="pb-6 pt-6">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl md:text-3xl">
            {title} <span className="font-normal">({posts.length})</span>
          </h1>
        </div>
        <div className="flex sm:space-x-24">
          <div className="hidden sm:flex sm:flex-col min-w-[320px] max-w-[320px] gap-8">
            <div className="max-h-screen flex flex-wrap bg-gray-50 dark:bg-gray-900/70 shadow-md pt-5 pb-5 dark:shadow-gray-800/40 rounded overflow-auto shrink-0">
              <div className="py-4 px-6">
                <ul>
                  {sortedTags.map((t) => {
                    const count = ` (${tagCounts[t]})`
                    return (
                      <li key={t} className="my-1.5">
                        {pathname.split('/blog/tags/')[1] === slug(t) ? (
                          <h3
                            className="flex items-baseline gap-0.5 py-2 px-3 uppercase text-sm font-bold text-primary-500 min-w-0"
                            title={t}
                          >
                            <span className="truncate">{t}</span>
                            <span className="shrink-0">{count}</span>
                          </h3>
                        ) : (
                          <Link
                            href={`/blog/tags/${slug(t)}`}
                            className="flex items-baseline gap-0.5 py-2 px-3 uppercase text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-500 min-w-0"
                            aria-label={`View posts tagged ${t}`}
                            title={t}
                          >
                            <span className="truncate">{t}</span>
                            <span className="shrink-0">{count}</span>
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
            <div>
              <p className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">Projects</p>
              <RandomLinkBox />
              <p className="mt-4 text-xs font-light italic text-gray-500 dark:text-gray-400">
                More coming in 2026…
              </p>
            </div>
          </div>
          <div>
            <ul>
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags } = post
                return (
                  <li key={path} className="py-5">
                    <article className="space-y-2 flex flex-col xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base font-light leading-6 text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                        </dd>
                      </dl>
                      <div className="space-y-3">
                        <div className="mt-2">
                          <h2 className="mb-2 text-2xl font-bold leading-8 tracking-tight">
                            <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                          </div>
                        </div>
                        <div className="pb-2 prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

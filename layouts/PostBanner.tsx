import { ReactNode } from 'react'
import Image from '@/components/Image'
import NextImage from 'next/image'
import Bleed from 'pliny/ui/Bleed'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostMinimal({ content, next, prev, children }: LayoutProps) {
  const { slug, title, images } = content
  const displayImage =
    images && images.length > 0 ? images[0] : 'https://picsum.photos/seed/picsum/800/400'

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <div className="space-y-1 pb-10 text-center dark:border-gray-700">
            <div className="w-full">
              <Bleed>
                <div className="aspect-[2/1] w-full relative">
                  <Image
                    src={displayImage}
                    alt={title}
                    fill
                    className="object-cover"
                    style={{ boxShadow: '0px 0px 12px #4817b0' }}
                  />
                </div>
              </Bleed>
            </div>
            <div className="pt-10 relative">
              <PageTitle>{title}</PageTitle>
            </div>
          </div>
          <div className="prose max-w-none pt-4 pb-3 dark:prose-invert">
            {children}
            <br />
            <NextImage
              src="/static/images/dd-signature.png"
              alt="DD signature"
              width={44}
              height={16}
              className="mt-3 h-4 w-auto scale-85 inline-block align-baseline invert dark:invert-0 origin-left"
              style={{
                marginLeft: '11px',
                width: 'auto',
                height: 'auto',
                opacity: 0.85,
                transform: 'rotate(-2.8deg)',
              }}
            />
          </div>
          <footer>
            <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
              {prev && prev.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${prev.path}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`Previous post: ${prev.title}`}
                  >
                    &larr; {prev.title}
                  </Link>
                </div>
              )}
              {next && next.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${next.path}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`Next post: ${next.title}`}
                  >
                    {next.title} &rarr;
                  </Link>
                </div>
              )}
            </div>
          </footer>
        </div>
      </article>
    </SectionContainer>
  )
}

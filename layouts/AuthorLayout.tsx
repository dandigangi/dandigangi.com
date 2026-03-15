'use client'

import { ReactNode, useState } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import { github, linkedin, twitter } from '@/data/siteMetadata'
import AvatarPikachu from '/public/static/images/avatar-pikachu.png'
import PageHeader from '@/components/PageHeader'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email } = content
  const [avatarDisplay, toggleAvatar] = useState(false)

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <PageHeader title="About" />
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center space-x-2 pt-8">
            {avatar && !avatarDisplay ? (
              <Image
                src={avatar}
                alt={`${name} profile photo`}
                width={250}
                height={250}
                className="h-48 w-48"
                style={{ boxShadow: '0px 0px 12px #4817b0', borderRadius: 10 }}
              />
            ) : (
              <Image
                src={AvatarPikachu}
                alt={`${name} alter ego`}
                width={250}
                height={250}
                className="h-48 w-48"
                style={{ boxShadow: '0px 0px 12px #4817b0', borderRadius: 10 }}
              />
            )}
            <h3 className="pb-2 pt-4 text-2xl font-bold leading-8 tracking-tight">{name}</h3>
            <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
            <div className="text-gray-500 dark:text-gray-400">{company}</div>
            <div className="mb-5 flex space-x-3 pt-6">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="twitter" href={twitter} />
              <SocialIcon kind="github" href={github} />
            </div>
            <button
              type="button"
              onClick={() => toggleAvatar(!avatarDisplay)}
              aria-label={!avatarDisplay ? 'Show alter ego avatar' : 'Show main avatar'}
              aria-pressed={avatarDisplay}
              className="text-sm uppercase underline font-semibold color text-violet-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            >
              {!avatarDisplay ? 'My Alter Ego' : 'Back to Dan'}
            </button>
          </div>
          <div className="prose max-w-none pb-6 pt-8 dark:prose-invert xl:col-span-2 text-lg leading-8">
            {children}
            <br />
            <img
              src="/static/images/dd-signature.png"
              alt="DD signature"
              className="mt-1.5 h-7 w-auto scale-95 inline-block align-baseline invert dark:invert-0 origin-left"
              style={{ marginLeft: '7px' }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

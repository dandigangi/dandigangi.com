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
                alt="avatar"
                width={192}
                height={192}
                className="h-48 w-48 rounded-full"
                style={{ boxShadow: '0px 0px 12px #4817b0' }}
              />
            ) : (
              <Image
                src={AvatarPikachu}
                alt="avatar"
                width={192}
                height={192}
                className="h-48 w-48 rounded-full"
                style={{ boxShadow: '0px 0px 12px #4817b0' }}
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
              onClick={() => toggleAvatar(!avatarDisplay)}
              className="text-sm uppercase underline font-semibold color text-violet-600"
            >
              {!avatarDisplay ? 'My Alter Ego' : 'Back to Me'}
            </button>
          </div>
          <div className="prose max-w-none pb-8 pt-8 dark:prose-invert xl:col-span-2 text-lg leading-8">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

import Link from './Link'
import siteMetadata, { email } from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="pb-10">
      <div className="mt-10 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:${email}`} size={6} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} />
        </div>
        <div className="mb-2 flex pt-2 space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>
            {` • `}Built w/{' '}
            <a className="underline" target="_blank" rel="nofollow" href="https://nextjs.com">
              NextJS
            </a>{' '}
            &{' '}
            <a className="underline" target="_blank" rel="nofollow" href="https://vercel.com">
              Vercel
            </a>{' '}
            &hearts;
          </div>
        </div>
      </div>
    </footer>
  )
}

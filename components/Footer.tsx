import siteMetadata, { email } from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="pb-12">
      <div className="mt-16 flex flex-col items-center">
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
            &nbsp;|&nbsp;&nbsp;Built w/{` `}
            <a className="underline" target="_blank" rel="noopener" href="https://nextjs.com">
              NextJS
            </a>{' '}
            &{' '}
            <a className="underline" target="_blank" rel="noopener" href="https://vercel.com">
              Vercel
            </a>{' '}
            &hearts;
          </div>
        </div>
        <div className="text-xs opacity-40 uppercase text-center">
          Wed Apr 17 19:47:04 2024 -0500
          <br />
          <a
            href="https://github.com/dandigangi/dandigangi.com/commit/494126dc75ced0143323064f933552958a95470f"
            target="_blank"
            rel="noopener"
          >
            [Commit 494126d]
          </a>
          &nbsp;&nbsp;&nbsp;
          <a href="https://github.com/dandigangi/dandigangi.com" target="_blank" rel="noopener">
            [Source Code]
          </a>
        </div>
      </div>
    </footer>
  )
}

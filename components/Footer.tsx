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
        <div className="mb-2 flex flex-wrap justify-center gap-x-2 gap-y-1 pt-2 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:justify-center">
          <span>{siteMetadata.author}</span>
          <span>{`© ${new Date().getFullYear()}`}</span>
          <span className="flex flex-wrap justify-center gap-x-1">
            <span>|</span>
            <span>Built w/</span>
            <a
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
              href="https://nextjs.com"
            >
              NextJS
            </a>
            <span>&</span>
            <a
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
              href="https://vercel.com"
            >
              Vercel
            </a>
            <span>&hearts;</span>
          </span>
        </div>
        <div className="text-xs opacity-40 uppercase text-center">
          Tue Mar 10 23:25:08 2026 -0500 [HASH:16ea26dcf]
        </div>
      </div>
    </footer>
  )
}

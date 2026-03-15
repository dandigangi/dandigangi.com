import { Mail, Github, Facebook, Youtube, Linkedin, Twitter, Mastodon, Web } from './icons'

const components = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  web: Web,
}

const kindLabels: Record<keyof typeof components, string> = {
  mail: 'Email',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  web: 'Website',
}

type SocialIconProps = {
  kind: keyof typeof components
  href: string | undefined
  size?: number
}

const SocialIcon = ({ kind, href, size = 8 }: SocialIconProps) => {
  if (!href || (kind === 'mail' && !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href)))
    return null

  const SocialSvg = components[kind]
  const label = kindLabels[kind]

  return (
    <a
      className="text-sm text-gray-500 transition hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 rounded"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      aria-label={label}
    >
      <SocialSvg
        className={`fill-current text-gray-700 hover:text-primary-500 dark:text-gray-200 dark:hover:text-primary-400 h-${size} w-${size}`}
      />
    </a>
  )
}

export default SocialIcon

import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
  fontSize?: string
}

const Tag = ({ text, fontSize = '' }: Props) => {
  return (
    <Link
      href={`/blog/tags/${slug(text)}`}
      className={`mr-3 ${
        fontSize || 'text-sm'
      } font-light uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400`}
      aria-label={`Link to posts tagged with ${text}`}
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag

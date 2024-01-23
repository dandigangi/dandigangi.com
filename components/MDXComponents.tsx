import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import Video from './Video'
import Spotify from './Spotify'

export const components: MDXComponents = {
  a: CustomLink,
  BlogNewsletterForm,
  Image,
  pre: Pre,
  TOCInline,
  Video,
  Spotify,
}

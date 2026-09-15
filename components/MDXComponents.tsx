import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import Video from './Video'
import Spacer from './Spacer'
import Spotify from './Spotify'

export const components: MDXComponents = {
  a: CustomLink,
  Image,
  Spacer,
  Spotify,
  Video,
}

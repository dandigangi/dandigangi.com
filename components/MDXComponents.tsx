import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import Invisible from './Invisible'
import PostImage from './PostImage'
import CustomLink from './Link'
import Video from './Video'
import Spacer from './Spacer'
import Spotify from './Spotify'

export const components: MDXComponents = {
  a: CustomLink,
  // Every markdown image in every post goes through here.
  img: PostImage,
  Image,
  Invisible,
  Spacer,
  Spotify,
  Video,
}

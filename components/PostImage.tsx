import NextImage from 'next/image'

/**
 * What a markdown `![]()` becomes in a post.
 *
 * Before this, every image in every post was a raw <img> at full resolution:
 * no WebP, no srcset, no lazy loading, no reserved space. One post shipped 45MB
 * of JPEGs eagerly. `next/image` fixes all four, and the dimensions it needs
 * come from lib/rehype-image-size.ts rather than from the markdown.
 *
 * Anything without dimensions — a remote image, or a file the sizer could not
 * read — falls back to the plain <img> it already was.
 */
export default function PostImage({
  src,
  alt,
  width,
  height,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const w = Number(width)
  const h = Number(height)

  if (typeof src !== 'string' || !w || !h) {
    // Deliberate: the fallback for an image with no dimensions, which is the
    // one thing next/image cannot render.
    return (
      // eslint-disable-next-line @next/next/no-img-element -- see above
      <img src={src} alt={alt ?? ''} width={width} height={height} {...rest} />
    )
  }

  return (
    <NextImage
      src={src}
      alt={alt ?? ''}
      width={w}
      height={h}
      sizes="(max-width: 780px) 100vw, 720px"
      // Animation does not survive the optimiser, and the one GIF in the posts
      // is a screen recording whose whole point is that it moves.
      unoptimized={src.endsWith('.gif')}
      style={{ width: '100%', height: 'auto' }}
    />
  )
}

import NextImage, { ImageProps } from 'next/image'

/**
 * Available to MDX as <Image />. No post uses it today, but it carried a
 * hardcoded black border and a purple glow from the old site — the border
 * vanished against the dark theme and the glow matches nothing in this design.
 */
const Image = ({ ...rest }: ImageProps) => (
  <NextImage style={{ border: '1px solid var(--line)', display: 'block' }} {...rest} />
)

export default Image

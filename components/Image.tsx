import NextImage, { ImageProps } from 'next/image'

const Image = ({ ...rest }: ImageProps) => (
  <NextImage style={{ boxShadow: '0px 0px 12px #4817b0' }} {...rest} />
)

export default Image

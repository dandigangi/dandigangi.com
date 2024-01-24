import NextImage, { ImageProps } from 'next/image'

const Image = ({ ...rest }: ImageProps) => (
  <NextImage
    style={{ border: '1px solid #000', boxShadow: '0px 0px 14px #4817b0', borderRadius: '1.5%' }}
    {...rest}
  />
)

export default Image

import Image, { StaticImageData } from 'next/image'

export default function Avatar({
  src,
  width,
  alt = ''
}: {
  src: string | StaticImageData
  width: number
  alt?: string
}) {
  return (
    <Image
      src={src || '/icons/layout/header/default_avatar.png'}
      alt={alt}
      width={width}
      height={width}
      onError={(e) => {
        e.currentTarget.onerror = null
        e.currentTarget.src = '/icons/layout/header/default_avatar.png'
      }}
      style={{
        width: width,
        height: width
      }}
      className="rounded-full object-cover"
    />
  )
}

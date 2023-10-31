import Image, { StaticImageData } from 'next/image'

export default function Avatar({
  src,
  width,
  alt = '',
  className = ''
}: {
  src?: string | StaticImageData
  width: number
  alt?: string
  className?: string
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
      className={`rounded-full object-cover border border-common-gray-light hover:border-common-gray-medium aspect-square w-[${width}px] ${className}`}
    />
  )
}

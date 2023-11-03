import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { MouseEvent } from 'react'
import { twMerge } from 'tailwind-merge'

import loaddindIcon from '~/public/images/loading.png'

interface Props {
  title: string
  prefixIcon?: string | StaticImageData
  prefixClassName?: string
  subfixIcon?: string | StaticImageData
  subfixClassName?: string
  isOutline?: boolean
  rounded?: boolean
  href?: string
  isUrlOutSystem?: boolean
  className?: string
  loadding?: boolean
  type?: string
  disabled?: boolean
  onClick?: () => void
}

export default function GrayBackGrondButtom({
  title,
  prefixIcon,
  prefixClassName,
  subfixIcon,
  subfixClassName,
  href,
  isUrlOutSystem,
  className = '',
  loadding,
  type,
  disabled,
  onClick
}: Props) {
  let Component: any
  const props: { [key: string]: any } = {}

  if (href) {
    Component = Link
    if (isUrlOutSystem) {
      props.href = href
      props.target = '_blank'
    }
  } else {
    Component = 'button'
    if (type) {
      props.type = type
    }
  }

  return (
    <Component
      {...props}
      onClick={(e: MouseEvent) => {
        if (disabled) {
          e.preventDefault()
        } else {
          onClick && onClick()
        }
      }}
      className={twMerge(
        'bg-common-gray-light rounded px-2 py-1 hover:bg-common-gray-medium',
        className,
        disabled && 'opacity-50 pointer-events-none select-none'
      )}
    >
      {loadding && (
        <div className="absolute inset-0 bg-[#dddddd88] z-10 rounded-[inherit] flex items-center justify-center">
          <Image
            src={loaddindIcon}
            alt=""
            width={22}
            height={22}
            className="animate-spin"
          />
        </div>
      )}
      <div className="button-content">
        {prefixIcon && (
          <Image
            src={prefixIcon}
            alt=""
            width={30}
            height={30}
            className={prefixClassName}
          />
        )}
        <span>{title}</span>
        {subfixIcon && (
          <Image
            src={subfixIcon}
            alt=""
            width={30}
            height={30}
            className={subfixClassName}
          />
        )}
      </div>
    </Component>
  )
}

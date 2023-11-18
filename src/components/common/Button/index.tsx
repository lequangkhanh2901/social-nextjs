import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

import loaddindIcon from '~/public/images/loading.png'

interface ButtonProps {
  title: string
  prefixIcon?: string | StaticImageData
  prefixClassName?: string
  subfixIcon?: string | StaticImageData
  subfixClassName?: string
  isOutline?: boolean
  rounded?: boolean
  href?: string
  isUrlOutSystem?: boolean
  passClass?: string
  loadding?: boolean
  type?: string
  disabled?: boolean
  onClick?: () => void
}

function Button({
  title,
  prefixIcon,
  prefixClassName = '',
  subfixIcon,
  subfixClassName = '',
  isOutline,
  rounded,
  href,
  isUrlOutSystem,
  passClass,
  loadding,
  type,
  disabled,
  onClick
}: ButtonProps) {
  const props: any = {}

  let Component: any = 'button'

  if (href) {
    if (isUrlOutSystem) {
      Component = 'a'
      props.target = '_blank'
    } else {
      Component = Link
    }
  }

  const renderClass = () => {
    let className = passClass || ''

    if (isOutline) {
      className += ' btn-outline'
    } else {
      className += ''
    }

    return className
  }

  return (
    <Component
      href={href}
      className={`button relative ${renderClass()} ${
        rounded ? 'rounded-full' : ''
      } ${disabled ? 'opacity-50 pointer-events-none select-none' : ''}`}
      {...props}
      type={type}
      onClick={() => {
        if (!disabled && onClick) onClick()
      }}
    >
      {loadding && (
        <div className="absolute inset-0 bg-[#dddddd88] z-10 rounded-[inherit] flex items-center justify-center">
          <Image
            src={loaddindIcon}
            alt=""
            width={22}
            height={22}
            className="animate-loading-rolling"
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

export default Button

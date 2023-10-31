import { ReactNode, useRef } from 'react'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import usePopup from '~/helper/hooks/usePopup'
import useClickOutSide from '~/helper/hooks/useClickOutSide'
import dots from '~/public/icons/dots.svg'
import Item, { MenuItem as IMenuItem } from './Item'

interface Props {
  placement?: {
    x?: 'left' | 'center' | 'right'
    y?: 'top' | 'center' | 'bottom'
  }
  className?: string
  menu: IMenuItem[]
  renderButton?: ReactNode
  classNameButton?: string
}

export default function Menu({
  placement = {
    x: 'center',
    y: 'bottom'
  },
  className = '',
  menu,
  renderButton,
  classNameButton = ''
}: Props) {
  const { isShow, closePopup, togglePopup } = usePopup()

  const ref = useRef<HTMLDivElement>(null)

  useClickOutSide(
    () => {
      if (isShow) closePopup()
    },
    ref,
    [isShow]
  )

  const renderPositionClass = () => {
    let positionClass = ''
    if (placement.x === 'center') {
      positionClass += 'left-1/2 -translate-x-1/2 '
    } else if (placement.x === 'left') {
      positionClass += 'right-full '
    } else {
      positionClass += 'left-full '
    }

    if (placement.y === 'top') {
      positionClass += '-top-full '
    } else if (placement.y === 'center') {
      positionClass += 'top-1/2 -translate-y-1/2 '
    } else {
      positionClass += 'top-full '
    }

    return positionClass
  }

  return (
    <div>
      <div ref={ref} className="relative " onClick={togglePopup}>
        {renderButton || (
          <div
            className={twMerge(
              ' p-1 bg-common-gray-light rounded hover:bg-common-gray-medium duration-100 cursor-pointer',
              classNameButton
            )}
          >
            <Image
              src={dots}
              alt=""
              width={24}
              height={24}
              className="opacity-75 w-6 h-6 "
            />
          </div>
        )}

        {isShow && (
          <div
            className={twMerge(
              'absolute w-[200px] z-10 p-1 rounded-md bg-common-white shadow-md',
              renderPositionClass(),
              className
            )}
          >
            {menu.map((item, index) => (
              <Item
                key={index}
                label={item.label}
                icon={item.icon}
                className={item.className}
                requireConfirm={item.requireConfirm}
                confirmMessage={item.confirmMessage}
                handle={item.handle}
                subMenu={item.subMenu}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { MouseEvent, ReactNode, useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import { twMerge } from 'tailwind-merge'

import usePopup from '~/helper/hooks/usePopup'
import SubMenu, { Props as SubmenuProps } from './SubMenu'
import Confirm from '../Confirm'

export interface MenuItem {
  label: string
  icon?: string | StaticImageData
  className?: string
  requireConfirm?: true
  confirmMessage?: ReactNode
  handle?: () => void
  subMenu?: SubmenuProps
}

export default function Item({
  label,
  icon,
  className = '',
  requireConfirm,
  confirmMessage,
  handle,
  subMenu
}: MenuItem) {
  const [isShowConfirm, setIsShowConfirm] = useState(false)
  const { isShow, togglePopup } = usePopup()

  const handleItemClick = (e: MouseEvent) => {
    if (subMenu) {
      e.stopPropagation()
      togglePopup()
    } else if (requireConfirm) {
      e.stopPropagation()
      setIsShowConfirm(true)
    } else {
      handle && handle()
    }
  }

  const handleConfirm = () => {
    handle && handle()
    setIsShowConfirm(false)
  }

  return (
    <>
      <div
        onClick={handleItemClick}
        className={twMerge(
          'flex items-center gap-1 hover:bg-common-gray-light cursor-pointer rounded px-2 py-1 text-common-gray-dark relative',
          className
        )}
      >
        {icon && (
          <Image src={icon} alt="" width={20} height={20} className="w-5 h-5" />
        )}
        {label}

        {subMenu && isShow && (
          <SubMenu
            className={subMenu.className}
            menu={subMenu.menu}
            placement={subMenu.placement}
          />
        )}
      </div>

      <Confirm
        isOpen={isShowConfirm}
        onCancel={() => setIsShowConfirm(false)}
        onConfirm={handleConfirm}
        message={confirmMessage}
      />
    </>
  )
}

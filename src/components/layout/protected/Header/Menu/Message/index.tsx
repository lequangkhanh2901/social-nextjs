import Image from 'next/image'
import { useRef } from 'react'

import usePopup from '~/helper/hooks/usePopup'
import messageActive from '~/public/icons/layout/header/message_active.svg'
import useClickOutSide from '~/helper/hooks/useClickOutSide'

import message from '~/public/icons/layout/header/message.svg'
import Conversations from './Conversations'

export default function Message() {
  const { isShow, togglePopup, closePopup } = usePopup()
  const ref = useRef<HTMLDivElement>(null)
  useClickOutSide(
    () => {
      if (isShow) closePopup()
    },
    ref,
    [isShow]
  )

  return (
    <div
      ref={ref}
      className="flex justify-center items-center bg-common-gray-light hover:bg-common-gray-medium rounded-full h-10 w-10 relative cursor-pointer"
      onClick={togglePopup}
    >
      <Image src={isShow ? messageActive : message} alt="" width={24} />
      {isShow && <Conversations />}
    </div>
  )
}

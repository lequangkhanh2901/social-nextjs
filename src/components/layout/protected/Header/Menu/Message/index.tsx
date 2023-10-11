import Image from 'next/image'
import { useRef } from 'react'

import usePopup from '~/helper/hooks/usePopup'
import useClickOutSide from '~/helper/hooks/useClickOutSide'

import chat from '~/public/icons/chat.svg'
import chatActive from '~/public/icons/chat_active.svg'
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
      <Image src={isShow ? chatActive : chat} alt="" width={24} />
      {isShow && <Conversations />}
    </div>
  )
}

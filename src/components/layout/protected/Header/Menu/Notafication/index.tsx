import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import useClickOutSide from '~/helper/hooks/useClickOutSide'
import usePopup from '~/helper/hooks/usePopup'

import bell from '~/public/icons/layout/header/bell.svg'
import bellActive from '~/public/icons/layout/header/bell_active.svg'
import ListNotification from './ListNotification'

export default function Notification() {
  const { isShow, togglePopup, closePopup } = usePopup()
  const notiRef = useRef<HTMLDivElement>(null)
  // const [notifications] = useState<string[]>([])
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL')

  useEffect(() => {
    //call
  }, [filter])

  useClickOutSide(
    () => {
      if (isShow) closePopup()
    },
    notiRef,
    [isShow]
  )

  return (
    <div
      ref={notiRef}
      className="rounded-full w-10 h-10 bg-common-gray-light hover:bg-common-gray-medium flex justify-center items-center cursor-pointer relative"
      onClick={togglePopup}
    >
      <Image src={isShow ? bellActive : bell} alt="Notification" width={24} />
      {isShow && (
        <ListNotification
          filter={filter}
          // notifications={notifications}
          onChangeFilter={(filter) => setFilter(filter)}
        />
      )}
    </div>
  )
}

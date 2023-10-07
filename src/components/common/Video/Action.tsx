import { Dispatch, SetStateAction, useRef } from 'react'
import Image from 'next/image'

import useClickOutSide from '~/helper/hooks/useClickOutSide'
import usePopup from '~/helper/hooks/usePopup'
import SetSpeed from './SetSpeed'
import dots from '~/public/icons/vertical_dot_white.svg'

interface Props {
  speed: number
  setSpeed: Dispatch<SetStateAction<number>>
}

export default function Action({ speed, setSpeed }: Props) {
  const { isShow, togglePopup, closePopup } = usePopup()

  const actionRef = useRef<HTMLDivElement>(null)

  useClickOutSide(
    () => {
      if (isShow) closePopup()
    },
    actionRef,
    [isShow]
  )

  return (
    <div
      ref={actionRef}
      className="w-6 h-6 rounded-full flex justify-center items-center cursor-pointer hover:bg-common-gray-dark relative"
    >
      <div
        className="w-6 h-6 rounded-full flex justify-center items-center "
        onClick={togglePopup}
      >
        <Image src={dots} alt="" width={16} />
      </div>
      {isShow && (
        <div className="absolute bottom-full right-0 bg-common-white rounded p-1 w-[150px] shadow-[0_0_6px_#ffffff90]">
          <SetSpeed speed={speed} setSpeed={setSpeed} />
        </div>
      )}
    </div>
  )
}

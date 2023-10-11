import Image from 'next/image'
import { useRef } from 'react'
import useClickOutSide from '~/helper/hooks/useClickOutSide'
import usePopup from '~/helper/hooks/usePopup'
import dots from '~/public/icons/dots.svg'
import bin from '~/public/icons/bin.svg'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'

interface Props {
  username: string
  onDelete: () => void
}

export default function Options({ username, onDelete }: Props) {
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const { isShow, closePopup, togglePopup } = usePopup()

  const optionsRef = useRef<HTMLDivElement>(null)

  useClickOutSide(
    () => {
      if (isShow) closePopup()
    },
    optionsRef,
    [isShow]
  )

  return (
    <div
      ref={optionsRef}
      className="ml-auto cursor-pointer flex justify-center items-center rounded-full w-8 h-8 hover:bg-common-gray-light duration-100 relative"
      onClick={togglePopup}
    >
      <Image src={dots} alt="" width={24} className="opacity-80" />
      {isShow && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-full right-0 bg-common-white shadow-[0_1px_6px_#88888888] rounded p-1 w-[100px] text-sm z-10"
        >
          {currentUser.username === username && (
            <div
              className="flex gap-2 items-center hover:bg-common-gray-light p-1 rounded-sm"
              onClick={() => {
                onDelete()
                closePopup()
              }}
            >
              <Image src={bin} alt="" width={18} />
              <span>Delete</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

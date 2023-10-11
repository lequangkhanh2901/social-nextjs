import Image from 'next/image'

import usePopup from '~/helper/hooks/usePopup'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'

import dots from '~/public/icons/dots.svg'
import bin from '~/public/icons/bin.svg'
import report from '~/public/icons/report.svg'
import edit from '~/public/icons/edit.svg'

interface Props {
  commentUsername: string
  onDelete: () => void
}

export default function ActionComment({ commentUsername, onDelete }: Props) {
  const { isShow, togglePopup, closePopup } = usePopup()
  const { currentUser } = useAppSelector((state: RootState) => state.user)

  return (
    <div
      className="absolute top-1/2 left-full -translate-y-1/2 translate-x-1 flex justify-center items-center w-7 h-7 bg-common-gray-light rounded-full cursor-pointer invisible group-hover:visible"
      onClick={togglePopup}
      onMouseLeave={closePopup}
    >
      <Image src={dots} alt="" width={20} className="opacity-80" />
      {isShow && (
        <div className="pr-8 absolute top-0 right-0 z-10">
          <div
            className="w-[130px] bg-common-white p-1 rounded-md shadow-[0_1px_5px_#000000aa]"
            // onClick={(e) => e.stopPropagation()}
          >
            {currentUser.username === commentUsername ? (
              <>
                <div
                  className="hover:bg-common-gray-light duration-100 px-2 py-1 rounded flex items-center gap-1"
                  onClick={onDelete}
                >
                  <Image src={bin} alt="" width={18} />
                  Delete
                </div>
                <div className="hover:bg-common-gray-light duration-100 px-2 py-1 rounded flex items-center gap-1">
                  <Image src={edit} alt="" width={18} />
                  Edit
                </div>
              </>
            ) : (
              <div className="hover:bg-common-gray-light duration-100 px-2 py-1 rounded flex items-center gap-1">
                <Image src={report} alt="" width={18} />
                Report
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

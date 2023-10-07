import Image from 'next/image'
import { Dispatch, Ref, SetStateAction, forwardRef } from 'react'

import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'

import Avatar from '~/components/common/Avatar'
import imagePlus from '~/public/icons/home/image_plus.svg'
import send from '~/public/icons/send.svg'
import sendActive from '~/public/icons/send_active.svg'

interface Props {
  comment: string
  setComment: Dispatch<SetStateAction<string>>
  onComment: () => void
}

function AddComment(
  { comment, setComment, onComment }: Props,
  ref: Ref<HTMLDivElement>
) {
  const { currentUser } = useAppSelector((state: RootState) => state.user)

  return (
    <div
      ref={ref}
      className="border-t border-common-gray-medium p-3  flex gap-1 "
    >
      <Avatar src={currentUser.avatar} width={36} />
      <div className="grow bg-common-gray-light p-2 rounded-xl">
        <textarea
          value={comment}
          placeholder="Comment"
          className="w-full block resize-none bg-[#00000000] outline-none px-1 h-6 max-h-[200px] text-txt-primary"
          onChange={(e) => {
            setComment(e.target.value)
            e.target.style.height = ''
            e.target.style.height = e.target.scrollHeight + 'px'
          }}
        ></textarea>
        <div className="pt-1 flex justify-between items-center">
          <div>
            <label
              htmlFor="add-image-comment"
              className="flex justify-center items-center w-8 h-8 opacity-60 rounded-full hover:bg-common-gray-medium duration-150 hover:opacity-80 cursor-pointer"
            >
              <Image src={imagePlus} alt="" width={20} />
              <input
                id="add-image-comment"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
              />
            </label>
          </div>
          <button
            className={`flex justify-center items-center w-8 h-8  rounded-full hover:bg-common-gray-medium duration-150 hover:opacity-80 ${
              comment.trim() ? '' : 'opacity-60'
            }`}
            onClick={onComment}
          >
            <Image src={comment.trim() ? sendActive : send} alt="" width={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
export default forwardRef<HTMLDivElement>(AddComment)

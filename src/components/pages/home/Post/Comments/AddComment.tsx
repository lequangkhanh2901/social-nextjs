import Image from 'next/image'
import {
  Dispatch,
  Ref,
  SetStateAction,
  forwardRef,
  useEffect,
  useId,
  useState
} from 'react'

import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'

import Avatar from '~/components/common/Avatar'
import imagePlus from '~/public/icons/home/image_plus.svg'
import send from '~/public/icons/send.svg'
import sendActive from '~/public/icons/send_active.svg'
import closeWhite from '~/public/icons/close_white.svg'

interface Props {
  comment: string
  setComment: Dispatch<SetStateAction<string>>
  onComment: (file?: File) => void
}

function AddComment(
  { comment, setComment, onComment }: Props,
  ref: Ref<HTMLDivElement>
) {
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const [file, setFile] = useState<File>()
  const [previewFile, setPreviewFile] = useState('')
  const idInputFile = useId()

  useEffect(() => {
    if (file) setPreviewFile(URL.createObjectURL(file))

    return () => {
      if (previewFile) URL.revokeObjectURL(previewFile)
      setPreviewFile('')
    }
  }, [file])

  return (
    <div
      ref={ref}
      className="border-t border-common-gray-medium p-3 flex gap-1 mt-1"
    >
      <Avatar src={currentUser.avatar} width={36} className="self-start" />
      <div className="grow bg-common-gray-light p-2 rounded-xl">
        <textarea
          value={comment}
          placeholder="Comment"
          className={`w-full block resize-none bg-[#00000000] outline-none px-1 h-6 text-txt-primary ${
            file ? 'max-h-[100px]' : 'max-h-[200px]'
          }`}
          onChange={(e) => {
            setComment(e.target.value)
            e.target.style.height = ''
            e.target.style.height = e.target.scrollHeight + 'px'
          }}
        ></textarea>
        <div className="pt-2 flex justify-between items-center">
          <div>
            {file && previewFile ? (
              <div className="relative group">
                {file.type.startsWith('image') ? (
                  <Image
                    src={previewFile}
                    alt=""
                    width={80}
                    height={80}
                    className="w-[80px] h-[80px] object-contain shadow-[0_0_2px_#00000055]"
                  />
                ) : (
                  <>
                    <video
                      className="w-[80px] h-[80px] object-contain shadow-[0_0_2px_#00000055]"
                      autoPlay
                      // loop
                      muted
                    >
                      <source src={previewFile} type="video/mp4" />
                    </video>
                  </>
                )}
                <div
                  className="hidden group-hover:flex absolute top-0 right-0 cursor-pointer justify-center items-center w-5 h-5 rounded-full bg-common-gray-medium shadow-[0_0_2px_#00000055] hover:bg-common-gray-dark"
                  onClick={() => setFile(undefined)}
                >
                  <Image src={closeWhite} alt="" width={16} />
                </div>
              </div>
            ) : (
              <label
                htmlFor={`add-image-comment-${idInputFile}`}
                className="flex justify-center items-center w-8 h-8 opacity-60 rounded-full hover:bg-common-gray-medium duration-150 hover:opacity-80 cursor-pointer"
              >
                <Image src={imagePlus} alt="" width={20} />
                <input
                  id={`add-image-comment-${idInputFile}`}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,video/mp4"
                  className="hidden"
                  onChange={(e) => {
                    setFile((e.target.files as FileList)[0])
                  }}
                />
              </label>
            )}
          </div>
          <button
            className={`flex justify-center items-center w-8 h-8  rounded-full hover:bg-common-gray-medium duration-150 hover:opacity-80 ${
              comment.trim() || file ? '' : 'opacity-60 cursor-not-allowed'
            }`}
            onClick={() => {
              if (comment.trim() || file) {
                onComment(file)
                setComment('')
                setFile(undefined)
              }
            }}
          >
            <Image
              src={comment.trim() || file ? sendActive : send}
              alt=""
              width={20}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
export default forwardRef<HTMLDivElement, Props>(AddComment)

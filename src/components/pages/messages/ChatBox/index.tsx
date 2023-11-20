import { memo, useCallback, useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Webcam from 'react-webcam'

import { MediaType } from '~/helper/enum/post'
import { postRequest } from '~/services/client/postRequest'
import usePopup from '~/helper/hooks/usePopup'

import Modal from '~/components/common/Modal/Modal'
import Tooltip from '~/components/common/Tooltip'

import send from '~/public/icons/send.svg'
import sendActive from '~/public/icons/send_active.svg'
import addImage from '~/public/icons/home/image_plus_active.svg'
import camera from '~/public/icons/camera.svg'
import close from '~/public/icons/close.svg'

interface Props {
  isStart?: true
  targetId?: string
  onSent?: () => void
}

function ChatBox({
  isStart,
  targetId,
  onSent = () => {
    //
  }
}: Props) {
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<
    {
      src: string
      type: MediaType
    }[]
  >([])
  const id = useId()
  const captureBtnId = useId()
  const addMedia = useId()
  const takePicture = useId()
  const { conversationId } = useParams()
  const router = useRouter()
  const { isShow, closePopup, openPopup } = usePopup()
  const webcamRef = useRef<Webcam>(null)

  useEffect(() => {
    setPreviews(
      files.map((file) => {
        return {
          src: URL.createObjectURL(file),
          type: file.type.startsWith('image')
            ? MediaType.IMAGE
            : file.type.startsWith('application/pdf')
            ? MediaType.PDF
            : MediaType.VIDEO
        }
      })
    )
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview.src)
      })
    }
  }, [files])

  const handleDeleteFile = (index: number) => {
    setFiles((prev) => {
      prev.splice(index, 1)

      return [...prev]
    })
  }

  const handleSend = async () => {
    if (isStart) {
      try {
        let body: any
        if (files.length) {
          body = new FormData()
          body.append('content', content)
          files.forEach((file) => {
            body.append('files', file)
          })
          body.append('type', 'CREATE')
          body.append('createConversationData', {
            userId: targetId
          })
        } else {
          body = {
            content,
            createConversationData: {
              userId: targetId
            },
            type: 'CREATE'
          }
        }

        const data: any = await postRequest(
          '/message',
          body,

          {
            'Content-Type': files.length
              ? 'multipart/form-data'
              : 'application/json'
          }
        )

        router.replace(`/conversations/${data.conversation.id}/messages`)
      } catch (error) {}

      return
    }
    try {
      let body: any
      if (files.length) {
        body = new FormData()
        body.append('content', content)
        body.append('conversationId', conversationId)
        files.forEach((file) => {
          body.append('files', file)
        })
      } else {
        body = {
          content,
          conversationId
        }
      }

      await postRequest('message', body, {
        'Content-Type': files.length
          ? 'multipart/form-data'
          : 'application/json'
      })

      setContent('')
      setFiles([])
      onSent()
    } catch (error) {
      toast.error('Server error')
    }
  }

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot() as string
      const file = await fetch(imageSrc)
        .then((res) => res.blob())
        .then((res) => {
          return new File([res], 'image.jpeg', {
            type: 'image/jpeg'
          })
        })
      setFiles((prev) => [...prev, file])
      closePopup()
    }
  }, [webcamRef])

  return (
    <>
      <div className="flex gap-5 items-center bg-common-white rounded-md py-1 px-2 mt-3 relative">
        <div className="flex items-center gap-2">
          <label
            htmlFor={id}
            className="hover:bg-common-gray-light p-1 rounded-xl"
            data-tooltip-id={addMedia}
            data-tooltip-content={'Add immage'}
          >
            <Image src={addImage} alt="" width={22} />
            <input
              id={id}
              type="file"
              accept="image/png,image/jpeg,image/jpg,video/mp4,application/pdf"
              className="hidden"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files as FileList))}
            />
          </label>
          <div
            onClick={openPopup}
            className="hover:bg-common-gray-light p-1 rounded-xl cursor-pointer"
            data-tooltip-id={takePicture}
            data-tooltip-content="Take a photo"
          >
            <Image src={camera} alt="" width={22} />
          </div>
        </div>
        <div className="max-h-[100px] overflow-y-auto grow">
          <textarea
            className="w-full resize-none outline-none block text-txt-primary px-2 py-1 h-8 bg-common-gray-light rounded"
            placeholder="Message"
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              e.target.style.height = ''
              e.target.style.height = e.target.scrollHeight + 'px'
            }}
          ></textarea>
        </div>
        <button
          className={`flex justify-center items-center w-8 h-8  rounded-full hover:bg-common-gray-medium duration-150 hover:opacity-80 ${
            content.trim() || files.length
              ? ''
              : 'opacity-60 cursor-not-allowed'
          }`}
          onClick={() => {
            if (content.trim() || files.length) handleSend()
          }}
        >
          <Image
            src={content.trim() || files.length ? sendActive : send}
            alt=""
            width={20}
          />
        </button>

        {!!previews.length && (
          <div className="absolute bottom-full left-0 bg-common-white rounded-md p-2 shadow-md flex flex-wrap max-w-[330px] gap-1">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                {preview.type === MediaType.IMAGE ? (
                  <Image
                    src={preview.src}
                    alt=""
                    width={100}
                    height={100}
                    className="object-cover aspect-square"
                  />
                ) : preview.type === MediaType.VIDEO ? (
                  <video
                    src={preview.src}
                    autoPlay
                    muted
                    loop
                    className="object-cover aspect-square w-[100px]"
                  />
                ) : (
                  <div className="w-[100px] aspect-square overflow-hidden">
                    {files[index]?.name}
                  </div>
                )}

                <div
                  className="absolute hidden group-hover:block top-1 right-1 p-1 rounded-full bg-common-gray-light hover:bg-common-gray-medium opacity-50 hover:opacity-100 cursor-pointer"
                  onClick={() => handleDeleteFile(index)}
                >
                  <Image src={close} alt="" width={16} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal isOpen={isShow} onRequestClose={closePopup}>
        <div className="p-5 max-w-[min(500px,90vw)]">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded"
          />

          <button
            onClick={capture}
            className="w-fit block p-3 rounded-full bg-common-gray-medium mt-3 mx-auto hover:bg-common-gray-dark shadow-[1px_1px_4px_#111111]"
            data-tooltip-id={captureBtnId}
            data-tooltip-content="Hello world!"
          >
            <div className="w-4 aspect-square bg-common-white rounded-full"></div>
          </button>
        </div>
      </Modal>
      <Tooltip id={addMedia} />
      <Tooltip id={takePicture} />
    </>
  )
}

export default memo(ChatBox)

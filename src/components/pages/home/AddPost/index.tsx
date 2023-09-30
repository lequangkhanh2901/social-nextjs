'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'

import { useLanguageContext } from '~/components/layout/Wrapper'
import { getDictionary } from '~/locales'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import usePopup from '~/helper/hooks/usePopup'

import Avatar from '~/components/common/Avatar'
import Modal from '~/components/common/Modal/Modal'
import Button from '~/components/common/Button'

import addImage from '~/public/icons/home/image_plus.svg'
import smile from '~/public/icons/home/smile.svg'
import close from '~/public/icons/close.svg'

type FileType = 'image/png' | 'image/jpeg' | 'image/jpg'

export default function AddPost() {
  const { currentUser } = useAppSelector((state: RootState) => state.user)

  const [postType, setPostType] = useState<'normal' | 'status' | 'media'>(
    'normal'
  )
  const [content, setContent] = useState('')
  const [medias, setMedias] = useState<File[]>()
  const [previewMedia, setPreviewMedia] = useState<
    {
      url: string
      type: FileType
    }[]
  >([])
  const { lang } = useLanguageContext()
  const { tHome } = getDictionary(lang)

  const { isShow, closePopup, openPopup } = usePopup()

  useEffect(() => {
    if (medias) {
      setPreviewMedia(() =>
        medias.map((file) => {
          return {
            type: file.type as FileType,
            url: URL.createObjectURL(file)
          }
        })
      )
    }
    return () => {
      previewMedia.forEach((preview) => URL.revokeObjectURL(preview.url))
    }
  }, [medias])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setMedias((prev) => [...(prev || []), ...acceptedFiles])
    },
    accept: {
      image: ['image/png', 'image/jpeg', 'image/jpg']
      // video: ['video/mp4']
    }
  })

  const handleDeleteMedia = (index: number) => {
    setMedias((prev) => {
      const data = [...(prev as File[])]
      data.splice(index, 1)
      return data
    })
  }

  return (
    <>
      <div className="rounded-md bg-common-white shadow mx-10 p-4 px-5">
        <div className="flex items-center gap-3">
          <Avatar src={currentUser.avatar} width={40} alt={currentUser.name} />
          <div
            className="grow !cursor-pointer rounded-full text-common-gray-dark px-4 py-[6px] bg-common-gray-light"
            onClick={() => {
              if (!medias || !medias.length) {
                setPostType('normal')
              }
              openPopup()
            }}
          >
            {tHome.createPost}
          </div>
        </div>
        <div className="flex mt-2 pt-2 border-t border-common-gray-medium">
          <div
            className="flex gap-1 items-center hover:bg-common-gray-light duration-100 rounded px-4 py-1 cursor-pointer"
            onClick={() => {
              setPostType('media'), openPopup()
            }}
          >
            <Image src={addImage} alt="" width={32} />
            <span className="text-txt-gray font-bold">{tHome.imageVideo}</span>
          </div>
          <div
            className="flex gap-1 items-center hover:bg-common-gray-light duration-100 rounded px-4 py-1 cursor-pointer"
            onClick={() => {
              setPostType('status'), openPopup()
            }}
          >
            <Image src={smile} alt="" width={32} />
            <span className="text-txt-gray font-bold">{tHome.status}</span>
          </div>
        </div>
      </div>
      <Modal isOpen={isShow} onRequestClose={closePopup}>
        <div className="p-5 rounded-lg w-[500px]">
          <h3 className="text-2xl font-bold text-txt-gray text-center">
            {tHome.createPost}
          </h3>
          <div className="border-t border-common-gray-medium mt-2 py-1 max-h-[500px] overflow-y-auto">
            <textarea
              name=""
              id=""
              placeholder="aaa"
              className="text-xl block outline-none border-none resize-none w-full min-h-[200px]"
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                e.target.style.height = ''
                e.target.style.height = e.target.scrollHeight + 'px'
              }}
            ></textarea>
            {postType === 'media' && (
              <>
                <div className="p-2 rounded-xl border border-common-gray-medium relative group">
                  <div
                    {...getRootProps()}
                    className={`${
                      medias && medias.length ? 'aspect-[6/2]' : 'aspect-[5/2]'
                    } bg-common-gray-light hover:bg-common-gray-medium duration-100 rounded-lg flex items-center justify-center flex-col cursor-pointer ${
                      isDragActive ? 'bg-common-gray-medium' : ''
                    }`}
                  >
                    <input {...getInputProps()} />

                    <Image src={addImage} alt="" width={40} />
                    <p className="text-sm text-txt-gray">{tHome.pushOrDrag}</p>
                  </div>
                  <div
                    className="absolute top-2 right-2 flex justify-center items-center w-8 h-8 rounded-full bg-common-gray-light hover:bg-common-gray-medium duration-100 cursor-pointer ml-auto mt-1 mr-1 invisible group-hover:visible"
                    onClick={() => setPostType('normal')}
                  >
                    <Image src={close} alt="" width={20} />
                  </div>
                </div>
                <div className="flex flex-wrap p-2 rounded-lg mt-3 border border-common-gray-medium">
                  {previewMedia.map((preview, index) => (
                    <div
                      key={index}
                      className="w-1/2 border border-common-white relative group"
                    >
                      <img
                        src={preview.url}
                        className="w-full object-cover aspect-square"
                      />
                      <div className="absolute inset-0 z-10 backdrop-blur-[1px] invisible group-hover:visible duration-150 group-hover:bg-[#88888810]">
                        <div
                          className="flex justify-center items-center w-8 h-8 rounded-full bg-common-gray-light hover:bg-common-gray-medium duration-100 cursor-pointer ml-auto mt-1 mr-1"
                          onClick={() => handleDeleteMedia(index)}
                        >
                          <Image src={close} alt="" width={20} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <Button
            title={tHome.post}
            passClass="w-full"
            disabled={!content.trim() && (!medias || !medias.length)}
          />
        </div>
      </Modal>
    </>
  )
}

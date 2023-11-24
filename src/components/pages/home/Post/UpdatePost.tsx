import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'

import { postTypes } from '~/helper/data/post'
import { MediaType, PostType, RegimePost } from '~/helper/enum/post'
import { FileType, Media, Post } from '~/helper/type/common'
import { getDictionary } from '~/locales'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { useLanguageContext } from '~/components/layout/Wrapper'
import { putRequest } from '~/services/client/putRequest'

import Avatar from '~/components/common/Avatar'
import Modal from '~/components/common/Modal/Modal'
import Select from '~/components/common/Select'
import Button from '~/components/common/Button'

import addImage from '~/public/icons/home/image_plus_active.svg'
import close from '~/public/icons/close.svg'
import image from '~/public/icons/home/image_plus.svg'

interface Props {
  isOpen: boolean
  onClose: () => void
  onUpdated: (data: {
    id: string
    medias: Media[]
    content: string
    type: RegimePost
  }) => void
}

export default function UpdatePost({
  isOpen,
  onClose,
  onUpdated,
  id,
  content,
  medias,
  type,
  isOrigin,
  originPost
}: Props & Post) {
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const [regime, setRegime] = useState(type)
  const [_content, setContent] = useState(content)
  const [postType, setPostType] = useState<PostType>(
    medias.length ? PostType.MEDIA : PostType.NORMAL
  )
  const [_medias, setMedias] = useState<File[]>()
  const [areadyExistMedias, setAreadyExistMedias] = useState<Media[]>(medias)
  const [previewMedias, setPreviewMedias] = useState<
    {
      url: string
      type: FileType
    }[]
  >([])
  const [loading, setLoading] = useState(false)

  const { lang } = useLanguageContext()
  const { tHome } = getDictionary(lang)

  useEffect(() => {
    if (_medias) {
      setPreviewMedias(() =>
        _medias.map((file) => {
          return {
            type: file.type as FileType,
            url: URL.createObjectURL(file)
          }
        })
      )
    }

    return () => {
      previewMedias.forEach((preview) => URL.revokeObjectURL(preview.url))
    }
  }, [_medias])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setMedias((prev) => [...(prev || []), ...acceptedFiles])
    },
    accept: {
      image: ['image/png', 'image/jpeg', 'image/jpg'],
      video: ['video/mp4']
    }
  })

  const handleRemoveMedias = () => {
    setMedias([])
    setPostType(PostType.NORMAL)
  }

  const handleDeleteMedia = (
    data: { type: 'cdn'; id: string } | { type: 'local'; index: number }
  ) => {
    if (data.type === 'cdn') {
      setAreadyExistMedias((prev) =>
        prev.filter((media) => media.id !== data.id)
      )
    } else {
      setMedias((prev) => {
        const _files = [...(prev as File[])]
        _files.splice(data.index, 1)
        return _files
      })
    }
  }

  const handleUpdatePost = async () => {
    if (loading) return

    try {
      let data: any

      if (isOrigin) {
        setLoading(true)
        let body: any

        if (_medias && _medias.length) {
          body = new FormData()
          body.append('id', id)
          body.append('content', content)
          body.append('type', regime)
          if (areadyExistMedias) {
            areadyExistMedias.forEach((media) => {
              body.append('keepMedia', media.id)
            })
          }
          _medias.forEach((_media) => {
            body.append('medias', _media)
          })
        } else {
          body = {
            id,
            type: regime,
            content: _content,
            keepMedia: areadyExistMedias.map((media) => media.id)
          }
        }

        data = await putRequest('/post', body, {
          'Content-Type':
            _medias && _medias.length
              ? 'multipart/form-data'
              : 'application/json'
        })
      } else {
        data = await putRequest('/post/shared', {
          postId: id,
          content: _content
        })
      }

      toast.success('Updated')

      onUpdated({
        id,
        content: data.content,
        medias: data.medias,
        type: data.type
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <div className="p-5 rounded-lg w-[500px]">
        <h3 className="text-2xl font-bold text-txt-gray text-center">
          Update post
        </h3>
        <div className="border-t border-common-gray-medium mt-2 py-1 flex items-center gap-2">
          <Avatar src={currentUser.avatar} width={40} />
          <div>
            <p className="font-extrabold text-txt-primary">
              {currentUser.name}{' '}
              <span className="text-sm text-common-gray-medium">
                share a post
              </span>
            </p>
            {isOrigin && (
              <Select
                data={postTypes.map((type) => ({
                  key: type.value,
                  label: tHome[type.key as keyof typeof tHome]
                }))}
                currentActiveKey={regime}
                onChange={(key) => setRegime(key as RegimePost)}
                passClass="text-sm font-semibold border-0 rounded-full bg-common-gray-light py-[2px] hover:bg-common-gray-medium duration-100"
                itemClassName="font-medium"
                trigger="click"
              />
            )}
          </div>
        </div>
        <div className=" py-1 max-h-[calc(100vh-350px)] overflow-y-auto">
          <textarea
            name=""
            id=""
            placeholder="aaa"
            className="text-xl block outline-none border-none resize-none w-full min-h-[200px]"
            value={_content}
            onChange={(e) => {
              setContent(e.target.value)
              e.target.style.height = ''
              e.target.style.height = e.target.scrollHeight + 'px'
            }}
          ></textarea>
          {originPost && (
            <div className="flex gap-3 items-center">
              <Avatar src={originPost.user.avatarId.cdn} width={36} />
              <p>Post from {originPost.user.name}</p>
            </div>
          )}
          {postType === PostType.MEDIA && isOrigin && (
            <>
              <div className="p-2 rounded-xl border border-common-gray-medium relative group">
                <div
                  {...getRootProps()}
                  className={`${
                    (_medias && _medias.length) || areadyExistMedias.length
                      ? 'aspect-[6/2]'
                      : 'aspect-[5/2]'
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
                  onClick={handleRemoveMedias}
                >
                  <Image src={close} alt="" width={20} />
                </div>
              </div>
              {(previewMedias.length > 0 || areadyExistMedias.length > 0) && (
                <div className="flex flex-wrap p-2 rounded-lg mt-3 border border-common-gray-medium">
                  {areadyExistMedias.map((media) => (
                    <div
                      key={media.id}
                      className="w-1/2 border border-common-white relative group"
                    >
                      {media.type === MediaType.VIDEO ? (
                        <video
                          className="w-full object-cover aspect-square"
                          autoPlay
                          loop
                          muted
                        >
                          <source src={media.cdn} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          src={media.cdn}
                          className="w-full object-cover aspect-square"
                        />
                      )}

                      <div className="absolute inset-0 z-10 backdrop-blur-[1px] invisible group-hover:visible duration-150 group-hover:bg-[#88888810]">
                        <div
                          className="flex justify-center items-center w-8 h-8 rounded-full bg-common-gray-light hover:bg-common-gray-medium duration-100 cursor-pointer ml-auto mt-1 mr-1"
                          onClick={() =>
                            handleDeleteMedia({
                              type: 'cdn',
                              id: media.id
                            })
                          }
                        >
                          <Image src={close} alt="" width={20} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {previewMedias.map((preview, index) => (
                    <div
                      key={index}
                      className="w-1/2 border border-common-white relative group"
                    >
                      {preview.type === 'video/mp4' ? (
                        <video
                          className="w-full object-cover aspect-square"
                          autoPlay
                          loop
                          muted
                        >
                          <source src={preview.url} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          src={preview.url}
                          className="w-full object-cover aspect-square"
                        />
                      )}

                      <div className="absolute inset-0 z-10 backdrop-blur-[1px] invisible group-hover:visible duration-150 group-hover:bg-[#88888810]">
                        <div
                          className="flex justify-center items-center w-8 h-8 rounded-full bg-common-gray-light hover:bg-common-gray-medium duration-100 cursor-pointer ml-auto mt-1 mr-1"
                          onClick={() =>
                            handleDeleteMedia({
                              type: 'local',
                              index
                            })
                          }
                        >
                          <Image src={close} alt="" width={20} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {isOrigin && (
          <div className="flex gap-2 my-2">
            <div
              className="flex justify-center items-center px-3 py-1 rounded bg-common-gray-light hover:bg-common-gray-medium duration-100 cursor-pointer"
              onClick={() => setPostType(PostType.MEDIA)}
            >
              <Image
                src={postType === PostType.MEDIA ? addImage : image}
                alt=""
                width={30}
              />
            </div>
            {/* <div
              className="flex justify-center items-center px-3 py-1 rounded bg-common-gray-light hover:bg-common-gray-medium duration-100 cursor-pointer"
              onClick={() => setPostType(PostType.STATUS)}
            >
              <Image
                src={postType === PostType.STATUS ? smile : smileNor}
                alt=""
                width={30}
                />
              </div> */}
          </div>
        )}

        <Button
          title="Update"
          passClass="w-full"
          disabled={
            isOrigin
              ? !_content.trim() &&
                (!_medias || !_medias.length) &&
                areadyExistMedias.length === 0
              : false
          }
          loadding={loading}
          onClick={handleUpdatePost}
        />
      </div>
    </Modal>
  )
}

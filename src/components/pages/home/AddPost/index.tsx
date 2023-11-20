'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'

import { useLanguageContext } from '~/components/layout/Wrapper'
import { getDictionary } from '~/locales'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import usePopup from '~/helper/hooks/usePopup'
import { PostType, RegimeCreatePost as RegimePost } from '~/helper/enum/post'
import { FileType, Post } from '~/helper/type/common'
import useDebounce from '~/helper/hooks/useDebounce'
import { IUser } from '~/helper/type/user'
import { postRequest } from '~/services/client/postRequest'
import { getRequest } from '~/services/client/getRequest'

import Avatar from '~/components/common/Avatar'
import Modal from '~/components/common/Modal/Modal'
import Button from '~/components/common/Button'
import Select from '~/components/common/Select'
import Input from '~/components/common/Input'

import addImage from '~/public/icons/home/image_plus_active.svg'
import image from '~/public/icons/home/image_plus.svg'
import smile from '~/public/icons/home/smile_active.svg'
import smileNor from '~/public/icons/home/smile.svg'
import close from '~/public/icons/close.svg'

export default function AddPost({
  setPosts
}: {
  setPosts: Dispatch<SetStateAction<Post[]>>
}) {
  const { currentUser } = useAppSelector((state: RootState) => state.user)

  const [postType, setPostType] = useState<PostType>(PostType.NORMAL)
  const [regime, setRegime] = useState(RegimePost.PUBLIC)
  const [content, setContent] = useState('')
  const [medias, setMedias] = useState<File[]>()
  const [previewMedia, setPreviewMedia] = useState<
    {
      url: string
      type: FileType
    }[]
  >([])
  const [loading, setLoading] = useState(false)
  const [customType, setCustomType] = useState<'EXCLUDE' | 'ONLY'>('ONLY')
  const [showCustom, setShowCustom] = useState(false)
  const [search, setSearch] = useState('')
  const searchDebounce = useDebounce(search)
  const [listUser, setListUser] = useState<IUser[]>([])
  const [selectedUser, setSelectedUser] = useState<IUser[]>([])

  const { lang } = useLanguageContext()
  const { tHome, tCommon } = getDictionary(lang)

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

  useEffect(() => {
    ;(async () => {
      if (!searchDebounce) return
      try {
        const data: any = await getRequest(`/friend/@${currentUser.username}`, {
          params: {
            limit: 10,
            search: searchDebounce,
            type: 'ALL'
          }
        })

        setListUser(data.friends.map((friend: any) => friend.user))
      } catch (error) {}
    })()
  }, [searchDebounce])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setMedias((prev) => [...(prev || []), ...acceptedFiles])
    },
    accept: {
      image: ['image/png', 'image/jpeg', 'image/jpg'],
      video: ['video/mp4']
    }
  })

  const handleDeleteMedia = (index: number) => {
    setMedias((prev) => {
      const data = [...(prev as File[])]
      data.splice(index, 1)
      return data
    })
  }

  const handleRemoveMedias = () => {
    setMedias([])
    setPostType(PostType.NORMAL)
  }

  const handleCreatePost = async () => {
    try {
      setLoading(true)
      let body: any
      if (medias && medias.length > 0) {
        body = new FormData()
        body.append('content', content)
        body.append(
          'type',
          regime === RegimePost.CUSTOM
            ? `${RegimePost.CUSTOM}_${customType}`
            : regime
        )
        medias.forEach((media) => body.append('medias', media))
        selectedUser.forEach((user) => body.append('userIds', user.id))
      } else {
        body = {
          content,
          type:
            regime === RegimePost.CUSTOM
              ? `${RegimePost.CUSTOM}_${customType}`
              : regime,
          userIds: selectedUser.map((user) => user.id)
        }
      }
      const data: any = await postRequest('/post', body, {
        'Content-Type':
          medias && medias.length > 0
            ? 'multipart/form-data'
            : 'application/json'
      })

      toast.success(tHome.postCreated)
      setMedias(undefined)
      setContent('')
      setPostType(PostType.NORMAL)
      closePopup()

      setPosts((prev) => [
        {
          content: data.content,
          createdAt: data.createdAt,
          id: data.id,
          likeData: {
            isLiked: false,
            total: 0
          },
          medias: data.medias,
          type: data.type,
          updatedAt: data.updatedAt,
          user: {
            avatarId: {
              cdn: currentUser.avatar
            },
            name: currentUser.name,
            username: currentUser.username
          },
          totalComment: 0
        },
        ...prev
      ])
    } catch (error) {
      toast.error(tCommon.serverError)
    } finally {
      setLoading(false)
    }
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
                setPostType(PostType.NORMAL)
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
              setPostType(PostType.MEDIA), openPopup()
            }}
          >
            <Image src={addImage} alt="" width={32} />
            <span className="text-txt-gray font-bold">{tHome.imageVideo}</span>
          </div>
          <div
            className="flex gap-1 items-center hover:bg-common-gray-light duration-100 rounded px-4 py-1 cursor-pointer"
            onClick={() => {
              setPostType(PostType.STATUS), openPopup()
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
          <div className="border-t border-common-gray-medium mt-2 py-1 flex items-center gap-2">
            <Avatar src={currentUser.avatar} width={40} />
            <div>
              <p className="font-extrabold text-txt-primary">
                {currentUser.name}
              </p>
              <Select
                data={Object.keys(RegimePost).map((key) => ({
                  key,
                  label: key
                }))}
                currentActiveKey={regime}
                onChange={(key) => {
                  if (key === RegimePost.CUSTOM) setShowCustom(true)
                  setRegime(key as RegimePost)
                }}
                passClass="text-sm font-semibold border-0 rounded-full bg-common-gray-light py-[2px] hover:bg-common-gray-medium duration-100"
                itemClassName="font-medium"
                trigger="click"
              />
            </div>
          </div>
          <div className=" py-1 max-h-[calc(100vh-350px)] overflow-y-auto">
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
            {postType === PostType.MEDIA && (
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
                    onClick={handleRemoveMedias}
                  >
                    <Image src={close} alt="" width={20} />
                  </div>
                </div>
                {previewMedia.length > 0 && (
                  <div className="flex flex-wrap p-2 rounded-lg mt-3 border border-common-gray-medium">
                    {previewMedia.map((preview, index) => (
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
                            onClick={() => handleDeleteMedia(index)}
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
            <div
              className="flex justify-center items-center px-3 py-1 rounded bg-common-gray-light hover:bg-common-gray-medium duration-100 cursor-pointer"
              onClick={() => setPostType(PostType.STATUS)}
            >
              <Image
                src={postType === PostType.STATUS ? smile : smileNor}
                alt=""
                width={30}
              />
            </div>
          </div>

          <Button
            title={tHome.post}
            passClass="w-full"
            disabled={!content.trim() && (!medias || !medias.length)}
            loadding={loading}
            onClick={handleCreatePost}
          />
        </div>
      </Modal>
      {regime === RegimePost.CUSTOM && showCustom && (
        <Modal isOpen onRequestClose={() => setShowCustom(false)}>
          <div className="p-4 rounded-xl w-[400px]">
            <h3 className="text-xl text-center py-2">
              Custom Who can see this post
            </h3>
            <Select
              data={[
                {
                  key: 'EXCLUDE',
                  label: 'Exclude'
                },
                {
                  key: 'ONLY',
                  label: 'Only'
                }
              ]}
              currentActiveKey={customType}
              onChange={(key) => setCustomType(key as typeof customType)}
              passClass="text-sm"
            />
            <Input
              name=""
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />
            <div className="py-2">
              <h3>Selected User</h3>
              <div className="flex flex-wrap">
                {selectedUser.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex gap-1 items-center p-1 rounded hover:bg-common-gray-light cursor-pointer"
                    onClick={() =>
                      setSelectedUser((prev) => {
                        prev.splice(index, 1)
                        return [...prev]
                      })
                    }
                  >
                    <Avatar src={user.avatarId.cdn} width={24} />
                    <p className="text-xs">{user.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t py-2">
              <h3>Available User</h3>
              <div className="flex flex-wrap">
                {listUser
                  .filter(
                    (user) =>
                      !selectedUser.some((_user) => _user.id === user.id)
                  )
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex gap-1 items-center p-1 rounded hover:bg-common-gray-light cursor-copy"
                      onClick={() => setSelectedUser((prev) => [...prev, user])}
                    >
                      <Avatar src={user.avatarId.cdn} width={24} />
                      <p className="text-xs">{user.name}</p>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <Button title="Comfirm" onClick={() => setShowCustom(false)} />
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

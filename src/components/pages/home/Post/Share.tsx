import { useState } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'

import { MediaType } from '~/helper/enum/post'
import { Post } from '~/helper/type/common'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { postRequest } from '~/services/client/postRequest'

import Avatar from '~/components/common/Avatar'
import Button from '~/components/common/Button'
import Modal from '~/components/common/Modal/Modal'
import play from '~/public/icons/play_active.svg'

interface Props {
  post: Post
  onClose: () => void
  onShared: (id: string) => void
}

export default function Share({ post, onClose, onShared }: Props) {
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const [content, setContent] = useState('')

  const handleShare = async () => {
    try {
      const data: any = await postRequest('/post/share', {
        content,
        originPostId: post.id
      })
      onShared(data.id)
    } catch (error) {}
  }

  return (
    <Modal isOpen onRequestClose={onClose}>
      <div className="w-[600px] p-4">
        <h2 className="text-center font-bold text-2xl">Share post</h2>
        <div className="flex items-center gap-2 border-b border-common-gray-medium pb-2">
          <Avatar src={currentUser.avatar} width={40} />
          <div>
            <p className="text-sm">
              <span className="font-semibold text-base">
                {currentUser.name}
              </span>{' '}
              share a post
            </p>
            <span className="text-xs text-common-gray-dark -mt-1">
              {format(new Date(), 'HH:mm dd/MM/yyyy')}
            </span>
          </div>
        </div>
        <textarea
          className="text-sm outline-none resize-none w-full block h-10 bg-common-gray-light rounded-md my-2 px-3 py-1"
          placeholder="Say something about this post"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="max-h-[60vh] overflow-y-auto pl-3">
          <div className="flex items-center gap-2 border-b border-common-gray-medium pb-2 mt-2">
            <Avatar src={post.user.avatarId.cdn} width={36} />
            <div>
              <p className="text-xs">
                <span className="font-semibold text-sm">{post.user.name}</span>
              </p>
              <span className="text-[10px] text-common-gray-dark -mt-1">
                {format(new Date(post.createdAt), 'HH:mm dd/MM/yyyy')}
              </span>
            </div>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/\n/g, '<br/>')
            }}
            className={'line-clamp-3'}
          ></div>
          {post.medias.length > 0 && (
            <div
              className="flex flex-wrap cursor-pointer mt-1"
              // onClick={openPopup}
            >
              {post.medias.length === 1 ? (
                post.medias[0].type === MediaType.IMAGE ? (
                  <Image
                    src={post.medias[0].cdn}
                    alt=""
                    width={800}
                    height={500}
                    className="w-full max-h-[80vh] object-cover"
                  />
                ) : (
                  <video
                    src={post.medias[0].cdn}
                    preload="metadata"
                    className="aspect-square w-full object-cover"
                  ></video>
                )
              ) : (
                post.medias.map((media, index) => {
                  if (index > 3) return null
                  if (index === 3) {
                    return (
                      <div className="w-1/2 relative" key={media.id}>
                        {media.type === MediaType.IMAGE ? (
                          <Image
                            alt=""
                            src={media.cdn}
                            width={800}
                            height={500}
                            className="aspect-square object-cover"
                          />
                        ) : (
                          <video className="w-full h-full object-cover">
                            <source src={media.cdn} />
                          </video>
                        )}
                        {post.medias.length > 4 ? (
                          <div className="absolute inset-0 bg-[#aaaaaa10] backdrop-blur-[1px] text-[60px] flex justify-center items-center text-common-white drop-shadow-[0_1px_2px_#aaaaaa] font-bold">
                            {post.medias.length - 4}+
                          </div>
                        ) : (
                          media.type === MediaType.VIDEO && (
                            <div className="absolute inset-0 bg-[#aaaaaa10] backdrop-blur-[1px] flex justify-center items-center">
                              <div className="w-12 h-12 flex justify-center items-center rounded-full bg-[#aaaaaaaa]">
                                <Image src={play} alt="play" width={24} />
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )
                  }

                  return (
                    <div
                      key={media.id}
                      className="w-1/2 aspect-square relative"
                    >
                      {media.type === MediaType.IMAGE ? (
                        <Image
                          alt=""
                          src={media.cdn}
                          width={800}
                          height={500}
                          className="aspect-square object-cover"
                        />
                      ) : (
                        <>
                          <video
                            className="w-full h-full object-cover"
                            preload="metadata"
                          >
                            <source src={media.cdn} />
                          </video>
                          <div className="absolute inset-0 bg-[#aaaaaa10] backdrop-blur-[1px] flex justify-center items-center">
                            <div className="w-12 h-12 flex justify-center items-center rounded-full bg-[#aaaaaaaa]">
                              <Image src={play} alt="play" width={24} />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
        <Button
          title="Share"
          passClass="w-2/3 mx-auto mt-3"
          onClick={handleShare}
        />
      </div>
    </Modal>
  )
}

import { useState } from 'react'
import Image from 'next/image'

import { MessageStatus, MessageViewSatus } from '~/helper/enum/message'
import { MediaType } from '~/helper/enum/post'
import { Media } from '~/helper/type/common'
import { IUser } from '~/helper/type/user'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'

import Modal from '~/components/common/Modal/Modal'
import Video from '~/components/common/Video'

import play from '~/public/icons/play_solid_white.svg'
import close from '~/public/icons/close_white.svg'
import sent from '~/public/icons/tick-circle-outline.svg'
import received from '~/public/icons/tick-circle-solid.svg'

export interface Message {
  id: string
  user: IUser
  medias: Media[]
  content: string
  createdAt: string
  viewStatus: MessageViewSatus
  status: MessageStatus
}

interface Props extends Message {
  lastSeen?: boolean
}

const reg = /\bhttps?:\/\/\S+/gi

export default function MessageItem({
  user,
  medias,
  content,
  viewStatus
}: Props) {
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const [viewMedia, setViewMedia] = useState({
    src: '',
    type: MediaType.IMAGE
  })

  return (
    <>
      <div
        className={` max-w-[50%] w-fit my-1 flex ${
          currentUser.id === user.id ? 'ml-auto' : ''
        }`}
      >
        <div className="bg-common-white p-3 rounded-xl">
          <div className="w-fit">
            {!!medias.length && (
              <div>
                {medias.length === 1 ? (
                  medias[0].type === MediaType.IMAGE ? (
                    <Image
                      src={medias[0].cdn}
                      alt=""
                      width={300}
                      height={300}
                      className="cursor-pointer"
                      onClick={() =>
                        setViewMedia({
                          src: medias[0].cdn,
                          type: MediaType.IMAGE
                        })
                      }
                    />
                  ) : (
                    <video
                      preload="metadata"
                      className="cursor-pointer"
                      onClick={() =>
                        setViewMedia({
                          src: medias[0].cdn,
                          type: MediaType.VIDEO
                        })
                      }
                    >
                      <source src={medias[0].cdn} />
                    </video>
                  )
                ) : (
                  <div className="flex flex-wrap justify-between gap-2">
                    {medias.map((media) =>
                      media.type === MediaType.IMAGE ? (
                        <Image
                          key={media.id}
                          src={media.cdn}
                          alt=""
                          width={100}
                          height={100}
                          className="w-[150px] object-cover aspect-square cursor-pointer"
                          onClick={() =>
                            setViewMedia({
                              src: media.cdn,
                              type: MediaType.IMAGE
                            })
                          }
                        />
                      ) : (
                        <div
                          key={media.id}
                          className="w-[150px] relative cursor-pointer"
                          onClick={() =>
                            setViewMedia({
                              src: media.cdn,
                              type: MediaType.VIDEO
                            })
                          }
                        >
                          <video
                            className=" object-cover aspect-square"
                            src={media.cdn}
                            preload="metadata"
                          ></video>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-full bg-[#00000050] opacity-70 hover:opacity-100">
                            <Image src={play} width={20} alt="" />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
            <p
              className="w-fit"
              dangerouslySetInnerHTML={{
                __html: (() => {
                  content.match(reg)?.forEach((link) => {
                    content = content.replace(
                      link,
                      `<a href="${link}" target='_blank' class='external-link'>${link}</a>`
                    )
                  })

                  return content
                })()
              }}
            ></p>
          </div>
        </div>
        {currentUser.id === user.id && (
          <div className="self-end">
            {viewStatus === MessageViewSatus.VIEWED ? (
              // <Image
              //   src={user.avatarId.cdn}
              //   alt=""
              //   width={12}
              //   height={12}
              //   className="w-3 h-3 object-cover rounded-full"
              // />
              <div className="w-3 h-3"></div>
            ) : (
              <Image
                src={viewStatus === MessageViewSatus.SENT ? sent : received}
                alt=""
                width={12}
              />
            )}
          </div>
        )}
      </div>

      {viewMedia.src && (
        <Modal
          isOpen
          onRequestClose={() =>
            setViewMedia({
              src: '',
              type: MediaType.IMAGE
            })
          }
        >
          <div className="max-h-[90vh] max-w-[90vw] w-[90vw] h-[90vh] relative group flex justify-center items-center">
            {viewMedia.type === MediaType.VIDEO ? (
              <Video src={viewMedia.src} className="max-w-full max-h-full" />
            ) : (
              <Image
                fill
                src={viewMedia.src}
                alt=""
                className="object-contain rounded-[inherit]"
              />
            )}
            <div
              className="absolute top-3 right-3 w-10 aspect-square rounded-full bg-[#00000080] cursor-pointer justify-center items-center hidden group-hover:flex opacity-40 hover:opacity-90"
              onClick={() =>
                setViewMedia({
                  src: '',
                  type: MediaType.IMAGE
                })
              }
            >
              <Image src={close} alt="" width={20} />
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

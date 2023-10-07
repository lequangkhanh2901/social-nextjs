import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'

import { MediaType } from '~/helper/enum/post'
import { Post } from '~/helper/type/common'
import { Post as IPost } from '~/helper/type/common'
import { useLanguageContext } from '~/components/layout/Wrapper'
import { getDictionary } from '~/locales'
import usePopup from '~/helper/hooks/usePopup'

import Avatar from '~/components/common/Avatar'
import play from '~/public/icons/play_active.svg'
import ViewPost from './ViewPost'
import Actions from './Actions'

interface Props {
  post: Post
  setPosts: Dispatch<SetStateAction<IPost[]>>
}

export default function Post({ post, setPosts }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isViewAll, setIsViewAll] = useState(false)
  const { isShow, openPopup, closePopup } = usePopup()

  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > contentRef.current.clientHeight) {
      } else {
        setIsViewAll(true)
      }
    }
  }, [contentRef.current])

  const { lang } = useLanguageContext()
  const { tHome } = getDictionary(lang)

  return (
    <>
      <div className="rounded-lg shadow bg-common-white p-4 mt-4">
        <div className="flex gap-2 items-center">
          <Link
            href={`/user/${post.user.username}`}
            className="rounded-full w-fit"
          >
            <Avatar src={post.user.avatarId.cdn} width={40} />
          </Link>
          <div>
            <Link href={`/user/${post.user.username}`}>{post.user.name}</Link>
            <p className="text-[13px] text-txt-gray">
              {format(new Date(post.createdAt), 'hh:mm dd/MM/yyyy')}
            </p>
          </div>
          <div className="ml-auto">action</div>
        </div>
        <div className="border-t border-common-gray-medium mt-2 pt-2">
          <div
            ref={contentRef}
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/\n/g, '<br/>')
            }}
            className={isViewAll ? '' : 'line-clamp-3'}
          ></div>
          {!isViewAll && (
            <span
              className="font-extrabold cursor-pointer text-sm"
              onClick={() => setIsViewAll(true)}
            >
              {tHome.viewMore}
            </span>
          )}
          {post.medias.length > 0 && (
            <div
              className="flex flex-wrap cursor-pointer mt-1"
              onClick={openPopup}
            >
              {post.medias.length === 1 ? (
                post.medias[0].type === MediaType.IMAGE ? (
                  <Image
                    src={post.medias[0].cdn}
                    alt=""
                    width={800}
                    height={500}
                    className="w-full"
                  />
                ) : null
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
                        {post.medias.length > 5 ? (
                          <div className="absolute inset-0 bg-[#aaaaaa10] backdrop-blur-[1px] text-[60px] flex justify-center items-center text-common-white drop-shadow-[0_1px_2px_#aaaaaa] font-bold">
                            {post.medias.length - 4}+
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-[#aaaaaa10] backdrop-blur-[1px] flex justify-center items-center">
                            <div className="w-12 h-12 flex justify-center items-center rounded-full bg-[#aaaaaaaa]">
                              <Image src={play} alt="play" width={24} />
                            </div>
                          </div>
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
        <div className="py-1 border-y border-common-gray-light">
          <div>{post.likeData.total || null}</div>
          <div></div>
          <div></div>
        </div>

        <Actions
          liked={post.likeData.isLiked}
          postId={post.id}
          setPosts={setPosts}
        />
      </div>
      {isShow && (
        <ViewPost onClose={closePopup} post={post} setPosts={setPosts} />
      )}
    </>
  )
}

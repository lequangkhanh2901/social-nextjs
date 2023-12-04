import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'

import { Post } from '~/helper/type/common'
import { Post as IPost } from '~/helper/type/common'
import useClickOutSide from '~/helper/hooks/useClickOutSide'
import { useLanguageContext } from '~/components/layout/Wrapper'
import { getDictionary } from '~/locales'
import usePopup from '~/helper/hooks/usePopup'
import { deleteRequest } from '~/services/client/deleteRequest'
import { getRequest } from '~/services/client/getRequest'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'

import Avatar from '~/components/common/Avatar'
import Menu from '~/components/common/Menu'
import { MenuItem as IMenuItem } from '~/components/common/Menu/Item'
import Report from '~/components/common/Report'

import likeActive from '~/public/icons/home/like_active.svg'
import messageActive from '~/public/icons/message_active.svg'
import bin from '~/public/icons/bin.svg'
import edit from '~/public/icons/edit.svg'

import ViewPost from './ViewPost'
import Actions from './Actions'
import UpdatePost from './UpdatePost'
import Share from './Share'
import MediasPreview from './MediasPreview'
import UserLikePost from './UserLikePost'

interface Props {
  post: Post
  setPosts: Dispatch<SetStateAction<IPost[]>>
}

export default function Post({ post, setPosts }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  const userLikeRef = useRef<HTMLDivElement>(null)
  const [isViewAll, setIsViewAll] = useState(false)
  const { isShow, openPopup, closePopup } = usePopup()
  const updatePopup = usePopup()
  const sharePopup = usePopup()
  const reportPopup = usePopup()
  const userLikePopup = usePopup()
  const { currentUser } = useAppSelector((state: RootState) => state.user)

  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > contentRef.current.clientHeight) {
      } else {
        setIsViewAll(true)
      }
    }
  }, [contentRef.current])

  useClickOutSide(
    () => {
      if (userLikePopup.isShow) userLikePopup.closePopup()
    },
    userLikeRef,
    [userLikePopup.isShow]
  )

  const { lang } = useLanguageContext()
  const { tHome } = getDictionary(lang)

  const handleDeletePost = async () => {
    try {
      await deleteRequest('/post', {
        id: post.id
      })

      toast.success('Deleted')
      setPosts((prev) => prev.filter((_post) => _post.id !== post.id))
    } catch (error) {
      toast.error('Delete fail')
    }
  }

  const renderMenuOption = (): IMenuItem[] => {
    if (currentUser.username === post.user.username) {
      return [
        {
          icon: edit,
          label: 'Update',
          handle: updatePopup.openPopup
        },

        {
          icon: bin,
          label: 'Delete',
          requireConfirm: true,
          confirmMessage: 'Confirm delete this post?',
          handle: handleDeletePost
        }
      ]
    }

    return [
      {
        label: 'Report',
        handle: reportPopup.openPopup
      }
    ]
  }

  const handleShared = async (id: string) => {
    try {
      const post: any = await getRequest(`/post/${id}/get`)
      setPosts((prev) => [post, ...prev])
      sharePopup.closePopup()
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } catch (error) {}
  }

  return (
    <>
      <div className="rounded-lg shadow bg-common-white p-4 mt-4">
        <div className="flex gap-2 items-center">
          <Link
            href={`/user/@${post.user.username}`}
            className="rounded-full w-fit"
          >
            <Avatar src={post.user.avatarId.cdn} width={40} />
          </Link>
          <div>
            <Link href={`/user/@${post.user.username}`}>{post.user.name}</Link>{' '}
            {!post.isOrigin && (
              <span className="text-sm text-common-gray-dark">
                shared a post
              </span>
            )}
            <p className="text-[13px] text-txt-gray">
              {format(new Date(post.createdAt), 'HH:mm dd/MM/yyyy')}
            </p>
          </div>
          <Menu
            classNameWrapButton="ml-auto"
            classNameButton="rounded-full"
            placement={{
              x: 'left'
            }}
            className="right-0 w-[150px]"
            menu={renderMenuOption()}
          />
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
          {post.originPost && (
            <div className="pl-3">
              <div className="flex gap-2 items-center">
                <Link
                  href={`/user/@${post.originPost.user.username}`}
                  className="rounded-full w-fit"
                >
                  <Avatar src={post.originPost.user.avatarId.cdn} width={36} />
                </Link>
                <div>
                  <Link href={`/user/@${post.originPost.user.username}`}>
                    {post.originPost.user.name}
                  </Link>{' '}
                  <p className="text-[13px] text-txt-gray">
                    {format(
                      new Date(post.originPost.createdAt),
                      'HH:mm dd/MM/yyyy'
                    )}
                  </p>
                </div>
              </div>
              <div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: post.originPost.content.replace(/\n/g, '<br/>')
                  }}
                  className={'line-clamp-3'}
                ></div>
                {post.originPost.medias.length > 0 && (
                  <MediasPreview
                    medias={post.originPost.medias}
                    onClick={openPopup}
                  />
                )}
              </div>
            </div>
          )}
          {post.medias.length > 0 && (
            <MediasPreview medias={post.medias} onClick={openPopup} />
          )}
        </div>
        <div className="py-1 border-y border-common-gray-light text-xs text-common-gray-dark flex gap-8">
          {post.likeData.total > 0 && (
            <div
              className="flex border-b border-common-white hover:border-common-gray-dark cursor-pointer relative"
              onClick={userLikePopup.togglePopup}
              ref={userLikeRef}
            >
              <Image src={likeActive} alt="" width={14} />
              {post.likeData.total}
              {userLikePopup.isShow && <UserLikePost postId={post.id} />}
            </div>
          )}
          {post.totalComment > 0 && (
            <div className="flex">
              <Image src={messageActive} alt="" width={14} />
              {post.totalComment}
            </div>
          )}
        </div>

        <Actions
          liked={post.likeData.isLiked}
          postId={post.id}
          setPosts={setPosts}
          onCommentClick={openPopup}
          onShare={sharePopup.openPopup}
        />
      </div>
      {isShow && (
        <ViewPost onClose={closePopup} post={post} setPosts={setPosts} />
      )}
      {updatePopup.isShow && (
        <UpdatePost
          isOpen={updatePopup.isShow}
          onClose={updatePopup.closePopup}
          onUpdated={(data) => {
            updatePopup.closePopup()
            setPosts((prev) => {
              const post = prev.find((_post) => _post.id === data.id) as Post
              post.content = data.content
              if (post.isOrigin) {
                post.medias = data.medias
                post.type = data.type
              }

              return [...prev]
            })
          }}
          {...post}
        />
      )}

      {sharePopup.isShow && (
        <Share
          onClose={sharePopup.closePopup}
          post={post}
          onShared={handleShared}
        />
      )}

      {reportPopup.isShow && (
        <Report
          nameUser={post.user.name}
          onClose={reportPopup.closePopup}
          type="POST"
          postId={post.id}
        />
      )}
    </>
  )
}

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { Post } from '~/helper/type/common'
import { MediaType } from '~/helper/enum/post'
import { postRequest } from '~/services/client/postRequest'

import Avatar from '~/components/common/Avatar'
import Modal from '~/components/common/Modal/Modal'
import Video from '~/components/common/Video'

import dot from '~/public/icons/dots.svg'
import likeActive from '~/public/icons/home/like_active.svg'
import messageActive from '~/public/icons/message_active.svg'

import Actions from './Actions'
import Comments, { CommentsRef } from './Comments'
import AddComment from './Comments/AddComment'

interface Props {
  post: Post
  onClose: () => void
  setPosts: Dispatch<SetStateAction<Post[]>>
}

export default function ViewPost({ post, onClose, setPosts }: Props) {
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const commentsRef = useRef<CommentsRef>(null)

  const commentBoxRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => {
    let resizeOfserver: ResizeObserver | undefined

    if (commentBoxRef.current) {
      resizeOfserver = new ResizeObserver(() => {
        setContentHeight(
          `calc(100% - 56px - ${commentBoxRef.current?.offsetHeight || 0}px)`
        )
      })
      resizeOfserver.observe(commentBoxRef.current)
    }

    return () => {
      if (resizeOfserver) resizeOfserver.disconnect()
    }
  }, [commentBoxRef.current])

  const handleComment = async (file?: File) => {
    try {
      let body: any

      if (file) {
        body = new FormData()
        body.append('file', file)
        body.append('content', comment.trim())
        body.append('id', post.id)
      } else {
        body = {
          id: post.id,
          content: comment.trim()
        }
      }

      const data: any = await postRequest('/comment', body, {
        'Content-Type': file ? 'multipart/form-data' : 'application/json'
      })

      commentsRef.current?.addComment({
        children: [],
        id: data.id,
        createdAt: data.createdAt,
        parent: null,
        user: {
          name: currentUser.name,
          username: currentUser.username,
          avatarId: {
            cdn: currentUser.avatar
          }
        },
        content: comment.trim(),
        likeData: {
          total: 0,
          isLiked: false
        },
        media: data.media
      })

      setComment('')
      setPosts((prev) => {
        const findPost = prev.find((p) => p.id === post.id) as Post
        findPost.totalComment += 1
        return [...prev]
      })
    } catch (error) {
      toast.error('Server error')
    }
  }

  const handleDeleteComment = (totalDeleted: number) => {
    setPosts((prev) => {
      const postFind = prev.find((p) => p.id === post.id) as Post
      postFind.totalComment -= totalDeleted
      return [...prev]
    })
  }

  return (
    <Modal isOpen onRequestClose={onClose}>
      <div className="w-[700px] h-fit outline-none border-none max-h-[90vh] flex flex-col items-stretch">
        <h2 className="font-bold text-xl py-3 border-b border-common-gray-medium h-14 flex items-center text-center justify-center">
          Post of {post.user.name}
        </h2>
        <div
          className="h-fit max-h-[calc(82vh-100px)] overflow-y-auto px-2 duration-200 grow"
          style={{
            // height: `calc(100% - 56px - ${
            //   commentBoxRef.current?.offsetHeight || 0
            // }px)`
            height: contentHeight
          }}
        >
          <div className="flex gap-2 px-2 mt-2">
            <Link
              href={`user/${post.user.username}`}
              className="text-sm font-bold shrink-0"
            >
              <Avatar src={post.user.avatarId.cdn} width={40} />
            </Link>
            <div className="grow">
              <Link
                href={`user/${post.user.username}`}
                className="text-sm font-bold"
              >
                {post.user.name}
              </Link>
              <p className="text-sm font-light">{post.content}</p>
            </div>
            <div className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-common-gray-light align-middle cursor-pointer shrink-0">
              <Image src={dot} alt="" width={24} />
            </div>
          </div>
          <div className="">
            {post.medias.length > 0 &&
              post.medias.map((media) => (
                <div
                  key={media.id}
                  className=" border border-common-gray-medium mt-5"
                >
                  {media.type === MediaType.IMAGE ? (
                    <Image
                      src={media.cdn}
                      alt=""
                      height={500}
                      width={500}
                      className="w-full object-contain"
                    />
                  ) : (
                    <Video src={media.cdn} className="max-h-[500px]" />
                  )}
                </div>
              ))}
          </div>
          <div>
            <div className="py-1 border-y border-common-gray-light text-xs text-common-gray-dark flex gap-8">
              {post.likeData.total > 0 && (
                <div className="flex">
                  <Image src={likeActive} alt="" width={14} />
                  {post.likeData.total}
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
            />
          </div>
          <Comments
            idPost={post.id}
            ref={commentsRef}
            onDeletComment={handleDeleteComment}
          />
        </div>
        <AddComment
          key={'add-comment'}
          ref={commentBoxRef}
          comment={comment}
          setComment={setComment}
          onComment={handleComment}
        />
      </div>
    </Modal>
  )
}

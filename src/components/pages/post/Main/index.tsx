'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { MediaType } from '~/helper/enum/post'
import { Post } from '~/helper/type/common'
import { getRequest } from '~/services/client/getRequest'

import Avatar from '~/components/common/Avatar'
import Video from '~/components/common/Video'

import likeActive from '~/public/icons/home/like_active.svg'
import messageActive from '~/public/icons/message_active.svg'
import Comments, { CommentsRef } from '../../home/Post/Comments'
import AddComment from '../../home/Post/Comments/AddComment'
import { postRequest } from '~/services/client/postRequest'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { toast } from 'react-hot-toast'
import Actions from '../../home/Post/Actions'

export default function Main() {
  const postId = useParams().postId as string
  const { currentUser } = useAppSelector((state: RootState) => state.user)

  const [post, setPost] = useState<Post | null>(null)
  const [comment, setComment] = useState('')
  const commentsRef = useRef<CommentsRef>(null)
  const commentBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data: any = await getRequest(`/post/${postId}/get`)
        setPost(data)
      } catch (error) {}
    })()
  }, [postId])

  const handleComment = async (file?: File) => {
    try {
      let body: any

      if (file) {
        body = new FormData()
        body.append('file', file)
        body.append('content', comment.trim())
        body.append('id', postId)
      } else {
        body = {
          id: postId,
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
    } catch (error) {
      toast.error('Server error')
    }
  }

  if (post)
    return (
      <div className="bg-common-white p-4 rounded-md">
        <div className="flex">
          <Link
            href={`user/@${post.user.username}`}
            className="text-sm font-bold shrink-0 rounded-full"
          >
            <Avatar src={post.user.avatarId.cdn} width={40} />
          </Link>
          <div className="grow">
            <Link
              href={`user/@${post.user.username}`}
              className="text-sm font-bold"
            >
              {post.user.name}
            </Link>
            <p className="text-sm font-light">{post.content}</p>
          </div>
        </div>
        <div>
          {post.medias.map((media) => (
            <div key={media.id}>
              {media.type === MediaType.IMAGE ? (
                <Image
                  src={media.cdn}
                  alt=""
                  width={500}
                  height={800}
                  className="w-full mt-2 rounded"
                />
              ) : (
                <Video src={media.cdn} className="max-h-[80vh]" />
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

          <Actions liked={post.likeData.isLiked} postId={postId} />
          <Comments
            idPost={postId}
            ref={commentsRef}
            onDeletComment={() => {
              //
            }}
          />
        </div>
        <AddComment
          key={'add-comment'}
          ref={commentBoxRef}
          comment={comment}
          setComment={setComment}
          onComment={(data) => handleComment(data?.file)}
        />
      </div>
    )

  return 'loading'
}

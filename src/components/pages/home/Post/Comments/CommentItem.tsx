import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

import usePopup from '~/helper/hooks/usePopup'
import { LikeType } from '~/helper/enum/common'
import { MediaType } from '~/helper/enum/post'
import { postRequest } from '~/services/client/postRequest'
import { deleteRequest } from '~/services/client/deleteRequest'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'

import Avatar from '~/components/common/Avatar'
import Video from '~/components/common/Video'

import AddComment from './AddComment'
import { Comment } from '.'
import ActionComment from './ActionComment'

interface Props {
  comment: Comment
  porstId: string
  level?: number
  onLike: (id: number, message: string) => void
  setComments: Dispatch<SetStateAction<Comment[]>>
  onDeletComment: (totalDeleted: number) => void
}

export default function CommentItem({
  comment,
  porstId,
  level = 1,
  onLike,
  setComments,
  onDeletComment
}: Props) {
  const { isShow, togglePopup, closePopup } = usePopup()
  const [commentVal, setCommentVal] = useState('')
  const [contentHeight, setContentHeight] = useState(0)

  const { currentUser } = useAppSelector((state: RootState) => state.user)

  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let resizeOfserver: ResizeObserver | undefined

    if (boxRef.current) {
      resizeOfserver = new ResizeObserver(() => {
        setContentHeight(boxRef.current?.offsetHeight || 0)
      })
      resizeOfserver.observe(boxRef.current)
    }

    return () => {
      if (resizeOfserver) resizeOfserver.disconnect()
    }
  }, [boxRef.current])

  const handleLike = async () => {
    try {
      const data: any = await postRequest('/like', {
        id: comment.id,
        type: LikeType.COMMENT
      })

      onLike(comment.id, data.message)
    } catch (error) {}
  }

  const handleReply = async (file?: File) => {
    if (commentVal.trim() || file) {
      try {
        let body: any

        if (file) {
          body = new FormData()
          body.append('file', file)
          body.append('content', commentVal.trim())
          body.append('id', porstId)
          body.append('parentId', comment.id)
        } else {
          body = {
            id: porstId,
            content: commentVal.trim(),
            parentId: comment.id
          }
        }

        const data: any = await postRequest('/comment', body, {
          'Content-Type': file ? 'multipart/form-data' : 'application/json'
        })

        setComments((prev) => [
          ...prev,
          {
            children: [],
            id: data.id,
            createdAt: data.createdAt,
            user: {
              name: currentUser.name,
              username: currentUser.username,
              avatarId: {
                cdn: currentUser.avatar
              }
            },
            likeData: {
              total: 0,
              isLiked: false
            },
            parent: {
              id: data.parent.id
            },
            content: data.content,
            media: data.media
          }
        ])
        closePopup()
      } catch (error) {
        toast.error('Server error')
      }
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const data = (await deleteRequest('/comment', {
        id
      })) as {
        ids: number[]
        message: string
      }
      toast.success('Deleted')
      setComments((prev) =>
        prev.filter((comment) => !data.ids.includes(comment.id))
      )
      onDeletComment(data.ids.length)
    } catch (error) {
      toast.error('Can not delete')
    }
  }

  return (
    <div
      className={`flex gap-2 mt-3 ${
        level === 2 ? 'ml-8' : level === 3 ? 'ml-16' : ''
      }`}
    >
      <Avatar src={comment.user.avatarId.cdn} width={36 - (level - 1) * 4} />
      <div className="w-full group">
        <div className="w-fit max-w-[calc(100%-30px)] p-1 px-3 rounded-xl bg-common-gray-light relative">
          <Link href={`/user/${comment.user.username}`} className="font-bold">
            {comment.user.name}
          </Link>
          <p>{comment.content}</p>
          {/* <div className="absolute top-1/2 left-full -translate-y-1/2 translate-x-1 flex justify-center items-center w-7 h-7 bg-common-gray-light rounded-full cursor-pointer invisible group-hover:visible">
            <Image src={dots} alt="" width={20} className="opacity-80" />
            <div>a</div>
          </div> */}
          {comment.media &&
            (comment.media.type === MediaType.IMAGE ? (
              <Image
                src={comment.media.cdn}
                alt=""
                width={300}
                height={300}
                className="w-[400px] object-contain"
              />
            ) : (
              <Video src={comment.media.cdn} className="w-[400px]" />
            ))}
          <ActionComment
            commentUsername={comment.user.username}
            onDelete={() => handleDelete(comment.id)}
          />
        </div>
        <div className="flex w-full gap-4 text-xs font-semibold text-common-gray-dark px-3 select-none">
          <div
            className={`cursor-pointer ${
              comment.likeData.isLiked ? 'text-common-purble' : ''
            }`}
            onClick={handleLike}
          >
            Like <span>{comment.likeData.total || ''}</span>
          </div>
          <div className={`cursor-pointer`} onClick={togglePopup}>
            Reply
          </div>
          <div>{format(new Date(comment.createdAt), 'HH:mm dd/MM/yy', {})}</div>
        </div>
        <div
          className=" duration-300 overflow-hidden"
          style={{
            height: isShow ? contentHeight : 0
          }}
        >
          <AddComment
            key={comment.id}
            ref={boxRef}
            comment={commentVal}
            setComment={setCommentVal}
            onComment={(file) => handleReply(file)}
          />
        </div>
      </div>
    </div>
  )
}

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

import usePopup from '~/helper/hooks/usePopup'
import { LikeType } from '~/helper/enum/common'
import { postRequest } from '~/services/client/postRequest'

import Avatar from '~/components/common/Avatar'
import AddComment from './AddComment'
import { Comment } from '.'

interface Props {
  comment: Comment
  porstId: string
  onLike: (id: number, message: string) => void
}

export default function CommentItem({ comment, porstId, onLike }: Props) {
  const { isShow, togglePopup } = usePopup()
  const [commentVal, setCommentVal] = useState('')

  const replyRef = useRef<HTMLDivElement>(null)

  const contentHeight = useMemo(() => {
    if (replyRef.current) {
      return replyRef.current.offsetHeight
    }
    return 0
  }, [replyRef.current?.offsetHeight])

  const handleLike = async () => {
    try {
      const data: any = await postRequest('/like', {
        id: comment.id,
        type: LikeType.COMMENT
      })

      onLike(comment.id, data.message)
    } catch (error) {}
  }

  const handleReply = async () => {
    if (commentVal.trim()) {
      try {
        await postRequest('/comment', {
          id: porstId,
          content: commentVal,
          parentId: comment.id
        })
      } catch (error) {
        toast.error('Server error')
      }
    }
  }

  return (
    <div className="flex gap-2 mt-3">
      <Avatar src={comment.user.avatarId.cdn} width={36} />
      <div className="w-full">
        <div className="w-fit p-1 px-3 rounded-xl bg-common-gray-light">
          <Link href={`/user/${comment.user.username}`} className="font-bold">
            {comment.user.name}
          </Link>
          <p>{comment.content}</p>
        </div>
        <div className="flex w-full gap-4 text-xs font-semibold text-common-gray-dark px-3 select-none">
          <div
            className={`cursor-pointer ${
              comment.likeData.isLiked ? 'text-common-purble' : ''
            }`}
            onClick={handleLike}
          >
            Like
          </div>
          <div className={`cursor-pointer`} onClick={togglePopup}>
            Reply
          </div>
        </div>
        <div
          className=" duration-300 overflow-hidden"
          style={{
            height: isShow ? contentHeight : 0
          }}
        >
          <div ref={replyRef}>
            <AddComment
              comment={commentVal}
              setComment={setCommentVal}
              onComment={handleReply}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

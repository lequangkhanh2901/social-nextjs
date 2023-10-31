import { Dispatch, SetStateAction } from 'react'
import Image from 'next/image'

import { LikeType } from '~/helper/enum/common'
import { Post } from '~/helper/type/common'
import { postRequest } from '~/services/client/postRequest'

import like from '~/public/icons/home/like.svg'
import likeActive from '~/public/icons/home/like_active.svg'
import message from '~/public/icons/message.svg'

interface Props {
  liked: boolean
  postId: string
  setPosts: Dispatch<SetStateAction<Post[]>>
  onCommentClick?: () => void
}

export default function Actions({
  liked,
  postId,
  setPosts,
  onCommentClick = () => {
    //
  }
}: Props) {
  const handleLike = async () => {
    try {
      const data: any = await postRequest('/like', {
        id: postId,
        type: LikeType.POST
      })

      setPosts((prev) => {
        const postsTmp = [...prev]
        const getPost = postsTmp.find(
          (postTmp) => postTmp.id === postId
        ) as Post

        getPost.likeData.isLiked = data.message === 'LIKED'
        getPost.likeData.total =
          data.message === 'LIKED'
            ? getPost.likeData.total + 1
            : getPost.likeData.total - 1

        return postsTmp
      })
    } catch (error) {}
  }

  return (
    <div className="flex gap-4 px-5 text-txt-primary mt-1">
      <div
        className="hover:bg-common-gray-light duration-100 grow flex items-center gap-2 justify-center p-1 rounded cursor-pointer"
        onClick={handleLike}
      >
        <Image src={liked ? likeActive : like} alt="" width={22} />
        <p className={liked ? 'text-common-purble' : ''}>Like</p>
      </div>
      <div
        className="hover:bg-common-gray-light duration-100 grow flex items-center gap-2 justify-center p-1 rounded cursor-pointer"
        onClick={onCommentClick}
      >
        <Image src={message} alt="" width={20} />
        <p>Comment</p>
      </div>
      <div className="hover:bg-common-gray-light duration-100 grow flex items-center gap-2 justify-center p-1 rounded cursor-pointer">
        <Image src={like} alt="" width={20} />
        <p>Like</p>
      </div>
    </div>
  )
}

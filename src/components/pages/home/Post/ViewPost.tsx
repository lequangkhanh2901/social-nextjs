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

  const handleComment = async () => {
    if (comment.trim()) {
      try {
        const data: any = await postRequest('/comment', {
          id: post.id,
          content: comment.trim()
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
          }
        })

        setComment('')
      } catch (error) {
        toast.error('Server error')
      }
    }
  }

  return (
    <Modal isOpen onRequestClose={onClose}>
      <div className="w-[700px] h-[clamp(300px,9999px,90vh)] outline-none border-none">
        <h2 className="font-bold text-xl py-3 border-b border-common-gray-medium h-14 flex items-center text-center justify-center">
          Post of {post.user.name}
        </h2>
        <div
          className="h-[calc(100%-156px)] overflow-y-auto px-2 duration-200"
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
                    <img
                      src={media.cdn}
                      alt=""
                      // unoptimized
                      // width={500}
                      className="w-full object-contain"
                    />
                  ) : (
                    <Video src={media.cdn} className="max-h-[500px]" />
                  )}
                </div>
              ))}
          </div>
          <div>
            <div>
              <div>{post.likeData.total}</div>
            </div>

            <Actions
              liked={post.likeData.isLiked}
              postId={post.id}
              setPosts={setPosts}
            />
          </div>
          <Comments idPost={post.id} ref={commentsRef} />
        </div>
        <AddComment
          ref={commentBoxRef}
          comment={comment}
          setComment={setComment}
          onComment={handleComment}
        />
        {/* <div
          ref={commentBoxRef}
          className="border-t border-common-gray-medium p-3  flex gap-1 "
        >
          <div>
            <Avatar src={currentUser.avatar} width={36} />
          </div>
          <div className="grow bg-common-gray-light p-2 rounded-xl">
            <textarea
              value={comment}
              placeholder="Comment"
              className="w-full block resize-none bg-[#00000000] outline-none px-1 h-6 max-h-[200px] text-txt-primary"
              onChange={(e) => {
                setComment(e.target.value)
                e.target.style.height = ''
                e.target.style.height = e.target.scrollHeight + 'px'
              }}
            ></textarea>
            <div className="pt-1 flex justify-between items-center">
              <div>
                <label
                  htmlFor="add-image-comment"
                  className="flex justify-center items-center w-8 h-8 opacity-60 rounded-full hover:bg-common-gray-medium duration-150 hover:opacity-80 cursor-pointer"
                >
                  <Image src={imagePlus} alt="" width={20} />
                  <input
                    id="add-image-comment"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                  />
                </label>
              </div>
              <button
                className={`flex justify-center items-center w-8 h-8  rounded-full hover:bg-common-gray-medium duration-150 hover:opacity-80 ${
                  comment.trim() ? '' : 'opacity-60'
                }`}
                onClick={handleComment}
              >
                <Image
                  src={comment.trim() ? sendActive : send}
                  alt=""
                  width={20}
                />
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </Modal>
  )
}

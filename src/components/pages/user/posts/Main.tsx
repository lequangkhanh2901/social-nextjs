'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'

import { Post } from '~/helper/type/common'
import useIsInView from '~/helper/hooks/useIsInView'
import { RegimePost } from '~/helper/enum/post'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { getRequest } from '~/services/client/getRequest'

import PostComponent from '../../home/Post'
import PostSkeleton from '../../home/Post/Skeleton'

export default function Main() {
  const username = useParams().username as string
  const { currentUser } = useAppSelector((state: RootState) => state.user)

  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const showMoreRef = useRef<HTMLDivElement>(null)

  const isInview = useIsInView(showMoreRef)

  useEffect(() => {
    if (!isLoading && isInview && total > posts.length) {
      setPage((prev) => prev + 1)
    }
  }, [isInview])

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        const data: any = await getRequest(`/post/${username}`, {
          params: {
            skip: (page - 1) * 10,
            limit: 10
          }
        })

        setPosts((prev) => [...prev, ...data.posts])
        setTotal(data.meta.total)
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    })()
  }, [username, page])

  return (
    <div className="pb-5">
      {posts.map((post) => {
        if (
          (post.type === RegimePost.CUSTOM_ONLY &&
            !post.userIds?.includes(currentUser.id)) ||
          (post.type === RegimePost.CUSTOM_EXCLUDE &&
            post.userIds?.includes(currentUser.id))
        )
          return null
        return (
          <PostComponent
            key={post.id}
            post={{ ...post, user: { ...post.user, username } }}
            setPosts={setPosts}
          />
        )
      })}

      <div
        ref={showMoreRef}
        className={`${total > posts.length ? '' : 'hidden'}`}
      >
        <PostSkeleton />
      </div>
    </div>
  )
}

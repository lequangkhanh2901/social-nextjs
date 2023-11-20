'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useLanguageContext } from '~/components/layout/Wrapper'
import { getDictionary } from '~/locales'
import { getRequest } from '~/services/client/getRequest'
import { Post as IPost } from '~/helper/type/common'
import useIsInView from '~/helper/hooks/useIsInView'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'

import Post from '../Post'
import AddPost from '../AddPost'
import PostSkeleton from '../Post/Skeleton'

export default function Main() {
  const [posts, setPosts] = useState<IPost[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const { lang } = useLanguageContext()
  const { tCommon } = getDictionary(lang)
  const { currentUser } = useAppSelector((state: RootState) => state.user)

  const showMoreRef = useRef<HTMLDivElement>(null)
  const isInView = useIsInView(showMoreRef)

  useEffect(() => {
    const fetchPosts = async () => {
      if (isLoading) return

      setIsLoading(true)
      try {
        const data: any = await getRequest(
          `/post?skip=${(page - 1) * 10}&limit=10`
        )
        setPosts((prev) => [...prev, ...data.posts])
        setTotal(data.meta.total)
      } catch (error) {
        toast.error(tCommon.serverError)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [page])

  useEffect(() => {
    if (isInView && !isLoading && total > posts.length) {
      setPage((prev) => prev + 1)
    }
  }, [isInView])

  return (
    <>
      <AddPost setPosts={setPosts} />
      <div>
        {posts.map((post) => {
          if (
            (post.type === ('CUSTOM_ONLY' as any) &&
              !post.userIds?.includes(currentUser.id)) ||
            (post.type === ('CUSTOM_EXCLUDE' as any) &&
              post.userIds?.includes(currentUser.id))
          )
            return null
          return <Post key={post.id} post={post} setPosts={setPosts} />
        })}
      </div>

      <div
        ref={showMoreRef}
        className={`${total > posts.length ? '' : 'hidden'}`}
      >
        <PostSkeleton />
      </div>
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useLanguageContext } from '~/components/layout/Wrapper'
import { getDictionary } from '~/locales'
import { getRequest } from '~/services/client/getRequest'
import { Post as IPost } from '~/helper/type/common'
import Post from '../Post'
import AddPost from '../AddPost'

export default function Main() {
  const [posts, setPosts] = useState<IPost[]>([])
  const [page] = useState(1)

  const { lang } = useLanguageContext()
  const { tCommon } = getDictionary(lang)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getRequest(`/post?skip=${(page - 1) * 10}&limit=10`)
        setPosts(data as any[])
      } catch (error) {
        toast.error(tCommon.serverError)
      }
    }
    fetchPosts()
  }, [page])

  return (
    <>
      <AddPost setPosts={setPosts} />
      <div>
        {posts.map((post) => (
          <Post key={post.id} post={post} setPosts={setPosts} />
        ))}
      </div>
    </>
  )
}

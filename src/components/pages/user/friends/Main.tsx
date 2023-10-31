'use client'

import { useEffect, useRef, useState } from 'react'
import Wrapper from '../Wrapper'
import { getRequest } from '~/services/client/getRequest'
import { useParams } from 'next/navigation'
import UserItem from './UserItem'
import Skeleton from '../photos/Skeleton'
import useIsInView from '~/helper/hooks/useIsInView'

interface Friend {
  id: string
  user: {
    id: string
    name: string
    username: string
    avatarId: {
      id: string
      cdn: string
    }
  }
}

export default function Main() {
  const { username } = useParams()
  const [friends, setFriends] = useState<Friend[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const loadMoreRef = useRef(null)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        const data: any = await getRequest(`/friend/${username}`, {
          params: {
            skip: (page - 1) * 12,
            limit: 12
          }
        })

        setFriends(data.friends)
        setCount(data.meta.count)
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    })()
  }, [page])

  const isInView = useIsInView(loadMoreRef)
  useEffect(() => {
    if (isInView && !isLoading && count > friends.length) {
      setPage((prev) => prev + 1)
    }
  }, [isInView])

  return (
    <Wrapper title="Friends">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {friends.map((friend) => (
          <UserItem key={friend.id} user={friend.user} />
        ))}
      </div>

      <div
        ref={loadMoreRef}
        className={count === friends.length ? 'hidden' : ''}
      >
        <Skeleton />
      </div>
    </Wrapper>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { getRequest } from '~/services/client/getRequest'
import useIsInView from '~/helper/hooks/useIsInView'

import UserItem from './UserItem'
import Skeleton from '../../user/photos/Skeleton'

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
  const [friends, setFriends] = useState<Friend[]>([])
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const loadMoreRef = useRef(null)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        const data: any = await getRequest(`/friend`, {
          params: {
            skip: (page - 1) * 12,
            limit: 12
          }
        })

        setFriends((prev) => [...prev, ...data.friends])
        setCount(data.meta.count)
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const isInView = useIsInView(loadMoreRef)
  useEffect(() => {
    if (isInView && !isLoading && count > friends.length) {
      setPage((prev) => prev + 1)
    }
  }, [isInView])

  return (
    <div>
      <h1 className="p-8 text-2xl font-extrabold">Friends</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 ">
        {friends.map((friend) => (
          <UserItem user={friend.user} key={friend.id} />
        ))}
      </div>
      <div
        ref={loadMoreRef}
        className={count === friends.length ? 'hidden' : ''}
      >
        <Skeleton />
      </div>
    </div>
  )
}

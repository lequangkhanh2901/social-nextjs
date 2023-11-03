import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

import { getRequest } from '~/services/client/getRequest'
import useIsInView from '~/helper/hooks/useIsInView'

import Skeleton from '../photos/Skeleton'
import UserItem from './UserItem'
import { Friend } from './Main'

export default function AllFriends() {
  const { username } = useParams()
  const search = useSearchParams().get('search')

  const [friends, setFriends] = useState<Friend[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  const loadMoreRef = useRef(null)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        const data: any = await getRequest(`/friend/${username}`, {
          params: {
            skip: (page - 1) * 12,
            limit: 12,
            search
          }
        })

        setFriends(data.friends)
        setCount(data.meta.count)
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    })()
  }, [page, search])

  const isInView = useIsInView(loadMoreRef)
  useEffect(() => {
    if (isInView && !isLoading && count > friends.length) {
      setPage((prev) => prev + 1)
    }
  }, [isInView])

  return (
    <div>
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
    </div>
  )
}

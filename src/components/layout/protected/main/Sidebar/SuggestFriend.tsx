'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { IUser } from '~/helper/type/user'
import { getRequest } from '~/services/client/getRequest'
import Avatar from '~/components/common/Avatar'

export default function SuggestFriend() {
  const [users, setUsers] = useState<(IUser & { countSameFriend?: number })[]>(
    []
  )
  const [isInit, setIsInit] = useState(false)
  const [initRandom, setInitRandom] = useState(false)

  useEffect(() => {
    ;(async () => {
      const data: any = await getRequest('/friend/of-friends', {
        params: {
          limit: 10
          // skip: (pages.same - 1) * 10
        }
      })

      setUsers(data.users)
      setIsInit(true)
    })()
  }, [])

  useEffect(() => {
    if (!isInit || initRandom) return

    if (users.length < 10) {
      ;(async () => {
        const data: any = await getRequest('/user/random', {
          params: {
            limit: 10 - users.length,
            excludeRequestFriend: true
          }
        })

        setUsers((prev) => [...prev, ...data.users])
        setInitRandom(true)
      })()
    }
  }, [users])

  return (
    <div className="p-4 rounded-md bg-common-white">
      <h2 className="text-xl font-semibold">Suggest friends</h2>
      {users.map((user) => (
        <Link
          key={user.id}
          href={`/user/@${user.username}`}
          className="flex gap-2 items-center p-1 rounded hover:bg-common-gray-light"
        >
          <Avatar src={user.avatarId.cdn} width={36} />
          <div>
            <p>{user.name}</p>
            {user.countSameFriend && (
              <span className="text-xs">
                {user.countSameFriend} same friend
              </span>
            )}
          </div>
        </Link>
      ))}

      <Link
        href="/friends/suggest"
        className="text-sm hover:underline ml-auto block w-fit"
      >
        View more {'>'}
      </Link>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { IUser } from '~/helper/type/user'
import { getRequest } from '~/services/client/getRequest'
import Avatar from '~/components/common/Avatar'

export default function Friends() {
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const data: any = await getRequest(`/friend`, {
          params: {
            limit: 10
          }
        })

        setUsers(data.friends.map((friend: any) => friend.user))
      } catch (error) {}
    })()
  }, [])

  return (
    <div className="p-4 rounded-md bg-common-white">
      <h2 className="text-xl font-semibold">Friends</h2>
      {users.map((user) => (
        <Link
          href={`/user/@${user.username}`}
          key={user.id}
          className="flex items-center gap-2 p-1 rounded hover:bg-common-gray-light"
        >
          <Avatar src={user.avatarId.cdn} width={36} />
          <p>{user.name}</p>
        </Link>
      ))}
    </div>
  )
}

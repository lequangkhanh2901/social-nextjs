import { useEffect, useState } from 'react'
import Link from 'next/link'

import { IUser } from '~/helper/type/user'
import { getRequest } from '~/services/client/getRequest'

interface Props {
  postId: string
}

export default function UserLikePost({ postId }: Props) {
  const [users, setUsers] = useState<IUser[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        const data: any = await getRequest(`/like/${postId}/users/post`)
        setUsers(data)
      } catch (error) {}
    })()
  }, [postId])

  return (
    <div
      className="absolute p-2 rounded bg-common-white z-10 top-full left-0 w-[200px] shadow-[0_2px_4px_#00000080]"
      onClick={(e) => e.stopPropagation()}
    >
      {users.map((user) => (
        <Link
          href={`/user/@${user.username}`}
          className="hover:underline"
          key={user.id}
        >
          {user.name}
        </Link>
      ))}
    </div>
  )
}

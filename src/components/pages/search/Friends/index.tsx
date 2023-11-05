import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { getRequest } from '~/services/client/getRequest'

import UserItem, { User } from '../UserItem'

export default function Friends() {
  const q = useSearchParams().get('q') || ''
  const { currentUser } = useAppSelector((state: RootState) => state.user)

  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const data: any = await getRequest(`/friend/@${currentUser.username}`, {
          params: {
            search: q
          }
        })

        setUsers(data.friends.map((friend: any) => friend.user))
      } catch (error) {
        toast.error('Server error')
      }
    })()
  }, [q])

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-9">
      {users.map((user) => (
        <UserItem {...user} key={user.id} />
      ))}
    </div>
  )
}

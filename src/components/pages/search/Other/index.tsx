import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { getRequest } from '~/services/client/getRequest'

import UserItem, { User } from '../UserItem'

export default function Other() {
  const q = useSearchParams().get('q') || ''

  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const data: any = await getRequest('/user/random', {
          params: {
            name: q
          }
        })
        setUsers(data.users)
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

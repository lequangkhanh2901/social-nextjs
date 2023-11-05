import { memo, useEffect, useState } from 'react'
import { getRequest } from '~/services/client/getRequest'
import UserItem, { User } from './UserItem'

function FriendsOfFriends({
  search,
  onChangeStatus
}: {
  search: string
  onChangeStatus: (loading: boolean) => void
}) {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (!search) return
    ;(async () => {
      try {
        onChangeStatus(true)
        const data: any = await getRequest('/friend/of-friends', {
          params: {
            limit: 10,
            name: search
          }
        })

        setUsers(data.users)
      } catch (error) {
      } finally {
        onChangeStatus(false)
      }
    })()
  }, [search])

  return (
    <div>
      {users.map((user) => (
        <UserItem {...user} key={user.id} />
      ))}
    </div>
  )
}

export default memo(FriendsOfFriends)

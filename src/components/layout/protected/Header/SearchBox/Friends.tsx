import { memo, useEffect, useState } from 'react'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { getRequest } from '~/services/client/getRequest'

import UserItem, { User } from './UserItem'

function Friends({
  search,
  onChangeStatus
}: {
  search: string
  onChangeStatus: (loading: boolean) => void
}) {
  const [users, setUsers] = useState<User[]>([])
  const { currentUser } = useAppSelector((state: RootState) => state.user)

  useEffect(() => {
    if (!search) return
    ;(async () => {
      onChangeStatus(true)
      try {
        const data: any = await getRequest(`/friend/@${currentUser.username}`, {
          params: {
            limit: 10,
            search
          }
        })

        setUsers(data.friends.map((friend: any) => friend.user))
      } catch (error) {
      } finally {
        onChangeStatus(false)
      }
    })()
  }, [search])

  return (
    <>
      {users.map((user) => (
        <UserItem {...user} key={user.id} />
      ))}
    </>
  )
}

export default memo(Friends)

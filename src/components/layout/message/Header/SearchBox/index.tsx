import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import useDebounce from '~/helper/hooks/useDebounce'
import useClickOutSide from '~/helper/hooks/useClickOutSide'
import { IUser } from '~/helper/type/user'
import { getRequest } from '~/services/client/getRequest'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'

import Input from '~/components/common/Input'
import find from '~/public/icons/find.svg'
import UserItem from './UserItem'

export default function SearchBox() {
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const [value, setValue] = useState('')
  const [users, setUsers] = useState<IUser[]>([])
  const [isShow, setIsShow] = useState(false)
  const debounceValue = useDebounce(value)
  const inputRef = useRef<HTMLDivElement>(null)

  useClickOutSide(
    () => {
      if (isShow) setIsShow(false)
    },
    inputRef,
    [isShow]
  )

  useEffect(() => {
    if (!debounceValue) {
      setUsers([])
      return
    }
    ;(async () => {
      try {
        const data: any = await getRequest(`/friend/@${currentUser.username}`, {
          params: {
            limit: 10,
            search: debounceValue
          }
        })
        setUsers(data.friends.map((friend: any) => friend.user))
      } catch (error) {}
    })()
  }, [debounceValue])

  return (
    <div className="col-span-2 relative">
      <div ref={inputRef} onClick={() => setIsShow(true)}>
        <Input
          value={value}
          name=""
          placeholder="Search..."
          prefix={<Image src={find} alt="search_icon" width={16} height={16} />}
          onChange={(e) =>
            !e.target.value.startsWith(' ') && setValue(e.target.value)
          }
        />
      </div>
      {debounceValue && isShow && (
        <div className="absolute top-full left-0 w-full max-h-[90vh] overflow-y-auto z-30 bg-common-white shadow-lg rounded-md p-2">
          {users.map((user) => (
            <UserItem key={user.id} {...user} />
          ))}
        </div>
      )}
    </div>
  )
}

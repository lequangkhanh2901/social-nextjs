'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'

import { IUser } from '~/helper/type/user'
import { getRequest } from '~/services/client/getRequest'

import Title from '~/components/common/Title'
import Avatar from '~/components/common/Avatar'

interface User extends IUser {
  email: string
  createdAt: string
}

export default function Main() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const data: any = await getRequest('/user/list')
        setUsers(data.users)
      } catch (error) {
        toast.error('Server error')
      }
    })()
  }, [])

  return (
    <div className="m-5 rounded-lg">
      <div className="bg-common-white rounded-lg">
        <Title title="List user" />
      </div>

      <div className="mt-5 bg-common-white p-5 rounded-lg">
        <div className="overflow-x-auto max-w-[calc(80vw-80px)]">
          <div className="rounded-md border min-w-[700px]">
            <div className="whitespace-nowrap grid grid-cols-10 text-lg font-semibold text-center border-b">
              <div className="py-2 col-span-1 border-r">Avatar</div>
              <div className="py-2 col-span-2 border-r">Name</div>
              <div className="py-2 col-span-2 border-r">Username</div>
              <div className="py-2 col-span-3 border-r">Email</div>
              <div className="py-2 col-span-2">Create at</div>
            </div>
            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-10 whitespace-nowrap text-center border-b last:border-b-0"
              >
                <div className="border-r py-2 col-span-1 flex justify-center items-center">
                  <Avatar src={user.avatarId.cdn} width={34} />
                </div>
                <div className="border-r py-2 col-span-2 flex justify-center items-center">
                  {user.name}
                </div>
                <div className="border-r py-2 col-span-2 flex justify-center items-center">
                  @{user.username}
                </div>
                <div className="border-r py-2 col-span-3 flex justify-center items-center">
                  {user.email}
                </div>
                <div className="py-2 col-span-2 flex justify-center items-center">
                  {format(new Date(user.createdAt), 'HH:mm dd/MM/yyyy')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

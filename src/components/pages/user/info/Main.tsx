'use client'

import { RelationWithUser, Sex, Status } from '~/helper/enum/user'

interface User {
  id: string
  name: string
  username: string
  status: Status
  sex: Sex
  avatarId: {
    id: string
    cdn: string
  }
  countFriend: number
  relation?: RelationWithUser
}

interface Props {
  user?: User
  isError?: true
}

export default function Main({ user, isError }: Props) {
  if (isError) {
    return <div>Error</div>
  }

  return (
    user && (
      <div className="max-w-[1000px] mx-auto">
        {/* <Info
          avatar={user.avatarId.cdn}
          countFriend={user.countFriend}
          name={user.name}
          relation={user.relation}
        /> */}
      </div>
    )
  )
}

import Link from 'next/link'
import Avatar from '~/components/common/Avatar'

export interface User {
  id: string
  name: string
  username: string
  avatarId: {
    id: string
    cdn: string
  }
}

export default function UserItem({ username, avatarId }: User) {
  return (
    <Link
      href={`/user/@${username}`}
      className="flex gap-2 items-center rounded hover:bg-common-gray-light px-2 py-1"
    >
      <Avatar src={avatarId.cdn} width={40} />
      <p>{username}</p>
    </Link>
  )
}

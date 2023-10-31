import Image from 'next/image'
import Link from 'next/link'

interface Props {
  user: {
    id: string
    name: string
    username: string
    avatarId: {
      id: string
      cdn: string
    }
  }
}

export default function UserItem({ user }: Props) {
  return (
    <div className="border border-common-gray-light rounded-lg overflow-hidden bg-common-white">
      <Link
        href={`/user/${user.username}`}
        className="relative aspect-square block"
      >
        <Image
          src={user.avatarId.cdn}
          alt={user.name}
          fill
          className="object-cover"
        />
      </Link>
      <div className="p-2">
        <Link
          href={`/user/${user.username}`}
          className="font-bold text-common-gray-dark"
        >
          {user.name}
        </Link>
      </div>
    </div>
  )
}

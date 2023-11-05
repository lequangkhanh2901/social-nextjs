import Image from 'next/image'
import Link from 'next/link'

export interface User {
  id: string
  name: string
  username: string
  avatarId: {
    cdn: string
  }
}

export default function UserItem({ name, username, avatarId }: User) {
  return (
    <div className="border border-common-gray-light rounded-lg overflow-hidden bg-common-white">
      <Link
        href={`/user/@${username}`}
        className="relative aspect-square block"
      >
        <Image src={avatarId.cdn} alt={name} fill className="object-cover" />
      </Link>
      <div className="p-2">
        <Link
          href={`/user/@${username}`}
          className="font-bold text-common-gray-dark"
        >
          {name}
        </Link>
      </div>
    </div>
  )
}

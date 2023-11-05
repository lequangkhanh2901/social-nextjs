import Image from 'next/image'
import Link from 'next/link'

export interface User {
  id: string
  name: string
  username: string
  avatarId: {
    cdn: string
  }
  countSameFriend?: number
}

export default function UserItem({
  name,
  username,
  avatarId,
  countSameFriend
}: User) {
  return (
    <div className="border border-common-gray-light rounded-lg overflow-hidden bg-common-white shadow">
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
        {!!countSameFriend && (
          <p className="text-xs text-common-gray-dark -mt-1">
            {countSameFriend} same friend
          </p>
        )}
      </div>
    </div>
  )
}

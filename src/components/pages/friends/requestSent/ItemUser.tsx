import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'

import { RequestFriendSent } from '~/helper/type/friend'
import { deleteRequest } from '~/services/client/deleteRequest'
import Button from '~/components/common/Button'

interface Props {
  request: RequestFriendSent
  onCanceled: () => void
}

export default function ItemUser({ request, onCanceled }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      await deleteRequest(`/request-friend/${request.user_target.id}`)
      onCanceled()
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-md shadow-[0_1px_1px_#aaaaaaaa] overflow-hidden bg-common-white">
      <Link href={`/user/@${request.user_target.username}`}>
        <Image
          src={request.user_target.avatarId.cdn}
          alt={request.user_target.name}
          width={200}
          height={200}
          className="w-full aspect-square object-cover"
        />
      </Link>
      <div className="p-2">
        <Link
          href={`/user/@${request.user_target.username}`}
          className="text-lg font-bold hover:underline decoration-common-purble"
        >
          {request.user_target.username}
        </Link>
        <p className="text-[13px]">
          Sent at: {format(new Date(request.createdAt), 'HH:mm dd/MM/yyyy')}
        </p>
        <Button
          title="Cancel"
          passClass="w-full"
          loadding={isLoading}
          onClick={handleCancel}
        />
      </div>
    </div>
  )
}

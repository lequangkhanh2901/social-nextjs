import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'

import { RequestFriend } from '~/helper/type/friend'
import { putRequest } from '~/services/client/putRequest'
import Button from '~/components/common/Button'

interface Props {
  request: RequestFriend
  onAccepted: () => void
}

export default function ItemUser({ request, onAccepted }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadindReject] = useState(false)

  const handleAccept = async () => {
    if (isLoading || isLoadindReject) return
    try {
      setIsLoading(true)
      await putRequest(`/request-friend/${request.user.id}`)
      toast.success('Accepted')
      onAccepted()
    } catch (error) {
      toast.error('Server error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-md shadow-[0_1px_1px_#aaaaaaaa] overflow-hidden bg-common-white">
      <Link href={`/user/@${request.user.username}`}>
        <Image
          src={request.user.avatarId.cdn}
          alt={request.user.name}
          width={200}
          height={200}
          className="w-full aspect-square object-cover"
        />
      </Link>
      <div className="p-2">
        <Link
          href={`/user/@${request.user.username}`}
          className="text-lg font-bold hover:underline decoration-common-purble"
        >
          {request.user.username}
        </Link>
        <p className="text-[13px]">
          Sent at: {format(new Date(request.createdAt), 'HH:mm dd/MM/yyyy')}
        </p>
        <Button
          title="Accept"
          passClass="w-full"
          loadding={isLoading}
          onClick={handleAccept}
        />
        <Button
          title="Reject"
          isOutline
          passClass="w-full mt-1"
          loadding={isLoadindReject}
        />
      </div>
    </div>
  )
}

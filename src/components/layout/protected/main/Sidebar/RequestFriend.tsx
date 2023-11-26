'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

import { RequestFriend } from '~/helper/type/friend'
import { getRequest } from '~/services/client/getRequest'
import { putRequest } from '~/services/client/putRequest'

import Button from '~/components/common/Button'
import Avatar from '~/components/common/Avatar'

export default function RequestFriends() {
  const [requests, setRequests] = useState<RequestFriend[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data: any = await getRequest('/request-friend/receive', {
        params: {
          limit: 5
        }
      })

      setRequests(data.requests)
      setTotal(data.meta.count)
    } catch (error) {
      toast.error('Server error')
    }
  }

  const handleAccept = async (userId: string) => {
    if (isLoading) return
    try {
      setIsLoading(true)
      await putRequest(`/request-friend/${userId}`)
      toast.success('Accepted')
      fetchData()
    } catch (error) {
      toast.error('Server error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {requests.length > 0 && (
        <div className="bg-common-white p-4 rounded-md mb-4">
          <h2 className="text-xl font-semibold">Request friends</h2>
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center hover:bg-common-gray-light p-1 rounded cursor-default"
            >
              <Link href={`/user/@${request.user.username}`}>
                <Avatar src={request.user.avatarId.cdn} width={36} />
              </Link>
              <div>
                <Link href={`/user/@${request.user.username}`}>
                  {request.user.name}
                </Link>
                <p className="text-xs">
                  {format(new Date(request.createdAt), 'HH:mm dd/MM/yyyy')}
                </p>
              </div>
              <Button
                title="Accept"
                passClass="ml-auto"
                onClick={() => handleAccept(request.user.id)}
                loadding={isLoading}
              />
            </div>
          ))}
          {requests.length < total && (
            <Link
              href="/friends/requests"
              className="hover:underline block text-right text-sm"
            >
              View all {'>'}
            </Link>
          )}
        </div>
      )}
    </>
  )
}

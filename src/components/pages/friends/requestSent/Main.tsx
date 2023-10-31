'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import { getRequest } from '~/services/client/getRequest'
import { RequestFriendSent } from '~/helper/type/friend'
import ItemUser from './ItemUser'

export default function Main() {
  const [requests, setRequests] = useState<RequestFriendSent[]>([])

  // eslint-disable-next-line
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data: any = await getRequest('/request-friend/sent')

      setRequests(data.requests)
      setTotal(data.meta.total)
    } catch (error) {
      toast.error('Server error')
    }
  }

  return (
    <div>
      <h1 className="p-8 text-2xl font-extrabold">Request friend sent</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-9">
        {requests.map((request) => (
          <ItemUser key={request.id} request={request} onCanceled={fetchData} />
        ))}
      </div>
    </div>
  )
}

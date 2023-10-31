'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import { RequestFriend } from '~/helper/type/friend'
import { getRequest } from '~/services/client/getRequest'
import ItemUser from './ItemUser'

export default function RequestMain() {
  const [requests, setRequests] = useState<RequestFriend[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data = (await getRequest(
        '/request-friend/receive'
      )) as RequestFriend[]
      setRequests(data)
    } catch (error) {
      toast.error('Server error')
    }
  }

  return (
    <div className="">
      <h1 className="p-8 text-2xl font-extrabold">Request friend</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-9">
        {requests.map((request) => (
          <ItemUser key={request.id} request={request} onAccepted={fetchData} />
        ))}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

import { getRequest } from '~/services/client/getRequest'
import useIsInView from '~/helper/hooks/useIsInView'

import Title from '~/components/common/Title'
import UserItem, { User } from '../UserItem'

export default function Main() {
  const [users, setUsers] = useState<{
    same: User[]
    other: User[]
  }>({
    same: [],
    other: []
  })
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [totals, setTotals] = useState({
    same: 0,
    other: 0
  })
  const [pages, setPages] = useState({
    same: 1,
    other: 1
  })
  const [isInitRequest, setIsInitRequest] = useState({
    same: false,
    other: false
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (
        (totals.same === users.same.length &&
          isInitRequest.same &&
          totals.other === users.other.length &&
          isInitRequest.other) ||
        isLoading
      )
        return

      try {
        setIsLoading(true)
        let data: any
        if (totals.same === users.same.length && isInitRequest.same) {
          data = await getRequest('/user/random', {
            params: {
              limit: 10,
              skip: (pages.other - 1) * 10
            }
          })

          setUsers((prev) => ({
            ...prev,
            other: [...prev.other, ...data.users]
          }))
          setTotals((prev) => ({
            ...prev,
            other: data.meta.count
          }))
          setIsInitRequest((prev) => ({
            ...prev,
            other: true
          }))
        } else {
          data = await getRequest('/friend/of-friends', {
            params: {
              limit: 10,
              skip: (pages.same - 1) * 10
            }
          })
          setUsers((prev) => ({
            ...prev,
            same: [...prev.same, ...data.users]
          }))
          setTotals((prev) => ({
            ...prev,
            same: data.meta.count
          }))
          setIsInitRequest((prev) => ({
            ...prev,
            same: true
          }))
        }
      } catch (error) {
        toast.error('Server error')
      } finally {
        setIsLoading(false)
      }
    })()
  }, [pages])

  const isInView = useIsInView(loadMoreRef)

  useEffect(() => {
    if (isInView && !isLoading) {
      if (totals.same === users.same.length && isInitRequest.same) {
        if (isInitRequest.other) {
          setPages((prev) => ({
            ...prev,
            other: prev.other + 1
          }))
        } else {
          setPages((prev) => ({ ...prev }))
        }
      } else {
        setPages((prev) => ({
          ...prev,
          same: prev.same + 1
        }))
      }
    }
  }, [isInView, isInitRequest.same])

  useEffect(() => {
    if (users.same.length === totals.same) {
      setPages((prev) => ({ ...prev }))
    }
  }, [users.same.length])

  return (
    <div>
      <Title title="Suggest friends" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-9">
        {[...users.same, ...users.other].map((user) => (
          <UserItem key={user.id} {...user} />
        ))}
      </div>
      <div
        ref={loadMoreRef}
        className={`mt-5 rounded-md p-5 bg-common-white ${
          isInitRequest.same &&
          isInitRequest.other &&
          totals.same === users.same.length &&
          totals.other === users.other.length
            ? 'hidden'
            : ''
        }`}
      >
        <div className="rounded h-[80px] animate-loading-sk bg-common-gray-light"></div>
      </div>
    </div>
  )
}

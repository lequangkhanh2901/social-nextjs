import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import useClickOutSide from '~/helper/hooks/useClickOutSide'
import usePopup from '~/helper/hooks/usePopup'
import { NotificationType } from '~/helper/enum/notification'
import { IUser } from '~/helper/type/user'
import { getRequest } from '~/services/client/getRequest'
import { putRequest } from '~/services/client/putRequest'
import { deleteRequest } from '~/services/client/deleteRequest'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'

import bell from '~/public/icons/layout/header/bell.svg'
import bellActive from '~/public/icons/layout/header/bell_active.svg'
import ListNotification from './ListNotification'

export interface INotification {
  id: string
  type: NotificationType
  post?: {
    id: string
  }
  userTaget?: IUser
  isRead: boolean
  userIds?: string[]
  usersData?: [IUser]
  createdAt: string
  updatedAt: string
}

export default function Notification() {
  const { isShow, togglePopup, closePopup } = usePopup()
  const notiRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL')
  // eslint-disable-next-line
  const [total, setTotal] = useState(0)
  const [countUnread, setCountUnRead] = useState(0)
  const { socket } = useAppSelector((state: RootState) => state.socket)
  const { currentUser } = useAppSelector((state: RootState) => state.user)

  useEffect(() => {
    socket.on(`notification-${currentUser.id}-new`, handleSocketNewNotification)
    socket.on(
      `notification-${currentUser.id}-update`,
      handleSocketUpdateNotification
    )

    return () => {
      socket.off(
        `notification-${currentUser.id}-new`,
        handleSocketNewNotification
      )
      socket.off(
        `notification-${currentUser.id}-update`,
        handleSocketUpdateNotification
      )
    }
  }, [])

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const data: any = await getRequest('/notification', {
          params: {
            status: filter
          }
        })
        setNotifications(data.notifications)
        setTotal(data.meta.count)
        setCountUnRead(data.meta.countUnread)
      } catch (error) {}
    }
    getNotifications()
  }, [filter])

  useClickOutSide(
    () => {
      if (isShow) closePopup()
    },
    notiRef,
    [isShow]
  )

  const handleSocketNewNotification = async (id: string) => {
    const data: any = await getNotification(id)
    setNotifications((prev) => [data, ...prev])
    setCountUnRead((prev) => prev + 1)
  }

  const handleSocketUpdateNotification = async (id: string) => {
    const data: any = await getNotification(id)

    setNotifications((prev) => {
      prev = prev.filter((notification) => notification.id !== id)
      return [data, ...prev]
    })
    setCountUnRead((prev) => prev + 1)
  }

  const getNotification = async (id: string) => {
    try {
      const data = await getRequest(`/notification/${id}/get`)
      return data
    } catch (error) {}
  }

  const handleRead = async (id: string, mode: 'MANUAL' | 'AUTO') => {
    try {
      await putRequest(`/notification/${id}/read`)
      setNotifications((prev) => {
        const notification = prev.find(
          (_notification) => _notification.id === id
        ) as INotification
        notification.isRead = true
        return [...prev]
      })
      setCountUnRead((prev) => prev - 1)
      if (mode === 'AUTO') closePopup()
    } catch (error) {}
  }

  const handleReadAll = async () => {
    try {
      await putRequest('/notification/read-all')
      setNotifications((prev) =>
        prev.map((notification) => {
          notification.isRead = true
          return notification
        })
      )
      setCountUnRead(0)
    } catch (error) {}
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteRequest(`/notification/${id}/delete`)
      const notification = notifications.find(
        (_notification) => _notification.id === id
      ) as INotification
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      )
      if (!notification.isRead) setCountUnRead((prev) => prev - 1)
    } catch (error) {}
  }

  const handleDeleteAll = async () => {
    try {
      await deleteRequest('/notification/delete-all')
      setNotifications([])
      setCountUnRead(0)
    } catch (error) {}
  }

  return (
    <div
      ref={notiRef}
      className="rounded-full w-10 h-10 bg-common-gray-light hover:bg-common-gray-medium flex justify-center items-center cursor-pointer relative"
      onClick={togglePopup}
    >
      <Image src={isShow ? bellActive : bell} alt="Notification" width={24} />
      {countUnread > 0 && (
        <div className="absolute top-0 right-0 bg-common-danger text-[10px] text-common-white px-1 rounded-full">
          {countUnread > 9 ? '9+' : countUnread}
        </div>
      )}
      {isShow && (
        <ListNotification
          filter={filter}
          notifications={notifications}
          onChangeFilter={(filter) => setFilter(filter)}
          onRead={handleRead}
          onReadAll={handleReadAll}
          onDelete={handleDelete}
          onDeleteAll={handleDeleteAll}
        />
      )}
    </div>
  )
}

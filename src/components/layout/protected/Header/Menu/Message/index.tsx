'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

import usePopup from '~/helper/hooks/usePopup'
import useClickOutSide from '~/helper/hooks/useClickOutSide'
import { IConversation } from '~/helper/type/message'
import { ConversationType, MessageViewSatus } from '~/helper/enum/message'
import { getRequest } from '~/services/client/getRequest'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import socket from '~/untils/socket'

import chat from '~/public/icons/chat.svg'
import chatActive from '~/public/icons/chat_active.svg'
import Conversations from './Conversations'

export default function Message() {
  const { isShow, togglePopup, closePopup } = usePopup()
  const [conversations, setConversations] = useState<IConversation[]>([])
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutSide(
    () => {
      if (isShow) closePopup()
    },
    ref,
    [isShow]
  )

  useEffect(() => {
    getConversations()
    socket.on(`new-conversation-${currentUser.id}`, getConversations)
    return () => {
      socket.off(`new-conversation-${currentUser.id}`, getConversations)
    }
  }, [currentUser])

  const getConversations = async () => {
    try {
      const data: any = await getRequest('/conversation/all')
      setConversations(data.conversations)
    } catch (error) {
      toast.error('Server error')
    }
  }

  const countUnread = useMemo(
    () =>
      conversations.reduce((value, item) => {
        if (
          (item.type === ConversationType.DUAL &&
            item.messages?.viewStatus !== MessageViewSatus.VIEWED &&
            currentUser.id !== item.messages?.userId) ||
          (item.type === ConversationType.GROUP &&
            item.unreadLastUsersId.includes(currentUser.id))
        )
          return value + 1
        return value
      }, 0),
    [conversations]
  )

  return (
    <div
      ref={ref}
      className="flex justify-center items-center bg-common-gray-light hover:bg-common-gray-medium rounded-full h-10 w-10 relative cursor-pointer"
      onClick={togglePopup}
    >
      <Image src={isShow ? chatActive : chat} alt="" width={24} />
      <Conversations
        conversations={conversations}
        isShow={isShow}
        setConversations={setConversations}
      />
      {!!countUnread && (
        <div className="absolute top-0 right-0 text-xs rounded-full bg-common-purble aspect-square w-3 flex items-center justify-center leading-3 text-common-white">
          {countUnread}
        </div>
      )}
    </div>
  )
}

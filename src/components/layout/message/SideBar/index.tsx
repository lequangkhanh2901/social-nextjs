'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { getRequest } from '~/services/client/getRequest'
import { IConversation } from '~/helper/type/message'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import socket from '~/untils/socket'

import Menu from '~/components/common/Menu'
import ConversationItem from './ConversationItem'

export default function SideBar() {
  const [conversations, setConversations] = useState<IConversation[]>([])
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const router = useRouter()

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

  const sortedConversation = useMemo(() => {
    return [...conversations].sort((_c1, _c2) => {
      if (_c1.messages) {
        if (_c2.messages) {
          return (
            new Date(_c2.messages.createdAt).getTime() -
            new Date(_c1.messages.createdAt).getTime()
          )
        } else {
          return (
            new Date(_c2.updatedAt).getTime() -
            new Date(_c1.messages.createdAt).getTime()
          )
        }
      } else {
        if (_c2.messages) {
          return (
            new Date(_c2.messages.createdAt).getTime() -
            new Date(_c1.updatedAt).getTime()
          )
        } else {
          return (
            new Date(_c2.updatedAt).getTime() -
            new Date(_c1.updatedAt).getTime()
          )
        }
      }
    })
  }, [conversations])

  return (
    <aside className="w-1/5 bg-common-white p-3 max-h-[calc(100vh-62px)] overflow-y-auto">
      <div className="flex justify-between items-center pb-2">
        <p>Conversations</p>
        <Menu
          menu={[
            {
              label: 'Create group',
              handle() {
                router.replace('/conversations/create-group')
              }
            }
          ]}
          classNameButton="rounded-full"
          placement={{
            x: 'left'
          }}
          className="right-0"
        />
      </div>
      {sortedConversation.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          id={conversation.id}
          user={conversation.users[0]}
          message={conversation.messages}
          setConversations={setConversations}
          type={conversation.type}
          name={conversation.name}
          avatar={conversation.avatar}
          unreadLastUsersId={conversation.unreadLastUsersId}
        />
      ))}
    </aside>
  )
}

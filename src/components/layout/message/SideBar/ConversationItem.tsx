import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect } from 'react'
import Avatar from '~/components/common/Avatar'
import { ConversationType, MessageViewSatus } from '~/helper/enum/message'
import usePopup from '~/helper/hooks/usePopup'
import { IConversation } from '~/helper/type/message'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { putRequest } from '~/services/client/putRequest'

import Menu from '~/components/common/Menu'

export interface User {
  id: string
  name: string
  username: string
  avatarId: {
    cdn: string
  }
}

interface Props {
  id: string
  user: User
  message?: {
    id: string
    content: string
    viewStatus: MessageViewSatus
    userId: string
  }
  type: ConversationType
  name?: string
  avatar?: {
    cdn: string
  }
  unreadLastUsersId: string[]
  onNewMessage?: () => void
  setConversations: Dispatch<SetStateAction<IConversation[]>>
}

export default function ConversationItem({
  id,
  user,
  message,
  type,
  avatar,
  name,
  unreadLastUsersId,
  // onNewMessage,
  setConversations
}: Props) {
  const { conversationId } = useParams()
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const { socket } = useAppSelector((state: RootState) => state.socket)
  // eslint-disable-next-line
  const { isShow, togglePopup } = usePopup()
  const router = useRouter()

  useEffect(() => {
    socket.on(`message-${id}`, handleSocketNewMessage)
    socket.on(`message-${id}-read`, handleReadMessage)
    socket.on(`message-${id}-read-all`, handleReadMessage)
    socket.on(`conversation-${id}-update`, handleSocketUpdate)

    return () => {
      socket.off(`message-${id}`, handleSocketNewMessage)
      socket.off(`message-${id}-read`, handleReadMessage)
      socket.off(`message-${id}-read-all`, handleReadMessage)
      socket.off(`conversation-${id}-update`, handleSocketUpdate)
    }
  }, [id])

  const handleSocketNewMessage = ({ message: sMessage }: any) => {
    setConversations((prev) => {
      const conversation = prev.find(
        (_conversation) => _conversation.id === id
      ) as IConversation

      conversation.messages = {
        id: sMessage.id,
        content: sMessage.content,
        userId: sMessage.user.id,
        viewStatus: sMessage.viewStatus,
        createdAt: sMessage.createdAt
      }

      return [...prev]
    })

    if (conversationId !== id) {
      ;(async () => {
        try {
          await putRequest(`/message/${sMessage.id}/received`)
        } catch (error) {}
      })()
    }
  }

  const handleReadMessage = () => {
    setConversations((prev) => {
      if (message) {
        const conversation = prev.find((_c) => _c.id === id) as IConversation
        if (conversation.messages)
          conversation.messages.viewStatus = MessageViewSatus.VIEWED
      }
      return [...prev]
    })
  }

  const handleSocketUpdate = (data: any) => {
    setConversations((prev) => {
      const conversation = prev.find(
        (_conversation) => _conversation.id === data.id
      ) as IConversation
      conversation.name = data.name
      ;(conversation.avatar as any).cdn = data.avatar.cdn
      return [...prev]
    })
  }

  return (
    <Link
      href={`/conversations/${id}/messages`}
      replace
      className={`flex items-center gap-3 hover:bg-common-gray-light p-2 rounded relative group ${
        conversationId === id ? 'bg-common-gray-light' : ''
      }`}
    >
      <Avatar
        alt={user.name}
        src={type === ConversationType.GROUP ? avatar?.cdn : user.avatarId.cdn}
        width={36}
      />
      <div>
        <p>{type === ConversationType.GROUP ? name : user.name}</p>
        <p className="text-txt-primary line-clamp-1 text-sm leading-4">
          {!!message &&
            (currentUser.id === message?.userId
              ? `You: ${message.content || `sent a message`}`
              : message?.content || `${user.name} sent a message`)}
        </p>
      </div>
      {((type === ConversationType.DUAL &&
        message?.viewStatus !== MessageViewSatus.VIEWED &&
        currentUser.id !== message?.userId) ||
        (type === ConversationType.GROUP &&
          unreadLastUsersId.includes(currentUser.id))) && (
        <div className="absolute top-1/2 right-2 -translate-y-1/2 w-2 aspect-square rounded-full bg-common-purble"></div>
      )}

      <div
        className="absolute top-1/2 -translate-y-1/2 right-2  hidden group-hover:block"
        onClick={(e) => {
          e.preventDefault()
          togglePopup()
        }}
      >
        <Menu
          menu={[
            {
              label: 'View profile',
              handle() {
                router.push(`/user/@${user.username}`)
              }
            }
          ]}
          placement={{
            x: 'left'
          }}
          className="right-0"
        />
      </div>
    </Link>
  )
}

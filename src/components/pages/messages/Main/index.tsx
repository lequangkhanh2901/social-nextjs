'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useChatScroll, useDataLoader } from 'use-chat-scroll'

import { getRequest } from '~/services/client/getRequest'
import { RootState } from '~/redux/store'
import { useAppSelector } from '~/redux/hooks'
import { MessageViewSatus } from '~/helper/enum/message'
import useIsInView from '~/helper/hooks/useIsInView'
import { putRequest } from '~/services/client/putRequest'

import MessageItem, { Message } from '../MessageItem'
import ChatBox from '../ChatBox'
import ConversationInfo from '../ConversationInfo'

const loadAdditionalData = () => []

export default function Main() {
  const { conversationId } = useParams()
  const { socket } = useAppSelector((state: RootState) => state.socket)
  const { currentUser } = useAppSelector((state: RootState) => state.user)

  const [messages, setMessages] = useState<Message[]>([])
  const [isInit, setIsInit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loader = useDataLoader(loadAdditionalData, messages, setMessages)
  useChatScroll(boxRef as any, messages, loader)

  useEffect(() => {
    socket.on(`message-${conversationId}`, handleSocketNewMessage)
    socket.on(`message-${conversationId}-read`, handleReadMessage)
    socket.on(`message-${conversationId}-received`, handleSocketReceivedMessage)
    socket.on(`message-${conversationId}-read-all`, handleSocketReadAll)

    return () => {
      setIsInit(false)
      setPage(1)
      setMessages([])
      socket.off(`message-${conversationId}`, handleSocketNewMessage)
      socket.off(`message-${conversationId}-read`, handleReadMessage)
      socket.off(
        `message-${conversationId}-received`,
        handleSocketReceivedMessage
      )
      socket.off(`message-${conversationId}-read-all`, handleSocketReadAll)
    }
  }, [conversationId])

  useEffect(() => {
    ;(async () => {
      if (loading && isInit) {
        return
      }
      try {
        setLoading(true)
        const data: any = await getRequest(
          `/message/${conversationId}/messages`,
          {
            params: {
              limit: 20,
              skip: messages.length
            }
          }
        )
        setMessages((prev) => [...prev, ...data.messages])

        setTotal(data.meta.count)
        setTimeout(() => {
          setIsInit(true)
        }, 100)
      } catch (error) {
        toast.error('Server error')
      } finally {
        setLoading(false)
      }
    })()
  }, [conversationId, page])

  useEffect(() => {
    if (
      isInit &&
      messages.some(
        (message) =>
          message.user.id !== currentUser.id &&
          message.viewStatus !== MessageViewSatus.VIEWED
      )
    ) {
      ;(async () => {
        await putRequest(`/message/${conversationId}/read-all`)
      })()
    }
  }, [conversationId, isInit])

  const sortMessage = useMemo(() => [...messages].reverse(), [messages])

  const isInView = useIsInView(loadMoreRef)

  useEffect(() => {
    if (isInView && !loading && total > messages.length && isInit) {
      setPage((prev) => prev + 1)
    }
  }, [isInView])

  const handleSent = () => {
    //
  }

  const handleSocketNewMessage = ({ message }: any) => {
    setMessages((prev) => [
      {
        content: message.content,
        createdAt: message.createdAt,
        id: message.id,
        medias: message.medias || [],
        status: message.status,
        viewStatus: message.viewStatus,
        user: {
          id: message.user.id,
          name: currentUser.name,
          username: currentUser.username,
          avatarId: {
            cdn: currentUser.avatar,
            id: ''
          }
        }
      },
      ...prev
    ])
    setTotal((prev) => prev + 1)
    ;(async () => {
      try {
        if (message.user.id !== currentUser.id) {
          await putRequest(`/message/${message.id}/read`)
        }
      } catch (error) {}
    })()
  }

  const handleReadMessage = ({ messageId }: { messageId: string }) => {
    setMessages((prev) => {
      const message = prev.find(
        (_message) => _message.id === messageId
      ) as Message

      message.viewStatus = MessageViewSatus.VIEWED
      return [...prev]
    })
  }

  const handleSocketReceivedMessage = ({
    messageId
  }: {
    messageId: string
  }) => {
    setMessages((prev) => {
      ;(
        prev.find((_message) => _message.id === messageId) as Message
      ).viewStatus = MessageViewSatus.RECEIVED
      return [...prev]
    })
  }

  const handleSocketReadAll = () => {
    setMessages((prev) => {
      prev.forEach((_message) => {
        if (_message.viewStatus !== MessageViewSatus.VIEWED) {
          _message.viewStatus = MessageViewSatus.VIEWED
        }
      })
      return [...prev]
    })
  }

  return (
    <div className="max-h-[calc(100vh-62px)] h-[calc(100vh-62px)] overflow-y-auto flex flex-col">
      <ConversationInfo />
      <div
        className="grow overflow-y-auto max-h-[calc(100%-52px)] p-5 pt-0"
        ref={boxRef}
      >
        <div
          ref={loadMoreRef}
          className={`${total > messages.length && isInit ? '' : 'hidden'}`}
        >
          loading...
        </div>
        {sortMessage.map((message) => {
          return <MessageItem key={message.id} {...message} />
        })}
      </div>
      <div>
        <ChatBox onSent={handleSent} />
      </div>
    </div>
  )
}

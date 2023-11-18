'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useChatScroll, useDataLoader } from 'use-chat-scroll'

import { getRequest } from '~/services/client/getRequest'
import { putRequest } from '~/services/client/putRequest'
import { RootState } from '~/redux/store'
import { useAppDispatch, useAppSelector } from '~/redux/hooks'
import { changeCallStatus, updateCall } from '~/redux/call/callSlice'
import { CallStatus, MessageViewSatus } from '~/helper/enum/message'
import useIsInView from '~/helper/hooks/useIsInView'

import Button from '~/components/common/Button'
import Modal from '~/components/common/Modal/Modal'
import CallBox from '../Callbox'
import ChatBox from '../ChatBox'
import ConversationInfo from '../ConversationInfo'
import MessageItem, { Message } from '../MessageItem'

const loadAdditionalData = () => []

export default function Main() {
  const { conversationId } = useParams()
  const router = useRouter()
  const { socket } = useAppSelector((state: RootState) => state.socket)
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const { call } = useAppSelector((state: RootState) => state.call)
  const dispatch = useAppDispatch()

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
    return () => {
      setIsInit(false)
      setPage(1)
      setMessages([])
    }
  }, [conversationId])

  useEffect(() => {
    socket.on(`message-${conversationId}`, handleSocketNewMessage)
    socket.on(`message-${conversationId}-read`, handleReadMessage)
    socket.on(`message-${conversationId}-received`, handleSocketReceivedMessage)
    socket.on(`message-${conversationId}-read-all`, handleSocketReadAll)
    socket.on(`call-${conversationId}`, handleSocketCall)
    socket.on(`want-to-call-${conversationId}`, handleWantToCall)
    socket.on(`user-accepted-${conversationId}`, handleAcceptedCall)

    return () => {
      socket.off(`message-${conversationId}`, handleSocketNewMessage)
      socket.off(`message-${conversationId}-read`, handleReadMessage)
      socket.off(
        `message-${conversationId}-received`,
        handleSocketReceivedMessage
      )
      socket.off(`message-${conversationId}-read-all`, handleSocketReadAll)
      socket.off(`call-${conversationId}`, handleSocketCall)
      socket.off(`want-to-call-${conversationId}`, handleWantToCall)
      socket.on(`user-accepted-${conversationId}`, handleAcceptedCall)
    }
  }, [conversationId, call.status])

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
        if (!isInit) {
          router.replace('/conversations')
        }
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

  const handleSocketCall = (userId: string) => {
    if (currentUser.id !== userId && call.status === CallStatus.NORMAL) {
      // setShowCallConfirm(true)
      dispatch(
        updateCall({
          conversationId: conversationId as string,
          status: CallStatus.NOT_ACCEPT
        })
      )
    }
  }

  const handleAcceptCall = () => {
    socket.emit('accept-call', conversationId)
    dispatch(changeCallStatus(CallStatus.IN_CALL))
  }

  const handleWantToCall = () => {
    if (!call.conversationId && call.status === CallStatus.NORMAL)
      dispatch(
        updateCall({
          conversationId: conversationId as string,
          status: CallStatus.NOT_ACCEPT
        })
      )
  }

  const handleAcceptedCall = () => {
    if (call.status === CallStatus.START_CALL)
      dispatch(
        updateCall({
          conversationId: conversationId as string,
          status: CallStatus.IN_CALL
        })
      )
  }

  return (
    <>
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

      {call.conversationId && (
        <Modal
          isOpen
          onRequestClose={() => {
            //
          }}
        >
          {call.status === CallStatus.NOT_ACCEPT ? (
            <div>
              <Button title="Accept" onClick={handleAcceptCall} />
            </div>
          ) : call.status === CallStatus.IN_CALL ? (
            <CallBox />
          ) : call.status === CallStatus.START_CALL ? (
            <div>
              <p>wating</p>
            </div>
          ) : null}
        </Modal>
      )}
    </>
  )
}

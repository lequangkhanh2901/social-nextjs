'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { useChatScroll, useDataLoader } from 'use-chat-scroll'
import { format } from 'date-fns'

import { getRequest } from '~/services/client/getRequest'
import { putRequest } from '~/services/client/putRequest'
import { RootState } from '~/redux/store'
import { useAppDispatch, useAppSelector } from '~/redux/hooks'
import { changeCallStatus, clearCall, updateCall } from '~/redux/call/callSlice'
import { CallStatus, MessageViewSatus } from '~/helper/enum/message'
import useIsInView from '~/helper/hooks/useIsInView'
import getDaysDiff from '~/helper/logic/getDaysDiff'
import socket from '~/untils/socket'

import Button from '~/components/common/Button'
import Modal from '~/components/common/Modal/Modal'
import loadingIcon from '~/public/icons/loading-dots.svg'
import CallBox from '../Callbox'
import ChatBox from '../ChatBox'
import ConversationInfo from '../ConversationInfo'
import MessageItem, { Message } from '../MessageItem'

const loadAdditionalData = () => []

export default function Main() {
  const { conversationId } = useParams()
  const router = useRouter()
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
    socket.on(`cancel-call-${conversationId}`, handleUserCancelCall)
    socket.on(`not-accept-call-${conversationId}`, handleSocketNotAcceptCall)

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
      socket.off(`user-accepted-${conversationId}`, handleAcceptedCall)
      socket.off(`cancel-call-${conversationId}`, handleUserCancelCall)
      socket.off(`not-accept-call-${conversationId}`, handleSocketNotAcceptCall)
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

  const sortMessage = useMemo(() => {
    const data: { [key: string]: Message[] } = {}

    const messageTmp = [...messages].reverse()
    messageTmp.forEach((message) => {
      const daysDiff = getDaysDiff(new Date(message.createdAt))

      switch (daysDiff) {
        case 0:
          if (data['Today']) {
            data['Today'].push(message)
          } else {
            data['Today'] = [message]
          }
          break

        case 1:
          if (data['Yesterday']) {
            data['Yesterday'].push(message)
          } else {
            data['Yesterday'] = [message]
          }
          break
        default:
          const dateString = format(new Date(message.createdAt), 'dd/MM/yyyy')

          if (data[dateString]) {
            data[dateString].push(message)
          } else {
            data[dateString] = [message]
          }
      }
    })

    return data
  }, [messages])

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

  const handleCancelCall = () => {
    socket.emit('cancel-call', conversationId)
    dispatch(clearCall())
  }

  const handleUserCancelCall = () => {
    // caller cancel

    if (call.status === CallStatus.NOT_ACCEPT) {
      dispatch(clearCall())
    }
  }

  const handleNotAcceptCall = () => {
    socket.emit('not-accept-call', conversationId)
    dispatch(clearCall())
  }

  const handleSocketNotAcceptCall = () => {
    if (call.status === CallStatus.START_CALL) {
      toast.error('User not accept')
      dispatch(clearCall())
    }
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

          {Object.keys(sortMessage).map((key) => (
            <div key={key}>
              <p className="mt-1 underline text-common-gray-dark rounded-t pl-2 text-center bg-common-white">
                {key}
              </p>
              {sortMessage[key].map((message) => (
                <MessageItem key={message.id} {...message} />
              ))}
            </div>
          ))}
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
            <div className="w-[500px] p-5 rounded-md">
              <p className="py-4 text-4xl">Want call to you!!!</p>
              <div className="flex gap-4">
                <Button
                  title="Accept"
                  onClick={handleAcceptCall}
                  passClass="grow"
                />
                <Button
                  title="Reject"
                  onClick={handleNotAcceptCall}
                  isOutline
                  passClass="grow"
                />
              </div>
            </div>
          ) : call.status === CallStatus.IN_CALL ? (
            <CallBox />
          ) : call.status === CallStatus.START_CALL ? (
            <div className="w-[500px] p-5 rounded-md">
              <p className="text-4xl font-bold text-center">Waiting</p>
              <Image
                src={loadingIcon}
                alt="loading"
                width={100}
                className="animate-loading-rolling opacity-50 block mx-auto"
              />
              <Button
                title="Cancel"
                isOutline
                passClass="w-1/2 mx-auto"
                onClick={handleCancelCall}
              />
            </div>
          ) : null}
        </Modal>
      )}
    </>
  )
}

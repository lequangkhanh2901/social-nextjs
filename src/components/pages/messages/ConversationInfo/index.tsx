import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import usePopup from '~/helper/hooks/usePopup'
import { IUser } from '~/helper/type/user'
import {
  CallStatus,
  ConversationRole,
  ConversationStatus,
  ConversationType
} from '~/helper/enum/message'
import { getRequest } from '~/services/client/getRequest'
import { putRequest } from '~/services/client/putRequest'
import { useAppDispatch, useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { startCall } from '~/redux/call/callSlice'
import socket from '~/untils/socket'

import Avatar from '~/components/common/Avatar'
import Drawer from '~/components/common/Drawer'
import Menu, { TMenu } from '~/components/common/Menu'
import Members from '../Members'
import Info from '../Info'
import Media from '../Media'

export interface IConversationInfo {
  id: string
  type: ConversationType
  name?: string
  status: ConversationStatus
  chief?: {
    id: string
  }
  users?: [IUser]
  deputies: {
    id: string
  }[]
  avatar?: {
    cdn: string
  }
  createdAt: string
  unreadLastUsersId: string[]
}

export default function ConversationInfo() {
  const { conversationId } = useParams()
  const router = useRouter()
  const drawerPopup = usePopup()
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const dispatch = useAppDispatch()

  const [conversationInfo, setConversationInfo] =
    useState<IConversationInfo | null>(null)

  const [activeKey, setActiveKey] = useState<
    'INFO' | 'MEMBER' | 'MEDIA' | null
  >(null)

  useEffect(() => {
    const getConversationInfo = async () => {
      try {
        const data: any = await getRequest(
          `/conversation/${conversationId}/info`
        )
        setConversationInfo(data)
      } catch (error) {
        toast.error('Server error')
        router.replace('/conversations')
      }
    }
    getConversationInfo()

    return () => {
      setConversationInfo(null)
    }
  }, [conversationId])

  useEffect(() => {
    ;(async () => {
      if (conversationInfo) {
        try {
          if (conversationInfo.unreadLastUsersId.includes(currentUser.id)) {
            await putRequest(`/conversation/${conversationId}/read-last-group`)
          }
        } catch (error) {}
      }
    })()
  }, [conversationInfo])

  const renderMenu = () => {
    const menu: TMenu = [
      {
        label: 'Media',
        handle() {
          setActiveKey('MEDIA')
          drawerPopup.openPopup()
        }
      }
    ]

    if (conversationInfo?.type === ConversationType.GROUP) {
      menu.push(
        {
          label: 'Chat info',
          handle() {
            setActiveKey('INFO')
            drawerPopup.openPopup()
          }
        },
        {
          label: 'Member',
          handle() {
            setActiveKey('MEMBER')
            drawerPopup.openPopup()
          }
        }
      )
      if (conversationInfo.chief?.id !== currentUser.id) {
        menu.push({
          label: 'Quit chat',
          requireConfirm: true,
          confirmMessage: (
            <>
              Confirm quit{' '}
              <span className="font-bold text-common-purble text-xl">
                {conversationInfo.name}
              </span>
              group
            </>
          ),
          handle: handleQuitGroup
        })
      }
    }

    return menu
  }

  const handleStartCall = () => {
    socket.emit('start-call', {
      conversationId
    })
    dispatch(
      startCall({
        conversationId: conversationId as string,
        status: CallStatus.START_CALL
      })
    )
  }

  const handleUpdatedRole = (userId: string, role: ConversationRole) => {
    setConversationInfo((prev) => {
      if (role === ConversationRole.VICE_CHIEF) {
        prev?.deputies.push({
          id: userId
        })
      } else {
        ;(prev as IConversationInfo).deputies = (
          prev as IConversationInfo
        ).deputies.filter((user) => user.id !== userId)
      }
      return { ...(prev as IConversationInfo) }
    })
  }

  const handleQuitGroup = async () => {
    try {
      await putRequest(`/conversation/${conversationId}/quit-group`)
      router.replace('/conversations')
    } catch (error) {}
  }

  return (
    <>
      <div className="bg-common-white shadow-lg flex items-center p-2 pr-5">
        {conversationInfo && (
          <>
            <Avatar
              src={
                conversationInfo.type === ConversationType.GROUP
                  ? conversationInfo.avatar?.cdn
                  : (conversationInfo.users as [IUser])[0].avatarId.cdn
              }
              width={40}
            />
            {conversationInfo.type === ConversationType.DUAL ? (
              <Link
                className="text-xl font-semibold pl-2"
                href={`/user/@${
                  (conversationInfo.users as [IUser])[0].username
                }`}
              >
                {(conversationInfo.users as [IUser])[0].name}
              </Link>
            ) : (
              <h2 className="text-xl font-semibold pl-2">
                {conversationInfo.name ||
                  (conversationInfo.users as [IUser])[0].name}
              </h2>
            )}
            <div className="ml-auto flex items-center gap-3">
              {conversationInfo.type === ConversationType.DUAL && (
                <>
                  <button onClick={handleStartCall}>start call</button>
                </>
              )}
              <Menu
                menu={renderMenu()}
                placement={{
                  x: 'left'
                }}
                className="shadow-[0_1px_4px_#00000050] top-0"
              />
            </div>
          </>
        )}
      </div>
      {drawerPopup.isShow && (
        <Drawer
          show={drawerPopup.isShow}
          setShow={drawerPopup.closePopup}
          placement="right"
        >
          {(() => {
            switch (activeKey) {
              case 'MEMBER':
                return (
                  <Members
                    chiefId={conversationInfo?.chief?.id || ''}
                    viceChiefsId={
                      conversationInfo?.deputies.map((user) => user.id) || []
                    }
                    onUpdatedRole={handleUpdatedRole}
                  />
                )
              case 'INFO':
                return (
                  <Info
                    conversation={conversationInfo as IConversationInfo}
                    setConversation={setConversationInfo}
                  />
                )
              case 'MEDIA':
                return <Media />
              default:
                return <div className="max-h-[100vh] overflow-y-auto">a</div>
            }
          })()}
        </Drawer>
      )}
    </>
  )
}

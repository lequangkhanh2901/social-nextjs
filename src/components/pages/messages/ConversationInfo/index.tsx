import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import usePopup from '~/helper/hooks/usePopup'
import { IUser } from '~/helper/type/user'
import { ConversationStatus, ConversationType } from '~/helper/enum/message'
import { getRequest } from '~/services/client/getRequest'

import Avatar from '~/components/common/Avatar'
import Drawer from '~/components/common/Drawer'
import Menu from '~/components/common/Menu'
import Members from '../Members'
import Info from '../Info'

export interface IConversationInfo {
  id: string
  type: ConversationType
  name?: string
  status: ConversationStatus
  chief?: {
    id: string
  }
  users?: [IUser]
  deputies: [
    {
      id: string
    }
  ]
  avatar?: {
    cdn: string
  }
  createdAt: string
}

export default function ConversationInfo() {
  const { conversationId } = useParams()
  const router = useRouter()
  const drawerPopup = usePopup()

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
            <div className="ml-auto">
              <Menu
                menu={[
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
                ]}
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
                return <Members chiefId={conversationInfo?.chief?.id || ''} />
              case 'INFO':
                return (
                  <Info
                    conversation={conversationInfo as IConversationInfo}
                    setConversation={setConversationInfo}
                  />
                )
              default:
                return <div className="max-h-[100vh] overflow-y-auto">a</div>
            }
          })()}
        </Drawer>
      )}
    </>
  )
}

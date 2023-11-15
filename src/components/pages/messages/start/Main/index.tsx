'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

import { RelationWithUser } from '~/helper/enum/user'
import { getUsername } from '~/helper/logic/method'
import { IUser } from '~/helper/type/user'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { getRequest } from '~/services/client/getRequest'

import Avatar from '~/components/common/Avatar'
import ChatBox from '../../ChatBox'

export default function Main() {
  const { username } = useParams()
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    if (currentUser.username === getUsername(username as string))
      router.replace('/conversations')
    ;(async () => {
      try {
        const user: any = await getRequest(`/user/${username}`)
        if (user.relation !== RelationWithUser.FRIEND) {
          router.replace('/conversations')
          return
        }

        const conversationData: any = await getRequest(
          `/conversation/${user.id}/start`
        )

        if (conversationData.conversation) {
          router.replace(
            `/conversations/${conversationData.conversation.id}/messages`
          )

          return
        }

        setUser(user)

        setLoading(false)
      } catch (error) {
        toast.error('Server error')
        router.replace('/conversations')
      }
    })()
  }, [username, currentUser])

  return (
    <div>
      {loading ? (
        ''
      ) : (
        <div className="p-5 max-h-[calc(100vh-62px)] h-[calc(100vh-62px)] overflow-y-auto flex flex-col">
          <div className="grow overflow-y-auto max-h-[calc(100%-52px)] ">
            <div className="mx-auto w-fit">
              <Avatar
                src={user?.avatarId.cdn || ''}
                alt={user?.name || ''}
                width={300}
              />
              <Link
                href={`/user/@${user?.username}`}
                className="text-3xl font-semibold text-center block"
              >
                {user?.name}
              </Link>
            </div>
          </div>
          <div>
            <ChatBox
              onSent={() => {
                //
              }}
              isStart
              targetId={user?.id}
            />
          </div>
        </div>
      )}
    </div>
  )
}

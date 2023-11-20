'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, usePathname, useRouter } from 'next/navigation'

import { RelationWithUser, Sex, Status } from '~/helper/enum/user'
import usePopup from '~/helper/hooks/usePopup'
import { getUsername } from '~/helper/logic/method'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'

import { getRequest } from '~/services/client/getRequest'
import { putRequest } from '~/services/client/putRequest'
import { postRequest } from '~/services/client/postRequest'
import { deleteRequest } from '~/services/client/deleteRequest'

import Avatar from '~/components/common/Avatar'
import Button from '~/components/common/Button'

import requestFriend from '~/public/icons/friend/request_friend.svg'
import friended from '~/public/icons/friend/friended.png'
import edit from '~/public/icons/edit.svg'
import chatActive from '~/public/icons/chat_active.svg'
import Modal from '~/components/common/Modal/Modal'
import Menu from '~/components/common/Menu'
import GrayBackGrondButtom from '~/components/common/Button/GrayBackGround'
import ChangeAvatar from './ChangeAvatar'

interface User {
  id: string
  name: string
  username: string
  status: Status
  sex: Sex
  avatarId: {
    id: string
    cdn: string
  }
  countFriend: number
  relation?: RelationWithUser
  countSameFriend?: number
}

const relationMaping = {
  [RelationWithUser.FRIEND]: {
    label: 'Friended',
    icon: friended
  },
  [RelationWithUser.NONE]: {
    label: 'Add friend',
    icon: requestFriend
  },
  [RelationWithUser.WAITING_ACCEPT_BY_ME]: {
    label: 'Accept',
    icon: friended
  },
  [RelationWithUser.WAITING_ACCEPT_BY_USER]: {
    label: 'Cancel',
    icon: friended
  }
}

export default function Info() {
  const username = getUsername(useParams().username as string)

  const pathname = usePathname()
  const router = useRouter()

  const { currentUser } = useAppSelector((state: RootState) => state.user)

  const [user, setUser] = useState<User>()
  const [isLoading, setIsLoading] = useState(false)
  const { isShow, closePopup, openPopup } = usePopup()
  const [loadingChat, setLoadingChat] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getRequest(`/user/@${username}`)

        setUser(data as User)
      } catch (error) {}
    })()
  }, [username])

  const navs = useMemo(
    () => [
      {
        url: `/user/${username}`,
        label: 'Post'
      },
      {
        url: `/user/${username}/introduce`,
        label: 'Introduce'
      },
      {
        url: `/user/${username}/friends`,
        label: 'Friends'
      },
      {
        url: `/user/${username}/photos`,
        label: 'Photos'
      },
      {
        url: `/user/${username}/videos`,
        label: 'Videos'
      }
    ],
    [username]
  )

  const handleClickAction = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      switch (user?.relation) {
        case RelationWithUser.WAITING_ACCEPT_BY_ME:
          await putRequest(`/request-friend/${user.id}`)
          setUser((prev) => ({
            ...(prev as User),
            relation: RelationWithUser.FRIEND
          }))
          return

        case RelationWithUser.NONE:
          await postRequest(`/request-friend/${user.id}`)
          setUser((prev) => ({
            ...(prev as User),
            relation: RelationWithUser.WAITING_ACCEPT_BY_USER
          }))
          return

        case RelationWithUser.WAITING_ACCEPT_BY_USER:
          await deleteRequest(`/request-friend/${user.id}`)
          setUser((prev) => ({
            ...(prev as User),
            relation: RelationWithUser.NONE
          }))
          return

        default:
          return
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleChatClick = async () => {
    if (loadingChat) return
    try {
      setLoadingChat(true)
      const data: any = await getRequest(`/conversation/${user?.id}/start`)
      if (data.conversation) {
        router.push(`/conversations/${data.conversation.id}/messages`)
      } else if (data.meta?.message === 'NOT_EXIST') {
        router.push(`/conversations/start/@${user?.username}`)
      }
    } catch (error) {
      setLoadingChat(false)
    }
  }

  return (
    <>
      <div className="bg-common-white p-5 rounded-md">
        <div className="h-[400px] bg-common-gray-light"></div>
        <div className="flex px-9 items-end w-full -mt-[100px] ">
          <div className="relative rounded-full group">
            <Avatar
              src={user?.avatarId.cdn}
              width={200}
              className="!border-4 !border-common-white shadow-[0_1px_4px_#00000040]"
            />
            {currentUser.username === getUsername(username) && (
              <div
                className="absolute bottom-[10%] right-[10%] p-2 bg-common-white rounded-full opacity-50 group-hover:opacity-100 cursor-pointer shadow-md"
                onClick={openPopup}
              >
                <Image src={edit} alt="edit" width={20} />
              </div>
            )}
          </div>
          <div>
            <p className="text-4xl font-bold">{user?.name}</p>
            <p className="text-common-gray-dark font-bold ">
              <span>{user?.countFriend} friends</span>
              {!!user?.countSameFriend && (
                <>
                  <span className="px-1">-</span>
                  <span>{user?.countSameFriend} same friend</span>
                </>
              )}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {currentUser.username !== getUsername(username) && user && (
              <>
                <Button
                  title={
                    relationMaping[user?.relation as RelationWithUser]?.label
                  }
                  prefixIcon={friended}
                  prefixClassName="w-4 h-4 object-cover"
                  isOutline={user?.relation === RelationWithUser.FRIEND}
                  onClick={handleClickAction}
                  loadding={isLoading}
                />
                {user.relation === RelationWithUser.FRIEND && (
                  <GrayBackGrondButtom
                    title=""
                    prefixIcon={chatActive}
                    loadding={loadingChat}
                    onClick={handleChatClick}
                  />
                )}
              </>
            )}
            <Menu
              // renderButton={<div>aaab</div>}
              // renderButton="aaa"
              menu={[
                {
                  label: 'a',

                  handle: () => {
                    //
                  },
                  requireConfirm: true,
                  icon: '/icons/bin.svg',
                  subMenu: {
                    menu: [
                      {
                        label: 'sub',
                        handle() {
                          //
                        },
                        requireConfirm: true
                      }
                    ]
                  }
                },
                {
                  label: 'a',

                  handle: () => {
                    //
                  },
                  requireConfirm: true
                }
              ]}
            />
          </div>
        </div>
        <div className="mx-9 flex mt-5 border-t border-common-gray-medium pt-1">
          {navs.map((nav, index) => (
            <Link
              href={nav.url}
              key={index}
              className={`py-3 px-5 duration-100 font-bold text-common-gray-dark text-[15px] ${
                pathname === nav.url
                  ? 'border-b-4 border-common-purble text-common-purble'
                  : 'hover:bg-common-gray-light rounded'
              }`}
            >
              {nav.label}
            </Link>
          ))}
        </div>
      </div>

      <Modal isOpen={isShow} onRequestClose={closePopup}>
        <ChangeAvatar />
      </Modal>
    </>
  )
}

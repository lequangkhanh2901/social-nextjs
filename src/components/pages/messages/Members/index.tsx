import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import usePopup from '~/helper/hooks/usePopup'
import useDebounce from '~/helper/hooks/useDebounce'
import { IUser } from '~/helper/type/user'
import { getRequest } from '~/services/client/getRequest'
import { postRequest } from '~/services/client/postRequest'

import Avatar from '~/components/common/Avatar'
import Button from '~/components/common/Button'
import GrayBackGroundButtom from '~/components/common/Button/GrayBackGround'
import Input from '~/components/common/Input'
import Menu, { TMenu } from '~/components/common/Menu'
import Modal from '~/components/common/Modal/Modal'
import addUser from '~/public/icons/friend/request_friend_active.svg'
import { deleteRequest } from '~/services/client/deleteRequest'
import { toast } from 'react-hot-toast'
import { ConversationRole } from '~/helper/enum/message'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { putRequest } from '~/services/client/putRequest'

interface Props {
  chiefId: string
  viceChiefsId: string[]
  onUpdatedRole: (userId: string, role: ConversationRole) => void
}

export default function Members({
  chiefId,
  viceChiefsId,
  onUpdatedRole
}: Props) {
  const { conversationId } = useParams()
  const { isShow, openPopup, closePopup } = usePopup()
  const router = useRouter()

  const [members, setMembers] = useState<IUser[]>([])
  const [search, setSearch] = useState('')
  const [searchInvite, setSearchInvite] = useState('')
  const [users, setUsers] = useState<IUser[]>([])
  const searchDebounce = useDebounce(search, 500)
  const searchDebounceInvite = useDebounce(searchInvite)
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const { socket } = useAppSelector((state: RootState) => state.socket)

  useEffect(() => {
    getMember()

    socket.on(`quit-conversation-${conversationId}`, handleUserQuit)
    socket.on(`new-member-conversation-${conversationId}`, getMember)

    return () => {
      socket.off(`quit-conversation-${conversationId}`, handleUserQuit)
      socket.off(`new-member-conversation-${conversationId}`, getMember)
    }
  }, [])

  const getMember = async () => {
    try {
      const data: any = await getRequest(
        `/conversation/${conversationId}/members`
      )
      setMembers(data.users)
    } catch (error) {
      toast.error('Server error')
    }
  }

  useEffect(() => {
    getUser()
  }, [searchDebounceInvite])

  const getUser = async () => {
    try {
      const data = await getRequest(
        `/conversation/${conversationId}/find-for-invite`,
        {
          params: {
            name: searchDebounceInvite
          }
        }
      )
      setUsers(data as any)
    } catch (error) {}
  }

  const sortMembers = useMemo(
    () => members.filter((member) => member.name.includes(searchDebounce)),
    [members, searchDebounce]
  )

  const handleAddUser = async (userId: string) => {
    try {
      await postRequest('/conversation/add-user', {
        id: conversationId,
        userId
      })
      getUser()
    } catch (error) {}
  }

  const handleKickUser = async (userId: string) => {
    try {
      await deleteRequest('/conversation/kick-user', {
        id: conversationId,
        userId
      })
    } catch (error) {
      toast.error('Failed')
    }
  }

  const getRole = (userId: string) => {
    if (userId === chiefId) return ConversationRole.CHIEF
    if (viceChiefsId.includes(userId)) return ConversationRole.VICE_CHIEF
    return ConversationRole.MEMBER
  }

  const handleUpdateRole = async (role: ConversationRole, userId: string) => {
    try {
      await putRequest('/conversation/update-role', {
        conversationId,
        userId,
        role
      })

      onUpdatedRole(userId, role)
    } catch (error) {
      toast.error('Update failed')
    }
  }

  const renderMenu = (userId: string): TMenu => {
    const menu: TMenu = []

    if (
      getRole(currentUser.id) === ConversationRole.CHIEF ||
      (getRole(currentUser.id) === ConversationRole.VICE_CHIEF &&
        getRole(userId) === ConversationRole.MEMBER)
    ) {
      menu.push({
        label: 'Kick user',
        handle() {
          handleKickUser(userId)
        }
      })
    }
    if (getRole(currentUser.id) === ConversationRole.CHIEF)
      menu.push({
        label: 'Role',
        subMenu: {
          menu: Object.keys(ConversationRole)
            .filter((role) => role !== ConversationRole.CHIEF)
            .map((role) => ({
              label: role,
              handle: () => {
                if (getRole(userId) !== role)
                  handleUpdateRole(role as ConversationRole, userId)
              },
              className: getRole(userId) === role ? 'bg-common-gray-light' : ''
            })),
          placement: {
            x: 'left'
          },
          className: 'top-0'
        }
      })

    return menu
  }

  const handleUserQuit = (userId: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== userId))
  }

  return (
    <>
      <div className="flex flex-col max-h-screen px-1">
        <h3 className="text-xl font-medium text-center py-2">
          Group chat members
        </h3>
        <div className=" flex items-center gap-2">
          <Input
            name=""
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member..."
            className="grow"
          />
          <GrayBackGroundButtom
            title=""
            prefixIcon={addUser}
            onClick={openPopup}
          />
        </div>
        <div>
          {sortMembers.map((user) => (
            <div key={user.id} className="flex mt-1">
              <Avatar
                src={user.avatarId.cdn}
                width={34}
                className="shrink-0 self-center"
              />
              <div>
                <Link
                  href={`/user/@${user.username}`}
                  className="hover:underline"
                >
                  {user.name}
                </Link>
                {getRole(user.id) === ConversationRole.CHIEF && (
                  <p className="text-xs text-common-gray-dark -mt-2">Chief</p>
                )}
                {getRole(user.id) === ConversationRole.VICE_CHIEF && (
                  <p className="text-xs text-common-gray-dark -mt-2">
                    Vice chief
                  </p>
                )}
              </div>
              {((getRole(currentUser.id) === ConversationRole.CHIEF &&
                getRole(user.id) !== ConversationRole.CHIEF) ||
                (getRole(currentUser.id) === ConversationRole.VICE_CHIEF &&
                  getRole(user.id) === ConversationRole.MEMBER)) && (
                <Menu
                  menu={renderMenu(user.id)}
                  classNameWrapButton="ml-auto"
                  classNameButton="rounded-full"
                  className="right-0"
                  placement={{
                    x: 'left'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isShow} onRequestClose={closePopup}>
        <div className="p-5 rounded-xl max-w-[90vw] w-[300px]">
          <h3 className="text-3xl text-center">Add member</h3>
          <Input
            name=""
            value={searchInvite}
            placeholder="Search user..."
            onChange={(e) => setSearchInvite(e.target.value)}
          />
          <div className="min-h-[100px]">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex gap-2 cursor-pointer hover:bg-common-gray-light rounded p-1"
              >
                <Avatar src={user.avatarId.cdn} width={34} alt={user.name} />
                <div>
                  <p>{user.name}</p>
                </div>
                <Menu
                  menu={[
                    {
                      label: 'Add user to group',
                      handle: () => handleAddUser(user.id)
                    },
                    {
                      label: 'View profile',
                      handle: () => {
                        router.push(`/user/@${user.username}`)
                      }
                    }
                  ]}
                  classNameWrapButton="ml-auto"
                />
              </div>
            ))}
          </div>
          <Button title="Add" passClass="w-full" />
        </div>
      </Modal>
    </>
  )
}

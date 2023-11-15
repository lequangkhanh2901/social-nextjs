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
import Menu from '~/components/common/Menu'
import Modal from '~/components/common/Modal/Modal'
import addUser from '~/public/icons/friend/request_friend_active.svg'

interface Props {
  chiefId: string
}

export default function Members({ chiefId }: Props) {
  const { conversationId } = useParams()
  const { isShow, openPopup, closePopup } = usePopup()
  const router = useRouter()

  const [members, setMembers] = useState<IUser[]>([])
  const [search, setSearch] = useState('')
  const [searchInvite, setSearchInvite] = useState('')
  const [users, setUsers] = useState<IUser[]>([])
  const searchDebounce = useDebounce(search, 500)
  const searchDebounceInvite = useDebounce(searchInvite)

  useEffect(() => {
    ;(async () => {
      const data: any = await getRequest(
        `/conversation/${conversationId}/members`
      )
      setMembers(data.users)
      try {
      } catch (error) {}
    })()
  }, [])

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
            <div key={user.id} className="flex">
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
                {user.id === chiefId && (
                  <p className="text-xs text-common-gray-dark">Chief</p>
                )}
              </div>
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

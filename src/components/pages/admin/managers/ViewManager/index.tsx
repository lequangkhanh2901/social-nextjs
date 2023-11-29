import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import { Status } from '~/helper/enum/user'
import { IUser } from '~/helper/type/user'
import { getRequest } from '~/services/client/getRequest'
import { putRequest } from '~/services/client/putRequest'

import Avatar from '~/components/common/Avatar'
import Modal from '~/components/common/Modal/Modal'
import Switch from '~/components/common/Switch'

interface Props extends IUser {
  onClose: () => void
}

interface Manager {
  id: string
  createdAt: string
  totalHanledReport: number
  status: Status
}

export default function ViewManager({
  id,
  name,
  username,
  avatarId,
  onClose
}: Props) {
  const [manager, setManager] = useState<Manager | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const data: any = await getRequest(`/user/${id}/manager`)
        setManager(data)
      } catch (error) {}
    })()
  }, [])

  const handleUpdateStatus = async (checked: boolean) => {
    if (loading) return
    try {
      setLoading(true)

      await putRequest('/user/manager-status', {
        managerId: id,
        status: checked ? Status.ACTIVE : Status.LOCKED
      })
      setManager((prev) => ({
        ...(prev as Manager),
        status: checked ? Status.ACTIVE : Status.LOCKED
      }))
    } catch (error) {
      toast.error('Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen onRequestClose={onClose}>
      <div className="w-[500px] p-5 rounded-lg">
        <h3 className="text-2xl font-bold text-center">Manager info</h3>
        <div className="flex gap-4 justify-center items-center">
          <Avatar src={avatarId.cdn} width={150} className=" my-5" />
          <div>
            <p className="text-xl font-bold">{name}</p>
            <p className="text-sm text-common-gray-dark">{username}</p>
          </div>
        </div>
        <div className="flex justify-between">
          <p>
            Total report handled:{' '}
            <span className="text-lg font-bold">
              {manager?.totalHanledReport}
            </span>
          </p>
          <div className="flex gap-2 items-center">
            <span>Active: </span>
            <Switch
              onChange={handleUpdateStatus}
              active={manager?.status === Status.ACTIVE}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}

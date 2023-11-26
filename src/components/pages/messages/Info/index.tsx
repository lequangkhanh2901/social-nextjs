import { Dispatch, SetStateAction, useEffect, useId, useState } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

import usePopup from '~/helper/hooks/usePopup'
import { ConversationStatus } from '~/helper/enum/message'
import { putRequest } from '~/services/client/putRequest'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'

import Button from '~/components/common/Button'
import Modal from '~/components/common/Modal/Modal'
import Input from '~/components/common/Input'
import Select from '~/components/common/Select'

import edit from '~/public/icons/edit.svg'
import { IConversationInfo } from '../ConversationInfo'

interface Props {
  chiefId: string
  conversation: IConversationInfo
  setConversation: Dispatch<SetStateAction<IConversationInfo | null>>
}

export default function Info({
  chiefId,
  conversation,
  setConversation
}: Props) {
  const { isShow, openPopup, closePopup } = usePopup()
  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [groupName, setGroupName] = useState(conversation.name as string)
  const [groupStatus, setGroupStatus] = useState(conversation.status)
  const [loading, setLoading] = useState(false)
  const idInputAvatar = useId()
  const { currentUser } = useAppSelector((state: RootState) => state.user)

  useEffect(() => {
    if (avatar) setPreview(URL.createObjectURL(avatar))

    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [avatar])

  const handleUpdate = async () => {
    if (loading) return
    try {
      setLoading(true)
      let body: any
      if (avatar) {
        body = new FormData()

        body.append('id', conversation.id)
        body.append('avatar', avatar)

        if (groupName.trim() !== conversation.name)
          body.append('name', groupName)

        if (groupStatus !== conversation.status)
          body.append('status', groupStatus)
      } else {
        body = { id: conversation.id }
        if (groupName.trim() !== conversation.name) body.name = groupName
        if (groupStatus !== conversation.status) body.status = groupStatus
      }

      const data: any = await putRequest('/conversation/update', body, {
        'Content-Type': avatar ? 'multipart/form-data' : 'application/json'
      })

      setConversation((prev) => ({
        ...(prev as IConversationInfo),
        status: data.status,
        avatar: {
          ...((prev as IConversationInfo).avatar as any),
          cdn: data.avatar.cdn
        },
        name: data.name
      }))

      closePopup()
    } catch (error) {
      toast.error('Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="px-1 max-h-screen flex flex-col">
        <h3 className="text-xl font-medium text-center py-2">
          Chat infomations
        </h3>
        <div className="grow">
          <div className="mx-4 aspect-square relative rounded-full">
            <Image
              src={conversation.avatar?.cdn as string}
              alt={conversation.name as string}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <h2 className="text-3xl font-extrabold text-center">
            {conversation.name}
          </h2>
          <p>Status: {conversation.status}</p>
          <p>
            Created at: {format(new Date(conversation.createdAt), 'dd/MM/yyyy')}
          </p>

          {currentUser.id === chiefId && (
            <Button
              title="Update"
              passClass="w-full mt-5"
              subfixIcon={edit}
              subfixClassName="invert w-6"
              onClick={openPopup}
            />
          )}
        </div>
      </div>
      <Modal isOpen={isShow} onRequestClose={closePopup}>
        <div className="p-5 rounded-lg max-w-[90vw] w-[500px]">
          <label
            htmlFor={idInputAvatar}
            className="rounded-full mx-auto cursor-pointer w-fit block"
          >
            <Image
              src={preview || (conversation.avatar?.cdn as string)}
              alt=""
              width={300}
              height={300}
              className="object-cover aspect-square rounded-full "
            />
            <input
              type="file"
              id={idInputAvatar}
              accept="image/png,image/jpg,image/jpeg"
              className="hidden"
              onChange={(e) => setAvatar((e.target.files as FileList)[0])}
            />
          </label>
          <Input
            name=""
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Select
            currentActiveKey={groupStatus}
            data={Object.keys(ConversationStatus).map((status) => ({
              key: status,
              label: status
            }))}
            onChange={(key) => {
              setGroupStatus(key as ConversationStatus)
            }}
            passClass="w-1/2 text-sm"
          />
          <div className="flex gap-5 mt-4">
            <Button
              title="Update"
              passClass="w-full"
              onClick={handleUpdate}
              loadding={loading}
              disabled={
                !avatar &&
                groupName.trim() === conversation.name &&
                groupStatus === conversation.status
              }
            />
            <Button
              title="Cancel"
              onClick={closePopup}
              isOutline
              passClass="w-full"
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

import { useId, useState } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

import { IUser } from '~/helper/type/user'
import { Media } from '~/helper/type/common'
import { AcceptAction, ReportReason } from '~/helper/enum/report'
import { MediaType } from '~/helper/enum/post'
import usePopup from '~/helper/hooks/usePopup'
import { putRequest } from '~/services/client/putRequest'

import Avatar from '~/components/common/Avatar'
import Tooltip from '~/components/common/Tooltip'
import Modal from '~/components/common/Modal/Modal'
import Video from '~/components/common/Video'
import CheckBox from '~/components/common/CheckBox'
import Button from '~/components/common/Button'
import Input from '~/components/common/Input'

import show from '~/public/icons/show.png'
import tick from '~/public/icons/tick-circle-outline.svg'
import close from '~/public/icons/close.svg'

export interface Report {
  id: string
  reason: ReportReason
  note: string

  createdAt: string
  comment: {
    id: string
    content: string | null
    createdAt: string
    media: Omit<Media, 'createdAt'> | null
  } | null
  post: {
    id: string
    content: string
    createdAt: string
    isOrigin: boolean
    medias: Omit<Media, 'createdAt'>[]
    originPost: {
      id: string
      content: string
      createdAt: string
      medias: Omit<Media, 'createdAt'>[]
      user: IUser
    } | null
  } | null
  user: IUser
  userTarget: IUser
}

interface Props {
  onUpdated: () => void
}

export default function ReportItem({
  id,
  reason,
  note,
  createdAt,
  comment,
  post,
  user,
  userTarget,
  onUpdated
}: Report & Props) {
  const viewId = useId()
  const acceptId = useId()
  const rejectId = useId()

  const viewPopup = usePopup()
  const acceptPopup = usePopup()

  const [actions, setActions] = useState<AcceptAction[]>([])
  const [banTime, setTimeBan] = useState(1)

  const handleReject = async () => {
    try {
      await putRequest(`/report/${id}/reject`)
      toast.success('Rejected')
      onUpdated()
    } catch (error) {
      toast.error('Server error')
    }
  }

  const handleAccept = async () => {
    try {
      await putRequest(`/report/${id}/accept`, {
        actions,
        time: banTime
      })

      toast.success('Handled')
      onUpdated()
      acceptPopup.closePopup()
    } catch (error) {
      toast.error('Server error')
    }
  }

  const handleChangeActions = (action: AcceptAction, checked: boolean) => {
    if (checked) {
      setActions((prev) => [...prev, action])
    } else {
      setActions((prev) => prev.filter((_action) => _action !== action))
    }
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] whitespace-nowrap text-center border-b last:border-b-0">
        <div className="border-r py-2 col-span-1">
          {post ? 'Post' : 'Comment'}
        </div>
        <div className="border-r py-2 col-span-2 flex items-center gap-2">
          <Avatar src={user.avatarId.cdn} width={36} />
          <p className="hover:underline cursor-pointer">{user.name}</p>
        </div>
        <div className="border-r py-2 col-span-2 flex items-center gap-2">
          <Avatar src={userTarget.avatarId.cdn} width={36} />
          <p className="hover:underline cursor-pointer">{userTarget.name}</p>
        </div>
        <div className="border-r py-2 col-span-3 text-sm">{reason}</div>
        <div className="border-r py-2 col-span-2 text-sm whitespace-normal">
          {note}
        </div>
        <div className="col-span-2 flex items-center justify-evenly border-r">
          <button
            className="rounded-full hover:bg-common-gray-light p-1"
            data-tooltip-id={viewId}
            data-tooltip-content="View report"
            onClick={viewPopup.openPopup}
          >
            <Image src={show} alt="show" width={20} height={20} />
          </button>
          <button
            className="p-1 rounded-full hover:bg-[#0f0]"
            data-tooltip-id={acceptId}
            data-tooltip-content="Accept report"
            onClick={acceptPopup.openPopup}
          >
            <Image src={tick} alt="accept" width={20} />
          </button>
          <button
            className="p-1 rounded-full hover:bg-[#f00]"
            data-tooltip-id={rejectId}
            data-tooltip-content="Reject report"
            onClick={handleReject}
          >
            <Image src={close} alt="reject" width={20} />
          </button>
        </div>
        <div className="col-span-2 flex items-center justify-center text-sm">
          {format(new Date(createdAt), 'HH:mm dd/MM/yyyy')}
        </div>
      </div>

      <Tooltip id={viewId} />
      <Tooltip id={acceptId} />
      <Tooltip id={rejectId} />
      {viewPopup.isShow && (
        <Modal isOpen onRequestClose={viewPopup.closePopup}>
          <div className="w-[600px] bg-common-white p-5 rounded-lg">
            {post && (
              <div className="">
                <div className="flex items-center gap-2">
                  <Avatar src={userTarget.avatarId.cdn} width={36} />
                  <div>
                    <p>{user.name}</p>{' '}
                    {!post.isOrigin && <span>shared a post</span>}
                    <p className="text-xs text-txt-gray -mt-1">
                      {format(new Date(post.createdAt), 'HH:mm dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
                <div className="max-h-[80vh] overflow-y-auto">
                  <p>{post.content}</p>
                  {post.isOrigin ? (
                    <div>
                      {post.medias.map((media) =>
                        media.type === MediaType.IMAGE ? (
                          <Image
                            src={media.cdn}
                            alt=""
                            key={media.id}
                            width={500}
                            height={300}
                            className="w-full object-contain"
                          />
                        ) : (
                          <Video src={media.cdn} key={media.id} />
                        )
                      )}
                    </div>
                  ) : post.originPost ? (
                    <div className="ml-3">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={post.originPost.user.avatarId.cdn}
                          width={36}
                        />
                        <div>
                          <p>{post.originPost.user.name}</p>
                          <p className="text-xs text-txt-gray -mt-1">
                            {format(
                              new Date(post.originPost.createdAt),
                              'HH:mm dd/MM/yyyy'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>This post has been deleted</p>
                  )}
                </div>
              </div>
            )}
            {comment && (
              <div>
                <div className="flex items-center gap-2">
                  <Avatar src={userTarget.avatarId.cdn} width={36} />
                  <div>
                    <p>{user.name}</p>{' '}
                    <p className="text-xs text-txt-gray -mt-1">
                      {format(new Date(comment.createdAt), 'HH:mm dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
                <p>{comment.content}</p>
                {comment.media &&
                  (comment.media.type === MediaType.IMAGE ? (
                    <Image
                      src={comment.media.cdn}
                      alt=""
                      width={500}
                      height={300}
                      className="w-full"
                    />
                  ) : (
                    <Video src={comment.media.cdn} />
                  ))}
              </div>
            )}
          </div>
        </Modal>
      )}
      {acceptPopup.isShow && (
        <Modal isOpen onRequestClose={acceptPopup.closePopup}>
          <div className="bg-white p-5 rounded-lg w-[600px]">
            <h2 className="text-2xl font-bold text-center">Handle Report</h2>
            <div className="flex items-center justify-around py-3">
              <CheckBox
                checked={actions.includes(AcceptAction.BAN_USER)}
                label="Ban account"
                onChange={(checked) =>
                  handleChangeActions(AcceptAction.BAN_USER, checked)
                }
              />
              <CheckBox
                checked={actions.includes(AcceptAction.DELETE_ORIGIN)}
                label={`Delete ${post ? 'post' : 'comment'}`}
                onChange={(checked) =>
                  handleChangeActions(AcceptAction.DELETE_ORIGIN, checked)
                }
              />
              <CheckBox
                checked={actions.includes(AcceptAction.WARN_USER)}
                label="Warn user"
                onChange={(checked) =>
                  handleChangeActions(AcceptAction.WARN_USER, checked)
                }
              />
            </div>

            {actions.includes(AcceptAction.BAN_USER) && (
              <Input
                label="Time ban"
                type="number"
                name=""
                value={banTime + ''}
                onChange={(e) => setTimeBan(+e.target.value)}
                subfix={<span>days</span>}
                className="grow"
              />
            )}

            <Button
              title="Confirm"
              passClass="mt-3 w-full"
              onClick={handleAccept}
              disabled={actions.length === 0}
            />
          </div>
        </Modal>
      )}
    </>
  )
}

import { NotificationType } from '~/helper/enum/notification'
import { INotification } from '.'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Avatar from '~/components/common/Avatar'
import { IUser } from '~/helper/type/user'
import { format } from 'date-fns'
import dots from '~/public/icons/dots.svg'
import bin from '~/public/icons/bin.svg'
import tick from '~/public/icons/tick-circle-outline.svg'
import Image from 'next/image'
import usePopup from '~/helper/hooks/usePopup'
import Tooltip from '~/components/common/Tooltip'
import { useId } from 'react'

export default function NotificationItem({
  id,
  type,
  post,
  userTaget,
  usersData,
  userIds,
  isRead,
  updatedAt,
  onRead,
  onDelete
}: INotification & {
  onRead: (id: string, mode: 'MANUAL' | 'AUTO') => void
  onDelete: (id: string) => void
}) {
  const router = useRouter()
  const { isShow, togglePopup, closePopup } = usePopup()
  const deleteId = useId()
  const readId = useId()

  const className =
    'cursor-pointer p-1 pl-3 rounded hover:bg-common-gray-light flex items-center gap-2'

  const handleRender = () => {
    switch (type) {
      case NotificationType.NEW_POST_FROM_FRIEND:
        return (
          <div
            className={className}
            onClick={() => router.push(`/post/${post?.id}`)}
          >
            <Link
              href={`/user/@${userTaget?.username}`}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Avatar src={(userTaget as IUser).avatarId.cdn} width={40} />
            </Link>
            <div>
              <p className="line-clamp-1">
                <Link
                  href={`/user/@${userTaget?.username}`}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="hover:underline font-bold text-common-purble"
                >
                  {userTaget?.name}
                </Link>{' '}
                uploaded a new post
              </p>
              <span className="text-xs text-common-gray-dark -mt-1 block">
                {format(new Date(updatedAt), 'HH:mm')}
              </span>
            </div>
          </div>
        )

      case NotificationType.NEW_REQUEST_FRIEND:
      case NotificationType.USER_ACCEPTED_REQUEST_FRIEND:
        return (
          <div
            className={className}
            onClick={() => router.push(`/user/@${userTaget?.username}`)}
          >
            <Link
              href={`/user/@${userTaget?.username}`}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Avatar src={(userTaget as IUser).avatarId.cdn} width={40} />
            </Link>
            <div>
              <p className="line-clamp-1">
                <Link
                  href={`/user/@${userTaget?.username}`}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="hover:underline font-bold text-common-purble"
                >
                  {userTaget?.name}
                </Link>{' '}
                {type === NotificationType.NEW_REQUEST_FRIEND
                  ? 'want to be your friend'
                  : 'accepted your request friend'}
              </p>
              <span className="text-xs text-common-gray-dark -mt-1 block">
                {format(new Date(updatedAt), 'HH:mm')}
              </span>
            </div>
          </div>
        )

      case NotificationType.LIKE_MY_POST:
      case NotificationType.USER_COMMENTED_MY_POST:
      case NotificationType.LIKE_MY_COMMENT:
        return (
          <div
            onClick={() => router.push(`/post/${post?.id}`)}
            className={className}
          >
            <Link
              href={`/user/@${(usersData as [IUser])[0].username}`}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Avatar src={(usersData as [IUser])[0].avatarId.cdn} width={40} />
            </Link>
            <div>
              <p className="line-clamp-1">
                <Link
                  href={`/user/@${(usersData as [IUser])[0].username}`}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="hover:underline font-bold text-common-purble"
                >
                  {(usersData as [IUser])[0].name}
                </Link>{' '}
                {(userIds as string[]).length > 1 &&
                  `and ${(userIds as string[]).length - 1} people`}{' '}
                {type === NotificationType.LIKE_MY_POST ||
                type === NotificationType.LIKE_MY_COMMENT
                  ? 'liked'
                  : 'commented'}{' '}
                your{' '}
                {type === NotificationType.LIKE_MY_COMMENT
                  ? 'comment in a post'
                  : 'post'}
              </p>
              <span className="text-xs text-common-gray-dark -mt-1 block">
                {format(new Date(updatedAt), 'HH:mm')}
              </span>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <div
        className="relative group"
        onClick={() => onRead(id, 'AUTO')}
        onMouseLeave={closePopup}
      >
        {!isRead && (
          <span className="bg-common-purble block w-2 aspect-square rounded-full absolute top-1/2 left-1 -translate-y-1/2"></span>
        )}
        {handleRender()}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-1/2 -translate-y-1/2 right-2 hidden group-hover:block z-10 h-[26px]"
        >
          <div
            className="p-1 rounded-full hover:bg-common-gray-medium cursor-pointer"
            onClick={togglePopup}
          >
            <Image src={dots} alt="" width={18} />
          </div>
          <div
            className={`flex gap-1 bg-common-white p-1 shadow-md rounded duration-200 absolute top-1/2 -translate-y-1/2 right-full origin-right ${
              isShow ? '' : 'scale-0 invisible'
            }`}
          >
            <div
              className="flex w-7 items-center aspect-square justify-center rounded bg-common-gray-light cursor-pointer"
              data-tooltip-id={deleteId}
              data-tooltip-content={'Delete'}
              onClick={() => onDelete(id)}
            >
              <Image src={bin} alt="" width={16} />
            </div>
            {!isRead && (
              <div
                className="flex w-7 items-center aspect-square justify-center rounded bg-common-gray-light cursor-pointer"
                data-tooltip-id={readId}
                data-tooltip-content={'Mark as read'}
                onClick={() => onRead(id, 'MANUAL')}
              >
                <Image src={tick} alt="" width={16} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Tooltip id={deleteId} />
      <Tooltip id={readId} />
    </>
  )
}

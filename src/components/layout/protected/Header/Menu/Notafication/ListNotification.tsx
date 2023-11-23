import Image from 'next/image'

import { getDictionary } from '~/locales'
import { useLanguageContext } from '~/components/layout/Wrapper'

import Button from '~/components/common/Button'
import dots from '~/public/icons/dots.svg'
import { INotification } from '.'
import NotificationItem from './NotificationItem'
import { useMemo, useRef } from 'react'
import getDaysDiff from '~/helper/logic/getDaysDiff'
import { format } from 'date-fns'
import usePopup from '~/helper/hooks/usePopup'
import useClickOutSide from '~/helper/hooks/useClickOutSide'

interface Props {
  filter: 'ALL' | 'UNREAD'
  notifications: INotification[]
  onChangeFilter: (filter: 'ALL' | 'UNREAD') => void
  onRead: (id: string, mode: 'MANUAL' | 'AUTO') => void
  onReadAll: () => void
  onDelete: (id: string) => void
  onDeleteAll: () => void
}

export default function ListNotification({
  filter,
  notifications,
  onChangeFilter,
  onRead,
  onReadAll,
  onDelete,
  onDeleteAll
}: Props) {
  const { lang } = useLanguageContext()
  const { tCommon } = getDictionary(lang)

  const actionRef = useRef<HTMLButtonElement>(null)
  const { isShow, togglePopup, closePopup } = usePopup()

  useClickOutSide(
    () => {
      if (isShow) closePopup()
    },
    actionRef,
    [isShow]
  )

  const sortedNotifications = useMemo(() => {
    const data: {
      [key: string]: INotification[]
    } = {}

    notifications.forEach((notification) => {
      const daysDiff = getDaysDiff(new Date(notification.updatedAt))

      switch (daysDiff) {
        case 0:
          if (data['Today']) {
            data['Today'].push(notification)
          } else {
            data['Today'] = [notification]
          }
          break

        case 1:
          if (data['Yesterday']) {
            data['Yesterday'].push(notification)
          } else {
            data['Yesterday'] = [notification]
          }
          break
        default:
          const dateString = format(
            new Date(notification.updatedAt),
            'dd/MM/yyyy'
          )

          if (data[dateString]) {
            data[dateString].push(notification)
          } else {
            data[dateString] = [notification]
          }
      }
    })
    return data
  }, [notifications])

  return (
    <div
      className="absolute top-full right-0 translate-y-1 rounded-lg bg-common-white w-[400px] shadow-[1px_1px_8px_#aaaaaa80] p-3 cursor-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center">
        <h3 className="text-lg font-semibold text-txt-primary">
          {tCommon.notification}
        </h3>
        <button
          ref={actionRef}
          className="ml-auto flex items-center justify-center h-8 w-8 rounded-full bg-common-gray-light hover:bg-common-gray-medium relative"
          onClick={togglePopup}
        >
          <Image src={dots} alt="" width={24} />
          {isShow && (
            <div className="absolute top-full right-0 w-[100px] bg-common-white shadow-[1px_2px_3px_#00000080] rounded-md text-sm text-left p-1">
              <div
                className="rounded hover:bg-common-gray-light px-1"
                onClick={onReadAll}
              >
                Read all
              </div>
              <div
                className="rounded hover:bg-common-gray-light px-1 text-common-danger"
                onClick={onDeleteAll}
              >
                Delete all
              </div>
            </div>
          )}
        </button>
      </div>
      <div className="flex gap-1 mt-2">
        <Button
          title={tCommon.all}
          isOutline={filter !== 'ALL'}
          onClick={() => onChangeFilter('ALL')}
        />
        <Button
          title={tCommon.notRead}
          isOutline={filter !== 'UNREAD'}
          onClick={() => onChangeFilter('UNREAD')}
        />
      </div>
      <div>
        {Object.keys(sortedNotifications).map((key) => (
          <div key={key}>
            <p className="mt-1 underline text-common-gray-dark bg-common-gray-light rounded-t pl-2">
              {key}
            </p>
            {sortedNotifications[key].map((notification) => (
              <NotificationItem
                key={notification.id}
                {...notification}
                onRead={onRead}
                onDelete={onDelete}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import requestFriend from '~/public/icons/friend/request_friend.svg'
import requestFriendActive from '~/public/icons/friend/request_friend_active.svg'
import requestFriendSent from '~/public/icons/friend/request_friend_sent.svg'
import requestFriendSentActive from '~/public/icons/friend/request_friend_sent_active.svg'
import friend from '~/public/icons/friend/friend.svg'
import friendActive from '~/public/icons/friend/friend_active.svg'

const dataSideBar = [
  {
    url: '/friends',
    icon: friend,
    activeIcon: friendActive,
    title: 'Friends'
  },
  {
    url: '/friends/requests',
    icon: requestFriend,
    activeIcon: requestFriendActive,
    title: 'Request friend'
  },
  {
    url: '/friends/requests-sent',
    icon: requestFriendSent,
    activeIcon: requestFriendSentActive,
    title: 'Request friend sent'
  }
]

export default function SideBar() {
  const pathname = usePathname()

  return (
    <div className="w-1/4 bg-common-white">
      <h2 className="px-5 text-3xl font-bold text-txt-primary py-3">Friends</h2>
      <div className="px-2">
        {dataSideBar.map((sideBar, index) => (
          <Link
            href={sideBar.url}
            key={index}
            className={`flex items-center gap-3 p-2 rounded-md hover:bg-common-gray-light ${
              pathname === sideBar.url ? 'bg-common-gray-light' : ''
            }`}
          >
            <div className="flex justify-center items-center w-9 h-9 bg-common-gray-medium rounded-full">
              <Image
                src={
                  pathname === sideBar.url ? sideBar.activeIcon : sideBar.icon
                }
                alt=""
                width={28}
                className=""
              />
            </div>
            <p>{sideBar.title}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

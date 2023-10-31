import { ReactNode } from 'react'
import SideBar from '~/components/pages/friends/SideBar'

export default function FriendLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-5 bg-common-gray-light">
      <SideBar />
      <div className="grow min-h-[calc(100vh-58px)]">{children}</div>
    </div>
  )
}

import { ReactNode } from 'react'
import RightSideBar from '~/components/layout/protected/main/RightSideBar'
import Sidebar from '~/components/layout/protected/main/Sidebar'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-4 bg-common-gray-light min-h-[calc(100vh-58px)] gap-[60px] p-4">
      <div className="col-span-1 sticky top-[78px] max-h-[calc(100vh-94px)] overflow-y-auto">
        <Sidebar />
      </div>
      <div className="col-span-2">{children}</div>
      <div className="col-span-1 sticky top-[78px] max-h-[calc(100vh-94px)] overflow-y-auto">
        <RightSideBar />
      </div>
    </div>
  )
}

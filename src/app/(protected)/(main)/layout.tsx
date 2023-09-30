import { ReactNode } from 'react'
import Sidebar from '~/components/layout/protected/main/Sidebar'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-4 bg-common-gray-light min-h-[calc(100vh-58px)] gap-[60px] p-4">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="col-span-2">{children}</div>
      <div className="col-span-1">Other</div>
    </div>
  )
}

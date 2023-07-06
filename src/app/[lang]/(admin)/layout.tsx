import { ReactElement } from 'react'

import { sideBarMenu } from '~/helper/data/layout'

import Header from '~/components/layout/Header'
import SideBar from '~/components/layout/SideBar'

function AdminLayout({ children }: { children: ReactElement }) {
  return (
    <>
      <div className="bg-bg-primary flex duration-300">
        <SideBar menu={sideBarMenu} />
        <div className="grow">
          <Header />

          <div className="p-2 max-w-[1440px] mx-auto">{children}</div>
        </div>
      </div>
    </>
  )
}

export default AdminLayout

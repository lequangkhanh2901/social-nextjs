import { ReactNode } from 'react'
import Info from '~/components/pages/user/info/Info'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-common-gray-light">
      <div className="max-w-[800px] mx-auto ">
        <Info />
        {children}
      </div>
    </div>
  )
}

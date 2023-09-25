import { ReactElement } from 'react'
import Wellcome from '~/components/pages/auth/Wellcome'

function AuthLayout({ children }: { children: ReactElement }) {
  return (
    <div className="flex h-screen tablet:bg-[#eee] flex-col tablet:flex-row">
      <div className="w-full tablet:h-full tablet:w-1/2 py-10 tablet:py-0">
        <Wellcome />
      </div>
      <div className="grow h-full flex items-start tablet:items-center justify-center p-5">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout

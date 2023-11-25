import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { useAppDispatch, useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { clearUser } from '~/redux/user/userSlice'
import { removeCookies } from '~/untils/clientCookie'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/settings/constants'

import Avatar from '~/components/common/Avatar'
import logout from '~/public/icons/layout/header/logout.svg'

export default function Header() {
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = () => {
    removeCookies([ACCESS_TOKEN, REFRESH_TOKEN])
    dispatch(clearUser())
    router.replace('/login')
  }

  return (
    <div className="bg-common-white flex py-2 px-5">
      <div className="ml-auto flex items-center gap-3">
        <Avatar src={currentUser.avatar} width={36} />
        <p>{currentUser.name}</p>
        <button
          className="p-1 hover:bg-common-gray-light rounded-full gap-4"
          onClick={handleLogout}
        >
          <Image src={logout} alt="logout" width={24} />
        </button>
      </div>
    </div>
  )
}

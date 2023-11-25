'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/settings/constants'
import { removeCookies } from '~/untils/clientCookie'
import { clearUser } from '~/redux/user/userSlice'
import { useAppDispatch } from '~/redux/hooks'
import { useThemeContext } from '../Wrapper'

import Logo from '~/components/common/Logo'
import Drawer from '../../common/Drawer'
import logout from '~/public/icons/layout/header/logout.svg'
import moreIcon from '~/public/icons/more.png'

function Header() {
  const [isShowDrawer, setIsShowDrawer] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { theme } = useThemeContext()

  const handleShowDrawer = (e: boolean) => {
    setIsShowDrawer(e)
  }

  const handleLogout = () => {
    removeCookies([ACCESS_TOKEN, REFRESH_TOKEN])
    dispatch(clearUser())
    router.replace('/login')
  }
  return (
    <>
      <header className="h-14 bg-common-white pl-3 miniTablet:pl-10 pr-3 sticky top-0 flex justify-between items-center duration-300 z-10 gap-1">
        <Image
          src={moreIcon}
          alt=""
          width={24}
          height={24}
          className={`miniTablet:hidden p-1 ${
            theme === 'dark' ? 'invert' : ''
          }`}
          onClick={() => setIsShowDrawer(!isShowDrawer)}
        />
        <span></span>
        <Logo className="miniTablet:hidden h-12" />
        <div className="shrink-0 flex gap-2 items-center"></div>
        <button
          className="p-1 hover:bg-common-gray-light rounded-full gap-4"
          onClick={handleLogout}
        >
          <Image src={logout} alt="logout" width={24} />
        </button>
      </header>
      {isShowDrawer && (
        <Drawer show={isShowDrawer} setShow={handleShowDrawer} placement="left">
          <div>text</div>
        </Drawer>
      )}
    </>
  )
}

export default Header

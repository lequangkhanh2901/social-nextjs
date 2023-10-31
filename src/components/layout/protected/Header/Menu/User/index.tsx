import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import useClickOutSide from '~/helper/hooks/useClickOutSide'
import usePopup from '~/helper/hooks/usePopup'
import { useAppDispatch, useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'

import { useLanguageContext } from '~/components/layout/Wrapper'
import { getDictionary } from '~/locales'
import { removeCookies } from '~/untils/clientCookie'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/settings/constants'
import { clearUser } from '~/redux/user/userSlice'

import Avatar from '~/components/common/Avatar'
import logout from '~/public/icons/layout/header/logout.svg'

export default function User() {
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const { lang } = useLanguageContext()
  const { tAuth } = getDictionary(lang)

  const { isShow, closePopup, togglePopup } = usePopup()

  useClickOutSide(
    () => {
      if (isShow) closePopup()
    },
    menuRef,
    [isShow]
  )

  const handleLogin = () => {
    removeCookies([ACCESS_TOKEN, REFRESH_TOKEN])
    dispatch(clearUser())
    router.replace('/login')
  }

  return (
    <div
      className="rounded-full border border-common-gray-light cursor-pointer relative hover:border-common-gray-dark duration-200"
      ref={menuRef}
      onClick={togglePopup}
    >
      <Avatar src={currentUser.avatar} width={40} alt={currentUser.name} />
      {isShow && (
        <div
          className="absolute top-full translate-y-1 right-0 rounded-lg bg-common-white w-[300px] shadow-[1px_1px_8px_#aaaaaa80] p-3"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href={`/user/${currentUser.username}`}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-common-gray-light"
          >
            <Avatar
              src={currentUser.avatar}
              width={36}
              alt={currentUser.name}
            />
            {currentUser.name}
          </Link>
          <div
            className="flex items-center gap-2 p-2 rounded-md hover:bg-common-gray-light mt-1"
            onClick={handleLogin}
          >
            <div className="w-9 h-9 rounded-full bg-common-gray-medium flex items-center justify-center">
              <Image src={logout} alt="Logout" width={24} />
            </div>
            {tAuth.logOut}
          </div>
        </div>
      )}
    </div>
  )
}

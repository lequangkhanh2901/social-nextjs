'use client'

import { ReactElement, useLayoutEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { useAppDispatch, useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { updateUser } from '~/redux/user/userSlice'
import { Role } from '~/helper/enum/user'
import { sideBarMenu } from '~/helper/data/layout'
import { getCookie } from '~/untils/clientCookie'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/settings/constants'
import { getRequest } from '~/services/client/getRequest'

import Header from '~/components/layout/Header'
import SideBar from '~/components/layout/SideBar'

function AdminLayout({ children }: { children: ReactElement }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    ;(async () => {
      if (!getCookie(ACCESS_TOKEN) && !getCookie(REFRESH_TOKEN)) {
        router.replace('/login')
      } else {
        if (!currentUser.id) {
          setIsLoading(true)
          await getMe()
          return
        } else if (currentUser.role !== Role.ADMIN) {
          router.replace('/')
          return
        } else {
          if (!currentUser.actived) {
            router.replace('/user/setup')
          } else {
          }
        }
      }

      setIsLoading(false)
    })()
  }, [currentUser, pathname])

  const getMe = async () => {
    try {
      const data = await getRequest('/user')
      dispatch(updateUser({ ...data }))
    } catch (error: any) {
      toast.error('System error')
    }
  }

  return (
    <>
      {!isLoading && (
        <div className="bg-bg-primary flex duration-300">
          <SideBar menu={sideBarMenu} />
          <div className="grow">
            <Header />

            <div className="max-w-[1440px] mx-auto relative">{children}</div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminLayout

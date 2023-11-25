'use client'

import { ReactNode, useEffect, useLayoutEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { useAppDispatch, useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { clearUser, updateUser } from '~/redux/user/userSlice'
import { getRequest } from '~/services/client/getRequest'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/settings/constants'
import { getCookie, removeCookies } from '~/untils/clientCookie'
import socket from '~/untils/socket'
import { Role } from '~/helper/enum/user'

import LoadingScreen from '~/components/common/LoadingScreen'
import Header from '~/components/layout/protected/Header'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
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
        } else if (currentUser.role === Role.ADMIN) {
          router.replace('/admin/dashboard')
          return
        } else {
          if (!currentUser.actived && pathname !== '/user/setup') {
            router.replace('/user/setup')
            return
          } else {
            if (currentUser.role === Role.MANAGER) {
              router.replace('/manager')
              return
            }
          }
        }
      }
      setIsLoading(false)
    })()
  }, [currentUser, pathname])

  useEffect(() => {
    socket.on(`ban-user-${currentUser.id}`, handleSocketBanAccount)

    return () => {
      socket.off(`ban-user-${currentUser.id}`, handleSocketBanAccount)
    }
  }, [currentUser])

  const getMe = async () => {
    try {
      const data = await getRequest('/user')
      dispatch(updateUser({ ...data }))
    } catch (error: any) {
      toast.error('System error')
    }
  }

  const handleSocketBanAccount = () => {
    toast.error('Your accout has been banned')
    removeCookies([ACCESS_TOKEN, REFRESH_TOKEN])
    dispatch(clearUser())
    router.replace('/login')
  }

  return (
    <div>
      {isLoading ? (
        <LoadingScreen />
      ) : currentUser.id ? (
        <>
          <Header />
          <main className="max-w-[1440px] mx-auto">{children}</main>
        </>
      ) : null}
    </div>
  )
}

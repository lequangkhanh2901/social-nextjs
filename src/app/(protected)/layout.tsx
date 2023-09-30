'use client'

import { ReactNode, useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { useAppDispatch, useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { updateUser } from '~/redux/user/userSlice'
import { getRequest } from '~/services/client/getRequest'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/settings/constants'
import { getCookie } from '~/untils/clientCookie'

import LoadingScreen from '~/components/common/LoadingScreen'
import Header from '~/components/layout/protected/Header'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    ;(async () => {
      if (!getCookie(ACCESS_TOKEN) && !getCookie(REFRESH_TOKEN)) {
        router.replace('/login')
      } else {
        if (!currentUser.id) {
          await getMe()
        } else {
          if (!currentUser.actived) {
            router.replace('/user/setup')
          } else {
          }
        }
      }
      setIsLoading(false)
    })()
  }, [currentUser])

  const getMe = async () => {
    try {
      const data = await getRequest('/user')
      dispatch(updateUser({ ...data }))
    } catch (error: any) {
      toast.error('System error')
    }
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

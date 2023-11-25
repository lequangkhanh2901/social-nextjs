'use client'

import { ReactNode, useLayoutEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { Role } from '~/helper/enum/user'
import { useAppDispatch, useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { updateUser } from '~/redux/user/userSlice'
import { getRequest } from '~/services/client/getRequest'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/settings/constants'
import { getCookie } from '~/untils/clientCookie'

import SideBar from '~/components/layout/manager/SideBar'
import Header from '~/components/layout/manager/Header'

export default function Lauyout({ children }: { children: ReactNode }) {
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
        } else {
          if (!currentUser.actived) {
            router.replace('/user/setup')
          } else {
            if (currentUser.role !== Role.MANAGER) {
              router.replace('/')
              return
            }
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
        <div className="min-h-screen flex">
          <SideBar />
          <div className="grow">
            <Header />
            {children}
          </div>
        </div>
      )}
    </>
  )
}

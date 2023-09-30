'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { getDictionary } from '~/locales'
import { postRequest } from '~/services/client/postRequest'

import LoadingScreen from '~/components/common/LoadingScreen'

import wait from '~/public/images/common/wait.png'
import success from '~/public/images/common/success_lion.png'
import error from '~/public/images/common/error-page.png'
import { useLanguageContext } from '~/components/layout/Wrapper'

export default function ConfirmSignup({ token }: { token: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const router = useRouter()
  const { lang } = useLanguageContext()

  const { tAuth, tCommon } = getDictionary(lang)

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        await postRequest(`/auth/verify/${token}?action=SIGNUP`)
        toast.success(tAuth.confirmSuccess)
        setTimeout(() => {
          router.replace('/user/setup')
        }, 1500)
      } catch (error: any) {
        setIsError(true)
        if (error.response.data.message === 'VERIFIED')
          toast.error(tAuth.verified)
        else toast.error(tCommon.serverError)
      } finally {
        setIsLoading(false)
      }
    }
    verifyAccount()
  }, [])

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div>
        <div>
          <Image
            src={isLoading ? wait : isError ? error : success}
            alt="waiting"
            width={200}
          />
          {!isLoading && (
            <p className="text-lg">
              {isError ? tAuth.confirmFail : tAuth.confirmSuccess}
            </p>
          )}
        </div>
      </div>
    </>
  )
}

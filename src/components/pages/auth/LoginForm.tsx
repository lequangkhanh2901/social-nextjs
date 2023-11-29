'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useFormik } from 'formik'
import { format } from 'date-fns'

import { LOGIN_SCHEMA } from '~/helper/schema/auth'
import usePopup from '~/helper/hooks/usePopup'
import { getDictionary } from '~/locales'
import { postRequest } from '~/services/client/postRequest'
import { setCookie } from '~/untils/clientCookie'
import {
  ACCESS_TOKEN,
  REFRESH_EXPIRE,
  REFRESH_TOKEN
} from '~/settings/constants'

import Button from '~/components/common/Button'
import Input from '~/components/common/Input'
import { useLanguageContext } from '~/components/layout/Wrapper'
import Modal from '~/components/common/Modal/Modal'

export default function LoginForm() {
  const { lang } = useLanguageContext()

  const [isPosting, setIsPosting] = useState(false)
  const [unBantime, setUnBanTime] = useState<string>()
  const { openPopup, isShow, closePopup } = usePopup()

  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: LOGIN_SCHEMA,
    onSubmit: async ({ email, password }) => {
      if (isPosting) return
      try {
        setIsPosting(true)
        const data: any = await postRequest('/auth/login', {
          email,
          password
        })

        toast.success(tAuth.loginSuccess)

        setCookie(REFRESH_TOKEN, data.refresh, {
          expires: REFRESH_EXPIRE
        })
        setCookie(ACCESS_TOKEN, data.access)

        router.replace('/')
      } catch (error: any) {
        setIsPosting(false)
        if (error.response?.data?.statusCode === 404) {
          toast.error(tAuth.wrong)
        } else if (error.response.data.message === 'BANNED_ACCOUT') {
          setUnBanTime(error.response.data.openAt)
          openPopup()
        } else {
          toast.error(tCommon.serverError)
        }
      }
    }
  })

  const { tValidate, tAuth, tCommon } = getDictionary(lang)

  return (
    <>
      <div className="max-w-[500px] w-full text-common-black bg-common-white shadow-[0_2px_12px_#00000099] p-8 rounded-2xl">
        <h1 className="text-3xl">{tAuth.login}</h1>
        <form onSubmit={formik.handleSubmit}>
          <Input
            placeholder="Email"
            name="email"
            type="text"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={
              formik.errors.email &&
              formik.touched.email &&
              (tValidate[formik.errors.email as keyof typeof tValidate] ||
                formik.errors.email)
            }
          />
          <Input
            placeholder={tAuth.password}
            name="password"
            type="password"
            value={formik.values.password}
            error={
              formik.errors.password &&
              formik.touched.password &&
              (tValidate[formik.errors.password as keyof typeof tValidate] ||
                formik.errors.password)
            }
            onChange={formik.handleChange}
          />
          <Button
            title={tAuth.login}
            type="submit"
            passClass="w-full"
            loadding={isPosting}
          />
        </form>
        <div className="mt-3 flex justify-between items-center">
          <Link href="/forgot-password" className="hover:underline">
            {tAuth.forgotPass}?
          </Link>
          <Button title={tAuth.signup} href="/signup" />
        </div>
      </div>
      {isShow && (
        <Modal isOpen={isShow} onRequestClose={closePopup}>
          <div className="w-[300px] p-4">
            <h3 className="text-center text-2xl font-bold text-common-danger">
              Banned Account
            </h3>
            <p className="text-center">
              Your account has been banned because you violated our rules
            </p>
            <p className="mt-3 text-common-gray-dark">
              Your account will be unban at:
            </p>
            <p className="text-3xl font-bold text-center">
              {format(new Date(unBantime as string), 'HH:mm dd/MM/yyyy')}
            </p>
          </div>
        </Modal>
      )}
    </>
  )
}

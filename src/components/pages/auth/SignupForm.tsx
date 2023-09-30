'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { useFormik } from 'formik'

import { SIGNUP_SCHEMA } from '~/helper/schema/auth'
import { getDictionary } from '~/locales'
import { postRequest } from '~/services/client/postRequest'

import Button from '~/components/common/Button'
import Input from '~/components/common/Input'
import Modal from '~/components/common/Modal/Modal'

import succcessImg from '~/public/images/common/success.png'
import { useLanguageContext } from '~/components/layout/Wrapper'

export default function SignupForm() {
  const [isPosting, setIsPosting] = useState(false)
  const [isSuccess, setIssuccess] = useState(false)

  const { lang } = useLanguageContext()
  const { tAuth, tValidate, tCommon } = getDictionary(lang)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: SIGNUP_SCHEMA,
    onSubmit: async ({ email, password }) => {
      if (isPosting) return
      setIsPosting(true)
      try {
        await postRequest('/auth/signup', {
          email,
          password
        })

        setIssuccess(true)
        setIsPosting(false)
      } catch (error: any) {
        if (error.response?.data?.message === 'EXISTED_EMAIL') {
          toast.error(tAuth.existEmail)
        } else {
          toast.error(tCommon.serverError)
        }
        setIsPosting(false)
      }
    }
  })

  return (
    <>
      <div className="max-w-[500px] w-full text-common-black bg-common-white shadow-[0_2px_12px_#00000099] p-8 rounded-2xl">
        <h1 className="text-3xl">{tAuth.signup}</h1>
        <form onSubmit={formik.handleSubmit}>
          <Input
            placeholder="Email"
            name="email"
            type="text"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={
              formik.errors.email &&
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
              (tValidate[formik.errors.password as keyof typeof tValidate] ||
                formik.errors.password)
            }
            onChange={formik.handleChange}
          />
          <Button
            title={tAuth.signup}
            type="submit"
            passClass="w-full"
            loadding={isPosting}
          />
        </form>
        <div className="mt-3 flex justify-between items-center">
          <p>{tAuth.haveAccount}?</p>
          <Button title={tAuth.login} href="/login" />
        </div>
      </div>
      {isSuccess && (
        <Modal
          isOpen
          onRequestClose={() => {
            // no action
          }}
        >
          <div className="p-5 flex">
            <Image
              src={succcessImg}
              alt="Success"
              className="w-1/2 object-contain hidden phone:block"
            />
            <div className="p-5">
              <h3 className="text-3xl">{tAuth.signupSuccess}</h3>
              <p className="mt-3 pb-5">{tAuth.checkYourEmail}!</p>
              <Button
                href="https://mail.google.com/mail/"
                isUrlOutSystem
                title="Email"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

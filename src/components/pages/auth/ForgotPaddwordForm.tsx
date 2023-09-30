'use client'

import { useState } from 'react'
import { useFormik } from 'formik'

import { FORGOT_PASSWORD_SCHEMA } from '~/helper/schema/auth'
import { getDictionary } from '~/locales'

import Input from '~/components/common/Input'
import Button from '~/components/common/Button'
import { useLanguageContext } from '~/components/layout/Wrapper'

export default function ForgotPasswordForm() {
  const [isPosting] = useState(false)

  const { lang } = useLanguageContext()
  const { tAuth, tValidate } = getDictionary(lang)

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: FORGOT_PASSWORD_SCHEMA,
    onSubmit: () => {
      // console.log('SM')
    }
  })

  return (
    <div className="max-w-[500px] w-full text-common-black bg-common-white shadow-[0_2px_12px_#00000099] p-8 rounded-2xl">
      <h1 className="text-3xl">{tAuth.forgotPass}</h1>
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
        <Button
          title={tAuth.confirm}
          type="submit"
          passClass="w-full"
          loadding={isPosting}
        />
      </form>
      <div className="mt-3 flex justify-end items-center">
        <Button title={tAuth.signup} href="/login" />
      </div>
    </div>
  )
}

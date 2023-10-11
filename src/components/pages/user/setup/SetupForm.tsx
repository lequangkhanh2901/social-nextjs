'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useFormik } from 'formik'

import { Sex } from '~/helper/enum/user'
import { useLanguage } from '~/helper/hooks/useLangguage'
import { SETUP_USER_SCHEMA } from '~/helper/schema/user'
import { getDictionary } from '~/locales'
import { putRequest } from '~/services/client/putRequest'
import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'

import Button from '~/components/common/Button'
import Input from '~/components/common/Input'
import Logo from '~/components/common/Logo'
import Radio from '~/components/common/Radio'

import UploadAvatar from './UploadAvatar'

export default function MainSetup() {
  const lang = useLanguage()
  const [isPosting, setIsPosting] = useState(false)
  const [step, setStep] = useState<'info' | 'avatar'>('info')

  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const router = useRouter()
  const { tUser, tAuth, tCommon } = getDictionary(lang)

  useEffect(() => {
    if (currentUser.actived) {
      router.replace('/')
    }
  }, [currentUser])

  const formik = useFormik({
    initialValues: {
      name: currentUser.name,
      username: currentUser.username,
      sex: Sex.OTHER
    },
    validationSchema: SETUP_USER_SCHEMA,
    onSubmit: async ({ name, username, sex }) => {
      if (isPosting) return

      try {
        setIsPosting(true)
        await putRequest('/user', { name, username, sex })
        toast.success(tCommon.success)
        setStep('avatar')
      } catch (error: any) {
        if (error.response.data.message === 'EXISTED_USERNANE')
          toast.error('EXISTED_USERNANE')
        else toast.error(tCommon.serverError)
      }
      setIsPosting(false)
    }
  })

  return (
    <div className="bg-common-gray-light h-screen">
      <Logo className="p-5 bg-common-white w-fit rounded-2xl opacity-70 hover:opacity-100 duration-150" />
      <div className="p-1 rounded-md bg-common-white max-w-[90vw] w-[600px] overflow-hidden flex fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <form
          onSubmit={formik.handleSubmit}
          className={`p-7 w-full shrink-0 relative duration-300 ${
            step === 'avatar' ? 'right-full' : 'right-0'
          }`}
        >
          <h1 className="text-common-black text-3xl text-center">
            Setup accunt
          </h1>
          <Input
            name="name"
            value={formik.values.name}
            placeholder={tUser.name}
            label={tUser.name}
            error={formik.errors.name}
            onChange={formik.handleChange}
          />
          <Input
            name="username"
            value={formik.values.username}
            placeholder={tUser.username}
            label={tUser.username}
            error={
              formik.errors.username &&
              (tCommon[formik.errors.username as keyof typeof tCommon] ||
                formik.errors.username)
            }
            description={tUser.usernameDesc}
            onChange={formik.handleChange}
          />
          <Radio
            listValue={[
              {
                key: Sex.MALE,
                label: tUser.male
              },
              {
                key: Sex.FEMALE,
                label: tUser.female
              },
              {
                key: Sex.OTHER,
                label: tUser.other
              }
            ]}
            currentValue={formik.values.sex}
            onChange={(key) => {
              formik.setFieldValue('sex', key)
            }}
            label="Sex"
          />

          <Button
            title={tAuth.confirm}
            type="submit"
            passClass="w-2/3 mx-auto mt-3"
            loadding={isPosting}
          />
        </form>
        <UploadAvatar
          className={step === 'avatar' ? 'right-full' : 'right-0'}
        />
      </div>
    </div>
  )
}

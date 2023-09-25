import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { useLanguage } from '~/helper/hooks/useLangguage'
import { getDictionary } from '~/locales'

import { useAppDispatch } from '~/redux/hooks'
import { updatePartialUser } from '~/redux/user/userSlice'
import { postRequest } from '~/services/client/postRequest'

import defaultAvatar from '~/public/images/user/user.png'
import Button from '~/components/common/Button'

interface Props {
  className?: string
}

export default function UploadAvatar({ className = '' }: Props) {
  const [avatar, setVartar] = useState<File | null>(null)
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const lang = useLanguage()

  useEffect(() => {
    if (avatar) {
      setPreviewAvatar(URL.createObjectURL(avatar))
    }
    return () => {
      if (previewAvatar) URL.revokeObjectURL(previewAvatar)
    }
  }, [avatar])

  const { tUser, tAuth, tCommon } = getDictionary(lang)

  const handleSubmit = async () => {
    if (!avatar) return
    setLoading(true)
    try {
      const form = new FormData()
      form.append('avatar', avatar)

      const data: any = await postRequest('/user/avatar', form, {
        'Content-Type': 'multipart/form-data'
      })

      dispatch(
        updatePartialUser({
          actived: true,
          avatar: data.avatar
        })
      )
      router.replace('/')
    } catch (error) {
      toast.error(tCommon.serverError)
      setLoading(false)
    }
  }

  return (
    <div className={`w-full shrink-0 p-7 relative duration-300 ${className}`}>
      <h1 className="text-common-black text-3xl text-center">
        {tUser.uploadAvatar}
      </h1>
      <label
        htmlFor="avatar"
        className="relative block p-4 rounded-full aspect-square w-1/2 mt-4 cursor-pointer mx-auto overflow-hidden border-[12px] border-common-gray-light "
      >
        <Image
          src={previewAvatar || defaultAvatar}
          fill
          alt="avatar"
          className="object-cover"
        />
      </label>
      <input
        id="avatar"
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => setVartar(e.target.files ? e.target.files[0] : null)}
      />
      <Button
        title={tAuth.confirm}
        passClass="w-full mt-5"
        disabled={!avatar}
        onClick={handleSubmit}
        loadding={loading}
      />
    </div>
  )
}

import { useEffect, useId, useState } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

import { useAppDispatch, useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import { updatePartialUser } from '~/redux/user/userSlice'
import { putRequest } from '~/services/client/putRequest'

import Button from '~/components/common/Button'

interface Props {
  onUpdated: () => void
}

export default function ChangeAvatar({ onUpdated }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [previewSrc, setPreivewSrc] = useState<string | null>(null)
  const id = useId()

  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (file) {
      const src = URL.createObjectURL(file)
      setPreivewSrc(src)
    }

    return () => {
      if (previewSrc) {
        URL.revokeObjectURL(previewSrc)
      }
    }
  }, [file])

  const handleChange = async () => {
    try {
      const body = new FormData()
      body.append('avatar', file as File)
      const { data }: any = await putRequest('/user/avatar', body, {
        'Content-Type': 'multipart/form-data'
      })
      dispatch(
        updatePartialUser({
          avatar: data.cdn
        })
      )
      onUpdated()
    } catch (error) {
      toast.error('Server error')
    }
  }

  return (
    <div className="p-5 w-[500px] max-w-[90vw]">
      <h2 className="text-center font-bold text-2xl text-common-gray-dark pb-5">
        Change avatar
      </h2>
      <label htmlFor={id} className="cursor-pointer rounded-full">
        <div>
          <Image
            src={previewSrc || currentUser.avatar}
            alt=""
            width={200}
            height={200}
            className="rounded-full object-cover w-[80%] aspect-square max-w-[300px] mx-auto border-[6px] border-common-gray-light"
          />
        </div>
        <input
          className="hidden"
          type="file"
          accept="image/png,image/jpg,image/jpeg"
          id={id}
          onChange={(e) => setFile((e.target.files as FileList)[0])}
        />
      </label>
      <Button
        title="Update"
        disabled={!file}
        passClass="w-full mt-2"
        onClick={handleChange}
      />
    </div>
  )
}

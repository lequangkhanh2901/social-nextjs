import { useEffect, useId, useState } from 'react'
import Image from 'next/image'

import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import Button from '~/components/common/Button'

export default function ChangeAvatar() {
  const [file, setFile] = useState<File | null>(null)
  const [previewSrc, setPreivewSrc] = useState<string | null>(null)
  const id = useId()

  const { currentUser } = useAppSelector((state: RootState) => state.user)

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
      <Button title="Update" disabled={!file} passClass="w-full mt-2" />
    </div>
  )
}

'use client'

import Image from 'next/image'
import { useEffect, useId, useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from '~/components/common/Button'
import Input from '~/components/common/Input'
import close from '~/public/icons/close.svg'
import { postRequest } from '~/services/client/postRequest'

export default function Main() {
  const [name, setName] = useState('')
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const id = useId()

  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }

    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [file])

  const handleCreate = async () => {
    if (!name || !file) return

    try {
      setLoading(true)
      const body = new FormData()
      body.append('name', name)
      body.append('avatar', file)

      await postRequest(`/conversation/create-group`, body, {
        'Content-Type': 'multipart/form-data'
      })
    } catch (error) {
      toast.error('Server error')
    }
  }

  return (
    <div className="max-w-[500px] mx-auto mt-5 bg-common-white rounded-xl p-5">
      <h2 className="text-3xl font-bold text-common-purble text-center pb-5">
        Create Group Chat
      </h2>

      <Input
        name="name"
        value={name}
        onChange={(e) => {
          if (!e.target.value.startsWith(' ')) setName(e.target.value)
        }}
        label="Group name"
        placeholder="My group chat"
      />

      <div className="relative">
        <label htmlFor={id} className="cursor-pointer w-fit">
          <input
            id={id}
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            className="hidden"
            onChange={(e) => setFile((e.target.files as FileList)[0])}
          />
          {preview ? (
            <>
              <Image
                src={preview}
                width={300}
                height={300}
                alt=""
                className="w-[300px] aspect-square object-cover rounded-full mx-auto"
              />
            </>
          ) : (
            <div className="text-center bg-common-gray-light hover:bg-common-gray-medium rounded-lg py-2">
              Add avatar for Group chat
            </div>
          )}
        </label>
        {file && (
          <div
            className="absolute top-4 right-4 p-1 rounded-full bg-common-gray-light hover:bg-common-gray-medium cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              setFile(null)
            }}
          >
            <Image src={close} alt="close" width={18} />
          </div>
        )}
      </div>

      <Button
        title="Create Group"
        passClass="w-full mt-3"
        onClick={handleCreate}
      />
    </div>
  )
}

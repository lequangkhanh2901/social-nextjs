'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

import loading from '~/public/icons/loading.png'

export default function LoadingScreen() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  if (ready) {
    return createPortal(
      <div className="h-screen w-screen fixed inset-0 z-[9999] bg-[#00000010] backdrop-blur-[1px] flex justify-center items-center">
        <Image
          src={loading}
          alt=""
          width={40}
          height={40}
          className="animate-spin"
        />
      </div>,
      document.body
    )
  }
  return null
}

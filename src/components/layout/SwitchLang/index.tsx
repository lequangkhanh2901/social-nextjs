'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { language } from '~/helper/data/common'

function SwitchLang() {
  const router = useRouter()

  const [isShowSelect, setIsShowSelect] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const params = useParams()
  const pathname = usePathname()

  // console.log(params)

  const localeData = language.find((item) => item.key === params.lang)
  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        if (isShowSelect) {
          setIsShowSelect(false)
        }
      } else {
        setIsShowSelect(!isShowSelect)
      }
    }

    window.addEventListener('click', handleClickOutSide)

    return () => {
      window.removeEventListener('click', handleClickOutSide)
    }
  }, [isShowSelect])

  const handleChange = (key: string) => {
    if (key !== params.lang) {
      router.push(pathname.replace(pathname.slice(1, 3), key))
    }
  }

  return (
    <div
      ref={ref}
      className="relative border border-common-black px-2 py-1 rounded select-none cursor-pointer"
    >
      <div className="w-6 text-center">{localeData?.label}</div>
      {isShowSelect && (
        <div className="absolute left-0 top-[calc(100%+2px)] w-full shadow-lg bg-common-white rounded ">
          {language.map((item, index) => (
            <div
              key={index}
              className="px-2 py-1 hover:bg-[#ddd] text-center"
              onClick={() => handleChange(item.key)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SwitchLang

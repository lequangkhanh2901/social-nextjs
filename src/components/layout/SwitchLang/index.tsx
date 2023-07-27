'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { updateSearchParam } from '~/helper/logic/method'
import { DATA_LANG } from '~/settings/constants'
import { dictionaries } from '~/locales'

function SwitchLang() {
  const router = useRouter()

  const [isShowSelect, setIsShowSelect] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const pathname = usePathname()

  const lang = useSearchParams().get('lang') || dictionaries.defaultLocale

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

  useEffect(() => {
    localStorage.setItem(DATA_LANG, lang)
  }, [lang])

  const handleChange = (key: string) => {
    if (key !== lang) {
      const searchParams = updateSearchParam('lang', key)
      router.replace(`${pathname}?${searchParams}`)
    }
  }

  const label = useMemo(() => {
    const index = dictionaries.languages.findIndex((item) => item.key === lang)
    return dictionaries.languages[index].label
  }, [lang])

  return (
    <div
      ref={ref}
      className="relative border border-common-black px-2 py-1 rounded select-none cursor-pointer"
    >
      <div className="w-6 text-center">{label}</div>
      {isShowSelect && (
        <div className="absolute left-0 top-[calc(100%+2px)] w-full shadow-lg bg-common-white rounded ">
          {dictionaries.languages.map((item, index) => (
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

'use client'

import { useMemo, useRef, useState } from 'react'

import { dictionaries } from '~/locales'
import useClickOutSide from '~/helper/hooks/useClickOutSide'
import { useLanguageContext } from '../Wrapper'

function SwitchLang() {
  const [isShowSelect, setIsShowSelect] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { lang, changeLang } = useLanguageContext()

  useClickOutSide(
    () => {
      if (isShowSelect) {
        setIsShowSelect(false)
      }
    },
    ref,
    [isShowSelect]
  )

  const label = useMemo(() => {
    const index = dictionaries.languages.findIndex((item) => item.key === lang)
    return dictionaries.languages[index].label
  }, [lang])

  return (
    <div
      ref={ref}
      className="relative border border-common-black px-2 py-1 rounded select-none cursor-pointer"
      onClick={() => setIsShowSelect(!isShowSelect)}
    >
      <div className="w-6 text-center">{label}</div>
      {isShowSelect && (
        <div className="absolute left-0 top-[calc(100%+2px)] w-full shadow-lg bg-common-white rounded ">
          {dictionaries.languages.map((item, index) => (
            <div
              key={index}
              className="px-2 py-1 hover:bg-[#ddd] text-center"
              onClick={() => changeLang(item.key)}
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

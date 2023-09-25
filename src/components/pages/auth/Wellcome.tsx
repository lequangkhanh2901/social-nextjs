'use client'

import { useLanguage } from '~/helper/hooks/useLangguage'
import { getDictionary } from '~/locales'

export default function Wellcome() {
  const lang = useLanguage()

  const { tCommon } = getDictionary(lang)

  return (
    <div className="h-full bg-common-white flex justify-center items-center flex-col">
      <h1 className="text-[#f06] text-3xl miniTablet:text-5xl font-bold ">
        Le Quang Khanh
      </h1>
      <p className="text-common-black mt-3">{tCommon.wellcome}</p>
    </div>
  )
}

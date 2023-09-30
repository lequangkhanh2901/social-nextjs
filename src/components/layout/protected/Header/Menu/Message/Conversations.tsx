import { useEffect, useState } from 'react'

import { useLanguageContext } from '~/components/layout/Wrapper'
import useDebounce from '~/helper/hooks/useDebounce'
import { getDictionary } from '~/locales'

import Input from '~/components/common/Input'

export default function Conversations() {
  const { lang } = useLanguageContext()
  const { tCommon } = getDictionary(lang)
  const [searchValue, setSearchValue] = useState('')
  const searchValueDebounce = useDebounce(searchValue.trim())

  useEffect(() => {
    //TODO
  }, [searchValueDebounce])

  return (
    <div
      className="absolute top-full right-0 translate-y-1 rounded-lg bg-common-white w-[350px] shadow-[1px_1px_8px_#aaaaaa80] p-3 cursor-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center">
        <h4 className="text-lg font-semibold">{tCommon.message}</h4>
        <div className="ml-auto">some action</div>
      </div>
      <Input
        name=""
        value={searchValue}
        rounded
        placeholder="tim kiem"
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  )
}

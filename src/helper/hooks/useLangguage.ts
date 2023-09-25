import { useLayoutEffect, useState } from 'react'
import { dictionaries } from '~/locales'
import { DATA_LANG } from '~/settings/constants'
import { getCookie, setCookie } from '~/untils/clientCookie'

export const useLanguage = () => {
  const [lang, setLang] = useState(dictionaries.defaultLocale)

  useLayoutEffect(() => {
    const localLang = getCookie(DATA_LANG)
    if (
      localLang &&
      dictionaries.languages.some((language) => language.key === localLang)
    ) {
      setLang(localLang)
    } else {
      setCookie(DATA_LANG, dictionaries.defaultLocale)
    }
  }, [])

  return lang
}

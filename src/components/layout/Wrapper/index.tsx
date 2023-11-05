'use client'

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'

import { GlobalTheme } from '~/helper/enum/common'
import { dictionaries } from '~/locales'
import store from '~/redux/store'
import { useLanguage } from '~/helper/hooks/useLangguage'
import { setCookie } from '~/untils/clientCookie'
import { DATA_LANG, DATA_THEME } from '~/settings/constants'

interface ThemeData {
  theme: GlobalTheme
  changeTheme: (data: GlobalTheme) => void
}

export const ThemeContext = createContext<ThemeData>({
  theme: GlobalTheme.LIGHT,
  changeTheme: () => {
    //
  }
})

export const LangguageContext = createContext<{
  lang: string
  changeLang: (lang: string) => void
}>({
  lang: dictionaries.defaultLocale,
  changeLang: () => {
    //
  }
})

export const useThemeContext = () => useContext(ThemeContext)
export const useLanguageContext = () => useContext(LangguageContext)

export default function WrraperLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<GlobalTheme>(GlobalTheme.LIGHT)
  const [lang, setLang] = useState(useLanguage())

  useEffect(() => {
    const theme = localStorage.getItem(DATA_THEME)
    if (theme && Object.values(GlobalTheme).includes(theme as GlobalTheme)) {
      setTheme(theme as GlobalTheme)
    }
  }, [])

  const changeTheme = (data: GlobalTheme) => {
    localStorage.setItem(DATA_THEME, data)
    setTheme(data)
  }

  const changeLang = (lang: string) => {
    setCookie(DATA_LANG, lang), setLang(lang)
  }

  return (
    <>
      <ThemeContext.Provider value={{ theme, changeTheme }}>
        <LangguageContext.Provider
          value={{
            lang,
            changeLang
          }}
        >
          <div
            id="wrapper-theme"
            data-theme={theme}
            className="bg-common-gray-light"
          >
            <Provider store={store}>{children}</Provider>
          </div>
          <Toaster
            toastOptions={{
              duration: 2000,
              success: {
                style: {
                  backgroundColor: 'green'
                }
              },
              error: {
                style: {
                  backgroundColor: 'red'
                }
              },

              loading: {
                style: {
                  backgroundColor: theme === 'dark' ? '#000' : '#fff',
                  color: theme === 'dark' ? '#fff' : '#000'
                }
              },
              blank: {
                style: {
                  color: '#000'
                }
              },

              style: {
                padding: '1px 8px',
                borderRadius: '9999px',
                color: theme === 'dark' ? '#000' : '#fff'
              }
            }}
          />
        </LangguageContext.Provider>
      </ThemeContext.Provider>
    </>
  )
}

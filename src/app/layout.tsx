'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState
} from 'react'
import { Toaster } from 'react-hot-toast'
import ReactModal from 'react-modal'

import '~/app/style/globals.css'

import { DATA_LANG, DATA_THEME } from '~/settings/constants'
import { GlobalTheme } from '~/helper/enum/common'
import { updateSearchParam } from '~/helper/logic/method'
import { dictionaries } from '~/locales'

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

export const useThemeContext = () => useContext(ThemeContext)

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<GlobalTheme>(GlobalTheme.LIGHT)

  const lang = useSearchParams().get('lang')
  const router = useRouter()
  const pathname = usePathname()

  useLayoutEffect(() => {
    if (!lang || !Object.keys(dictionaries.locales).includes(lang)) {
      const localLang = localStorage.getItem(DATA_LANG)
      const searchParams = updateSearchParam(
        'lang',
        localLang || dictionaries.defaultLocale
      )
      router.replace(`${pathname}?${searchParams}`)
    }
  }, [pathname, lang])

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

  ReactModal.setAppElement('#data-modal')

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <html lang={lang || dictionaries.defaultLocale} data-theme={theme}>
        <body className="text-txt-primary">
          {children}
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
          <div id="data-modal"></div>
        </body>
      </html>
    </ThemeContext.Provider>
  )
}

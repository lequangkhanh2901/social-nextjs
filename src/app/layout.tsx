'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'

import '~/app/style/globals.css'

import { DATA_THEME } from '~/settings/constants'
import { GlobalTheme } from '~/helper/enum/common'
import { dictionaries } from '~/locales'
import store from '~/redux/store'

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

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <html lang={lang || dictionaries.defaultLocale} data-theme={theme}>
        <body className="text-txt-primary">
          <Provider store={store}>{children}</Provider>
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

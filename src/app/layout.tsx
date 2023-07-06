'use client'
import { createContext, useContext, useState } from 'react'
import Modal from 'react-modal'
import { Toaster } from 'react-hot-toast'
import { usePathname } from 'next/navigation'

import '~/app/style/globals.css'

import { GlobalTheme } from '~/helper/enum/common'

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

Modal.setAppElement('#modal-root')

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<GlobalTheme>(GlobalTheme.LIGHT)

  const pathname = usePathname()

  const changeTheme = (data: GlobalTheme) => {
    setTheme(data)
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <html lang={pathname.slice(1, 3) || 'en'} data-theme={theme}>
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
          <div id="modal-root"></div>
        </body>
      </html>
    </ThemeContext.Provider>
  )
}

'use client'

import moreIcon from '~/public/icons/more.png'

import Drawer from '../../common/Drawer'
import ChangeTheme from '../ChangeTheme'
import SwitchLang from '../SwitchLang'
import Image from 'next/image'
import { useState } from 'react'
import Logo from '../Logo'
import { useThemeContext } from '~/app/layout'

function Header() {
  const [isShowDrawer, setIsShowDrawer] = useState(false)

  const { theme } = useThemeContext()

  const handleShowDrawer = (e: boolean) => {
    setIsShowDrawer(e)
  }
  return (
    <>
      <header className="h-14 bg-common-white pl-3 miniTablet:pl-10 pr-3 sticky top-0 flex justify-between items-center duration-300 z-10 gap-1">
        <Image
          src={moreIcon}
          alt=""
          width={24}
          height={24}
          className={`miniTablet:hidden p-1 ${
            theme === 'dark' ? 'invert' : ''
          }`}
          onClick={() => setIsShowDrawer(!isShowDrawer)}
        />
        <span></span>
        <Logo className="miniTablet:hidden h-12" />
        <div className="shrink-0 flex gap-2 items-center">
          <SwitchLang />
          <ChangeTheme />
        </div>
      </header>
      {isShowDrawer && (
        <Drawer
          show={isShowDrawer}
          setShow={handleShowDrawer}
          placement="right"
        >
          <div>text</div>
        </Drawer>
      )}
    </>
  )
}

export default Header

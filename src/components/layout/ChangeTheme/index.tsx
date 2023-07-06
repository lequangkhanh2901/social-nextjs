'use client'

import Image from 'next/image'
import { GlobalTheme } from '~/helper/enum/common'
import { useThemeContext } from '~/app/layout'
import sunIcon from '~/public/icons/sun.png'
import moonIcon from '~/public/icons/moon.png'

function ChangeTheme() {
  const { theme, changeTheme } = useThemeContext()

  const handleChagneTheme = () => {
    if (theme === GlobalTheme.LIGHT) {
      changeTheme(GlobalTheme.DARK)
    } else {
      changeTheme(GlobalTheme.LIGHT)
    }
  }

  return (
    <div onClick={handleChagneTheme} className="cursor-pointer shrink-0">
      {theme === GlobalTheme.LIGHT ? (
        <Image src={moonIcon} alt="" width={24} height={24} />
      ) : (
        <Image src={sunIcon} alt="" width={24} height={24} className="invert" />
      )}
    </div>
  )
}

export default ChangeTheme

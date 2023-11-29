'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

import { SideBarMenu } from '~/helper/type/layout'
import { useThemeContext } from '../Wrapper'

import Logo from '~/components/common/Logo'
import ritghArrowIcon from '~/public/icons/rightArrow.png'

interface SideBarProps {
  menu: SideBarMenu[]
}

function SideBar({ menu }: SideBarProps) {
  const [isCollapse, setIscollapse] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (window.innerWidth > 1140) {
      setIscollapse(false)
    }
  }, [])

  const { theme } = useThemeContext()

  const handleClickMenu = (link: string) => {
    router.replace(link)
  }

  const itemMenuClass = `flex items-center gap-1 px-2 py-3 relative cursor-pointer hover:bg-bg-primary duration-300`
  const labelClass = `${
    isCollapse ? 'hidden' : ''
  } overflow-hidden duration-300`

  return (
    <aside
      className={`${
        isCollapse ? 'w-16' : 'w-[260px]'
      } bg-common-white h-screen sticky z-20 duration-300 top-0 shrink-0 hidden miniTablet:flex flex-col`}
    >
      <Logo
        className={`text-center duration-300 ${
          isCollapse ? 'text-2xl' : 'text-7xl'
        }`}
        href="/admin/dashboard"
      />
      <button
        className={`${
          isCollapse ? '' : 'rotate-180'
        } duration-300 absolute top-3 right-[-30px] w-7 h-7 rounded-full bg-[#00000000] hover:bg-[#88888855] text-lg laptop:flex items-center justify-center hidden `}
        onClick={() => setIscollapse(!isCollapse)}
      >
        <Image
          src={ritghArrowIcon}
          alt=""
          width={12}
          height={12}
          className={`${theme === 'dark' ? 'invert' : ''}`}
        />
      </button>
      <div className="mt-4 px-1 overflow-y-auto h-auto pb-8">
        {menu.map((item) => {
          return (() => {
            if (item.link === '/') {
              if (pathname === '/') {
                return (
                  <div
                    key={item.key}
                    className={`${itemMenuClass} bg-bg-primary`}
                    onClick={() => handleClickMenu(item.link)}
                  >
                    <span className="absolute top-0 left-0 w-1 h-full bg-common-purble"></span>
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={30}
                      height={30}
                      className={`${theme === 'dark' ? 'invert' : ''}`}
                    />
                    <span className={`${labelClass} text-common-purble`}>
                      {item.label}
                    </span>
                  </div>
                )
              } else {
                return (
                  <div
                    key={item.key}
                    className={`${itemMenuClass}`}
                    onClick={() => handleClickMenu(item.link)}
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={30}
                      height={30}
                      className={`${theme === 'dark' ? 'invert' : ''}`}
                    />
                    <span className={labelClass}>{item.label}</span>
                  </div>
                )
              }
            } else {
              if (pathname.startsWith(item.link)) {
                return (
                  <div
                    key={item.key}
                    className={`${itemMenuClass} bg-bg-primary`}
                    onClick={() => handleClickMenu(item.link)}
                  >
                    <span className="absolute top-0 left-0 w-1 h-full bg-common-purble rounded-[3px_1px_1px_3px]"></span>
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={30}
                      height={30}
                      className={`${theme === 'dark' ? 'invert' : ''}`}
                    />
                    <span className={`${labelClass} text-common-purble`}>
                      {item.label}
                    </span>
                  </div>
                )
              } else {
                return (
                  <div
                    key={item.key}
                    className={`${itemMenuClass}`}
                    onClick={() => handleClickMenu(item.link)}
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={30}
                      height={30}
                      className={`${theme === 'dark' ? 'invert' : ''}`}
                    />
                    <span className={labelClass}>{item.label}</span>
                  </div>
                )
              }
            }
          })()
        })}
      </div>
    </aside>
  )
}

export default SideBar

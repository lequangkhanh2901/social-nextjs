import { ReactNode, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

import ritghArrowIcon from '~/public/icons/rightArrow.png'
import { useThemeContext } from '~/app/layout'

interface CollapseProps {
  title: string
  subtitle?: string
  isPrefixIcon?: boolean
  children: ReactNode
  passClass?: string
}

function Collapse({
  title,
  subtitle,
  isPrefixIcon,
  children,
  passClass = ''
}: CollapseProps) {
  const { theme } = useThemeContext()
  const [isShow, setIsShow] = useState(false)

  const contenRef = useRef<HTMLDivElement>(null)

  const contentHeight = useMemo(() => {
    if (contenRef.current) {
      return contenRef.current.offsetHeight
    }
    return 0
  }, [contenRef.current?.offsetHeight])

  return (
    <div
      className={`rounded overflow-hidden border border-[#aaa] ${passClass}`}
    >
      <div
        className="flex items-center px-2 py-1 bg-common-black text-common-white gap-2 select-none cursor-pointer duration-300"
        onClick={() => setIsShow(!isShow)}
      >
        {isPrefixIcon ? (
          <>
            <Image
              src={ritghArrowIcon}
              alt=""
              width={12}
              height={12}
              className={`${theme === 'dark' ? '' : 'invert'} ${
                isShow ? 'rotate-90' : ''
              } duration-300`}
            />
            <div className="grow">
              <h3 className="font-medium">{title}</h3>
              {subtitle && <p className="text-xs">{subtitle}</p>}
            </div>
          </>
        ) : (
          <>
            <div className="grow">
              <h3 className="font-medium">{title}</h3>
              {subtitle && <p className="text-xs">{subtitle}</p>}
            </div>

            <Image
              src={ritghArrowIcon}
              alt=""
              width={12}
              height={12}
              className={`${theme === 'dark' ? '' : 'invert'} ${
                isShow ? 'rotate-90' : 'rotate-180'
              } duration-300`}
            />
          </>
        )}
      </div>
      <div
        className={`duration-300 overflow-hidden`}
        style={{
          height: isShow ? contentHeight : 0
        }}
      >
        <div ref={contenRef} className="px-2 bg-common-white">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Collapse

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

import { useThemeContext } from '~/components/layout/Wrapper'
import ritghArrowIcon from '~/public/icons/rightArrow.png'
import { twMerge } from 'tailwind-merge'

interface Data {
  key: string | number
  label: string | number
}

interface SelectProps {
  data: Data[]
  passClass?: string
  currentActiveKey?: string | number
  isIconPrefix?: boolean
  trigger?: 'hover' | 'click'
  dropDownClassName?: string
  itemClassName?: string
  activeClassName?: string
  onChange: (key: string | number) => void
}

function Select({
  data,
  passClass,
  currentActiveKey,
  isIconPrefix,
  dropDownClassName,
  itemClassName = '',
  activeClassName,
  onChange,
  trigger = 'hover'
}: SelectProps) {
  const [isShow, setIsShow] = useState(false)
  const [listHeigh, setListHeigh] = useState(0)

  const wrapRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const { theme } = useThemeContext()

  const initSelect = useMemo(() => {
    if (!currentActiveKey) {
      return 'Select'
    }

    return data.find((item) => item.key === currentActiveKey)?.label || 'Select'
  }, [currentActiveKey, data])

  useEffect(() => {
    setListHeigh(listRef.current?.offsetHeight || 0)
  }, [])

  useEffect(() => {
    const handleMouseOver = () => {
      setIsShow(true)
    }
    const handleMouseOut = () => {
      setIsShow(false)
    }

    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current?.contains(e.target as Node)) {
        setIsShow(!isShow)
      } else {
        setIsShow(false)
      }
    }

    switch (trigger) {
      case 'click':
        window.addEventListener('click', handleClick)
        break

      default: // hover
        wrapRef.current?.addEventListener('mouseover', handleMouseOver)
        wrapRef.current?.addEventListener('mouseout', handleMouseOut)
        break
    }

    return () => {
      window.removeEventListener('click', handleClick)
      wrapRef.current?.removeEventListener('mouseover', handleMouseOver)
      wrapRef.current?.removeEventListener('mouseout', handleMouseOut)
    }
  }, [isShow, trigger])

  const handleItemClick = (key: string | number) => {
    if (key !== currentActiveKey) {
      switch (trigger) {
        case 'click':
          onChange(key)
          break

        default: // hover
          setIsShow(false)
          onChange(key)
          break
      }
    }
  }

  return (
    <div
      ref={wrapRef}
      className={twMerge(
        'flex gap-2 items-center justify-between px-2 py-1 border rounded text-lg bg-common-white relative cursor-pointer select-none',
        passClass
      )}
    >
      {isIconPrefix ? (
        <>
          <Image
            src={ritghArrowIcon}
            alt=""
            width={12}
            height={12}
            className={`${isShow ? 'rotate-90' : ''} duration-300`}
          />
          <span>{initSelect}</span>
        </>
      ) : (
        <>
          <span>{initSelect}</span>
          <Image
            src={ritghArrowIcon}
            alt=""
            width={12}
            height={12}
            className={`${isShow ? 'rotate-90' : ''}  duration-300 ${
              theme === 'dark' ? 'invert' : ''
            }`}
          />
        </>
      )}

      <div
        className={twMerge(
          'w-full overflow-hidden bg-common-white absolute top-[calc(100%+2px)] left-0 duration-300 z-10 rounded',
          dropDownClassName
        )}
        style={{
          height: isShow ? listHeigh : 0,
          boxShadow: '1px 2px 5px #888'
        }}
      >
        <div ref={listRef} className="py-1">
          {data.map((item, index) => (
            <div
              key={index}
              className={`hover:bg-bg-primary px-2 ${
                currentActiveKey === item.key
                  ? `bg-bg-primary ${activeClassName}`
                  : ''
              } ${itemClassName}`}
              onClick={() => handleItemClick(item.key)}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Select

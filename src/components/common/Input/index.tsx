import { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { useThemeContext } from '~/app/layout'

import hideIcon from '~/public/icons/hide.png'
import showIcon from '~/public/icons/show.png'

interface InputRules {
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
}

interface InputProps {
  type?: 'text' | 'password' | 'number'
  label?: string
  prefix?: JSX.Element | string
  subfix?: JSX.Element | string
  defaultValue?: string
  placeHolder?: string
  passClass?: string
  error?: string
  rules?: InputRules
  disabled?: boolean
  onChange?: (e: any) => void
}

function Input({
  type = 'text',
  label,
  prefix,
  subfix,
  defaultValue = '',
  placeHolder = '',
  passClass = '',
  error,
  rules,
  disabled,
  onChange
}: InputProps) {
  const [value, setValue] = useState(defaultValue)
  const [inputType, setInputType] = useState(type)
  const [errorMessage, setErrorMessage] = useState(error)
  const [errorHeigh, setErrorHeigh] = useState(0)

  const errorRef = useRef<HTMLParagraphElement>(null)

  const id = useId()

  const { theme } = useThemeContext()

  useEffect(() => {
    if (errorRef) {
      setErrorHeigh(errorRef.current?.offsetHeight || 0)
    }
  }, [errorMessage])

  const handleChange = (val: string) => {
    if (!disabled) {
      setValue(val)
      setErrorMessage('')
      if (onChange) {
        onChange(val)
      }
    }
  }

  const handleClickShowPass = () => {
    if (inputType === 'password') {
      setInputType('text')
    } else {
      setInputType('password')
    }
  }

  const handleRules = {
    required: (val: string, boo: boolean) => {
      if (boo && !val) return `${label || 'This field'} is required`
      return ''
    },
    minLength: (val: string, len: number) => {
      if (val.length < len)
        return `${label || 'This field'} is must least ${len} character`
      return ''
    },
    maxLength: (val: string, len: number) => {
      if (val.length > len)
        return `${label || 'This field'} cann't have more than ${len} character`
      return ''
    },
    min: (val: number | string, num: number) => {
      if (Number(val) < num)
        return `${label || 'This field'} is must equal or greater than ${num}`
      return ''
    },
    max: (val: string | number, num: number) => {
      if (Number(val) > num)
        return `${label || 'This field'} is must equal or less than ${num}`
      return ''
    }
  }

  const handleBlur = (val: string) => {
    if (!disabled) {
      if (rules) {
        let result = ''
        for (const key in rules) {
          result = handleRules[key as keyof InputRules](
            val,
            // ignore it, fix in future
            rules[key]
          )
          if (result) {
            setErrorMessage(result)
            break
          }
        }
      }
    }
  }

  return (
    <div
      className={`py-2 ${passClass} ${
        disabled
          ? 'opacity-40 pointer-events-none select-none cursor-not-allowed'
          : ''
      }`}
    >
      {label && (
        <label className="text-sm font-semibold py-2 inline-block" htmlFor={id}>
          {label}
        </label>
      )}
      <div
        className={`flex items-center rounded border ${
          errorMessage ? 'border-common-danger' : ''
        } p-2 bg-common-white gap-2 duration-300`}
      >
        {prefix && <div>{prefix}</div>}
        <input
          type={inputType}
          id={id}
          value={value}
          placeholder={placeHolder}
          className="outline-none text-txt-gray grow text-sm bg-[transparent]"
          onChange={(e) => handleChange(e.target.value)}
          spellCheck="false"
          onBlur={(e) => handleBlur(e.target.value.trim())}
        />
        {type === 'password' && (
          <Image
            src={inputType === 'password' ? showIcon : hideIcon}
            alt=""
            width={18}
            height={18}
            className={`cursor-pointer ${theme === 'dark' ? 'invert' : ''}`}
            onClick={handleClickShowPass}
          />
        )}
        {subfix && <div>{subfix}</div>}
      </div>
      {errorMessage && (
        <div
          className={`duration-300 overflow-hidden`}
          style={{
            height: errorHeigh
          }}
        >
          <p ref={errorRef} className="text-common-danger text-xs pt-1">
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  )
}
export default Input

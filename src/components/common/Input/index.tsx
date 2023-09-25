import {
  HTMLInputTypeAttribute,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState
} from 'react'
import Image from 'next/image'
import { Tooltip } from 'react-tooltip'
import { useThemeContext } from '~/app/layout'

import hideIcon from '~/public/icons/hide.png'
import showIcon from '~/public/icons/show.png'

interface Props {
  name: string
  type?: HTMLInputTypeAttribute
  label?: string
  value: string
  prefix?: ReactNode
  subfix?: ReactNode
  error?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  inputClassName?: string
  description?: string
  onChange?: (e: any) => void
}

export default function Input({
  name,
  type = 'text',
  label,
  value,
  prefix,
  subfix,
  error,
  placeholder,
  disabled,
  className = '',
  inputClassName,
  description,
  onChange
}: Props) {
  const [inputType, setInputType] = useState(type)
  const [errorHeigh, setErrorHeigh] = useState(0)

  const id = useId()
  const { theme } = useThemeContext()

  const errorRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (errorRef) {
      setErrorHeigh(errorRef.current?.offsetHeight || 0)
    }
  }, [error])

  const handleClickShowPass = () => {
    if (inputType === 'password') setInputType('text')
    else setInputType('password')
  }

  return (
    <div
      className={`py-2 ${className} ${
        disabled
          ? 'opacity-40 pointer-events-none select-none cursor-not-allowed'
          : ''
      }`}
    >
      {label && (
        <>
          <label
            className="text-sm font-semibold py-2 inline-block"
            htmlFor={id}
          >
            {label}
          </label>
          {description && (
            <div
              data-tooltip-id={`${name}-tooltip-input`}
              data-tooltip-content={description}
              className=" ml-1 inline-flex justify-center items-center w-3 h-3 text-[10px] cursor-pointer text-common-black bg-common-white rounded-full border border-common-gray-dark"
            >
              ?
            </div>
          )}
        </>
      )}
      <div
        className={`flex items-center rounded border border-[#808080] focus-within:border-common-purble ${
          !disabled && error ? 'border-common-danger' : ''
        } p-2 bg-common-white gap-2 duration-300`}
      >
        {prefix && <div>{prefix}</div>}
        <input
          type={inputType}
          name={name}
          id={id}
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          className={`outline-none text-txt-gray grow text-sm bg-[transparent] ${inputClassName}`}
          spellCheck={false}
          onChange={onChange}
          readOnly={disabled}
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
      {!disabled && error && (
        <div
          className={`duration-300 overflow-hidden`}
          style={{
            height: errorHeigh
          }}
        >
          <p ref={errorRef} className="text-common-danger text-xs pt-1">
            {label || name} {error}
          </p>
        </div>
      )}

      {description && <Tooltip id={`${name}-tooltip-input`} place="right" />}
    </div>
  )
}

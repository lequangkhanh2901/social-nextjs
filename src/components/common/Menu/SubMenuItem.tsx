import { MouseEvent, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Confirm from '../Confirm'

export interface Props {
  label: string
  handle: () => void
  className?: string
  requireConfirm?: true
  confirmMessage?: string
}

export default function SubMenuItem({
  label,
  handle,
  requireConfirm,
  confirmMessage,
  className = ''
}: Props) {
  const [isShowConfirm, setIsShowConfirm] = useState(false)

  const handleClick = (e: MouseEvent) => {
    if (requireConfirm) {
      e.stopPropagation()
      setIsShowConfirm(true)
    } else {
      handle()
    }
  }

  const handleConfirm = () => {
    handle()
    setIsShowConfirm(false)
  }

  return (
    <>
      <div
        className={twMerge(
          'rounded px-1 hover:bg-common-gray-light cursor-pointer text-sm text-common-gray-dark py-1',
          className
        )}
        onClick={handleClick}
      >
        {label}
      </div>

      <Confirm
        isOpen={isShowConfirm}
        onCancel={() => setIsShowConfirm(false)}
        onConfirm={handleConfirm}
        message={confirmMessage}
      />
    </>
  )
}

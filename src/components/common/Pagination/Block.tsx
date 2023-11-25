import { ReactNode } from 'react'

interface Props {
  label: ReactNode
  disable?: boolean
  active?: boolean
  onClick: () => void
}

export default function Block({ label, disable, active, onClick }: Props) {
  return (
    <button
      className={`w-8 aspect-square flex items-center justify-center rounded border border-common-gray-medium ${
        disable ? 'cursor-not-allowed opacity-70' : ''
      } ${active ? 'text-common-purble cursor-auto' : ''}`}
      onClick={() => {
        if (!disable && !active) onClick()
      }}
    >
      {label}
    </button>
  )
}

import { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  className?: string
}

export default function Wrapper({ title, children, className = '' }: Props) {
  return (
    <div className={`pb-8 ${className}`}>
      <div className="bg-common-white mt-5 p-4 rounded shadow">
        <h2 className="text-xl font-bold p-4 pt-2">{title}</h2>
        {children}
      </div>
    </div>
  )
}

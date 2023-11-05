'use client'

import { useSearchParams } from 'next/navigation'

import Title from '~/components/common/Title'
import Friends from '../Friends'
import SameFriends from '../SameFriends'
import Menu, { Key, menu } from '../Menu'
import Other from '../Other'

export default function Main() {
  const searchParams = useSearchParams()
  const k = searchParams.get('k') as Key

  const renderUI = () => {
    switch (k) {
      case 'FOF':
        return <SameFriends />
      case 'FRIEND':
        return <Friends />
      case 'OTHER':
        return <Other />

      default:
        return null
    }
  }
  return (
    <div className="min-h-[calc(100vh-62px)] flex">
      <Menu />
      <div className="grow px-5">
        <Title title={menu.find((item) => item.key === k)?.label || ''} />
        {renderUI()}
      </div>
    </div>
  )
}

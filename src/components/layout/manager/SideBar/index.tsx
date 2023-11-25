'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '~/components/common/Logo'

const data = [
  {
    title: 'Home',
    href: '/manager'
  },
  {
    title: 'Reports',
    href: '/manager/reports'
  },
  {
    title: 'Handled reports',
    href: '/manager/reports/handled'
  }
]

export default function SideBar() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 left-0 h-screen overflow-y-auto w-1/5 bg-common-white py-4 px-2 shrink-0">
      <Logo className="text-center text-6xl" href="/manager" />
      {data.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={`block hover:bg-common-gray-light p-2 rounded text-lg duration-150 ${
            pathname === item.href
              ? 'bg-common-gray-light text-common-purble'
              : 'text-txt-primary'
          }`}
        >
          {item.title}
        </Link>
      ))}
    </div>
  )
}

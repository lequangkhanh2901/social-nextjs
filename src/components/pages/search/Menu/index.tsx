import Image, { StaticImageData } from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { removeSearchParam, updateSearchParam } from '~/helper/logic/method'

import friend from '~/public/icons/friend/friend.svg'

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never

export type Key = ElementType<typeof keys>

interface IMenu {
  key: Key
  label: string
  icon: string | StaticImageData
}

export const keys = ['FRIEND', 'FOF', 'OTHER'] as const

export const menu: IMenu[] = [
  {
    key: 'FRIEND',
    label: 'Friend',
    icon: friend
  },
  {
    key: 'FOF',
    label: 'Same friends',
    icon: friend
  },
  {
    key: 'OTHER',
    label: 'Other',
    icon: friend
  }
]

export default function Menu() {
  const key = useSearchParams().get('k')

  const router = useRouter()

  if (key && !keys.includes(key as any)) {
    router.replace(removeSearchParam('k'))
  }

  const handleClick = (_key: Key) => {
    if (key !== _key) router.replace(updateSearchParam('k', _key))
  }
  return (
    <div className="bg-common-white min-h-[calc(100vh-62px)] sticky top-0 w-1/5 shadow p-2">
      {menu.map((item) => (
        <div
          key={item.key}
          className={`flex items-center px-2 py-2 rounded cursor-pointer gap-2 ${
            key === item.key
              ? 'bg-common-gray-light'
              : 'hover:bg-common-gray-light'
          }`}
          onClick={() => handleClick(item.key)}
        >
          <Image src={item.icon} alt={item.key} width={20} height={20} />
          {item.label}
        </div>
      ))}
    </div>
  )
}

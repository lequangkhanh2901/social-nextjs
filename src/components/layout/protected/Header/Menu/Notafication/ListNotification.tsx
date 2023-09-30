import Image from 'next/image'

import { getDictionary } from '~/locales'
import { useLanguageContext } from '~/components/layout/Wrapper'

import Button from '~/components/common/Button'
import dots from '~/public/icons/dots.svg'

interface Props {
  filter: 'ALL' | 'UNREAD'
  // notifications: string[]
  onChangeFilter: (filter: 'ALL' | 'UNREAD') => void
}

export default function ListNotification({ filter, onChangeFilter }: Props) {
  const { lang } = useLanguageContext()
  const { tCommon } = getDictionary(lang)

  return (
    <div
      className="absolute top-full right-0 translate-y-1 rounded-lg bg-common-white w-[400px] shadow-[1px_1px_8px_#aaaaaa80] p-3 cursor-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center">
        <h3 className="text-lg font-semibold text-txt-primary">
          {tCommon.notification}
        </h3>
        <button className="ml-auto flex items-center justify-center h-8 w-8 rounded-full bg-common-gray-light hover:bg-common-gray-medium">
          <Image src={dots} alt="" width={24} />
        </button>
      </div>
      <div className="flex gap-1 mt-2">
        <Button
          title={tCommon.all}
          isOutline={filter !== 'ALL'}
          onClick={() => onChangeFilter('ALL')}
        />
        <Button
          title={tCommon.notRead}
          isOutline={filter !== 'UNREAD'}
          onClick={() => onChangeFilter('UNREAD')}
        />
      </div>
    </div>
  )
}

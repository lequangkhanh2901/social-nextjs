import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { useLanguageContext } from '~/components/layout/Wrapper'
import useDebounce from '~/helper/hooks/useDebounce'
import { IConversation } from '~/helper/type/message'
import { getDictionary } from '~/locales'

import Input from '~/components/common/Input'
import ConversationItem from '~/components/layout/message/SideBar/ConversationItem'
import fullSceen from '~/public/icons/full-screen.svg'

interface Props {
  conversations: IConversation[]
  isShow: boolean
  setConversations: Dispatch<SetStateAction<IConversation[]>>
}

export default function Conversations({
  conversations,
  isShow,
  setConversations
}: Props) {
  const { lang } = useLanguageContext()
  const { tCommon } = getDictionary(lang)
  const [searchValue, setSearchValue] = useState('')
  const searchValueDebounce = useDebounce(searchValue.trim())

  useEffect(() => {
    //TODO
  }, [searchValueDebounce])

  const sortedConversation = useMemo(() => {
    return [...conversations]
      .filter((conversation) =>
        conversation.users[0].name.includes(searchValueDebounce)
      )
      .sort((_c1, _c2) => {
        if (_c1.messages) {
          if (_c2.messages) {
            return (
              new Date(_c2.messages.createdAt).getTime() -
              new Date(_c1.messages.createdAt).getTime()
            )
          } else {
            return (
              new Date(_c2.updatedAt).getTime() -
              new Date(_c1.messages.createdAt).getTime()
            )
          }
        } else {
          if (_c2.messages) {
            return (
              new Date(_c2.messages.createdAt).getTime() -
              new Date(_c1.updatedAt).getTime()
            )
          } else {
            return (
              new Date(_c2.updatedAt).getTime() -
              new Date(_c1.updatedAt).getTime()
            )
          }
        }
      })
  }, [searchValueDebounce, conversations])

  return (
    <div
      className={`absolute top-full right-0 translate-y-1 rounded-lg bg-common-white w-[350px] shadow-[1px_1px_8px_#aaaaaa80] p-3 cursor-auto ${
        isShow ? '' : 'hidden'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center">
        <h4 className="text-lg font-semibold">{tCommon.message}</h4>
        <div className="ml-auto flex items-center">
          <Link
            href="/conversations"
            className="p-1 rounded hover:bg-common-gray-light"
          >
            <Image src={fullSceen} alt="" width={16} />
          </Link>
        </div>
      </div>
      <Input
        name=""
        value={searchValue}
        rounded
        placeholder="tim kiem"
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div>
        {sortedConversation.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            id={conversation.id}
            message={conversation.messages}
            user={conversation.users[0]}
            type={conversation.type}
            name={conversation.name}
            avatar={conversation.avatar}
            unreadLastUsersId={conversation.unreadLastUsersId}
            setConversations={setConversations}
          />
        ))}
      </div>
    </div>
  )
}

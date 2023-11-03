'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { useAppSelector } from '~/redux/hooks'
import { RootState } from '~/redux/store'
import useDebounce from '~/helper/hooks/useDebounce'
import { removeSearchParam, updateSearchParam } from '~/helper/logic/method'

import GrayBackGrondButtom from '~/components/common/Button/GrayBackGround'
import Input from '~/components/common/Input'

import Wrapper from '../Wrapper'
import AllFriends from './AllFriends'
import SameFriend from './SameFriend'

export interface Friend {
  id: string
  user: {
    id: string
    name: string
    username: string
    avatarId: {
      id: string
      cdn: string
    }
  }
}

export default function Main() {
  const { username } = useParams()
  const { currentUser } = useAppSelector((state: RootState) => state.user)

  const [type, setType] = useState<'ALL' | 'SAME_FRIEND'>('ALL')
  const [input, setInput] = useState('')

  const searchValue = useDebounce(input.trim())
  const router = useRouter()

  useEffect(() => {
    if (searchValue) {
      router.replace(updateSearchParam('search', searchValue))
    } else {
      router.replace(removeSearchParam('search'))
    }
  }, [searchValue])

  useEffect(() => {
    setInput('')
  }, [type])

  return (
    <Wrapper title="Friends">
      <div className="flex items-center gap-2 pb-2">
        {username !== currentUser.username && (
          <>
            <GrayBackGrondButtom
              title="All"
              onClick={() => {
                setType('ALL')
              }}
              className={type === 'ALL' ? 'bg-common-gray-medium' : ''}
            />
            <GrayBackGrondButtom
              title="Same friends"
              onClick={() => {
                setType('SAME_FRIEND')
              }}
              className={type === 'SAME_FRIEND' ? 'bg-common-gray-medium' : ''}
            />
          </>
        )}
        <div>
          <Input
            name=""
            value={input}
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>

      {type === 'SAME_FRIEND' ? <SameFriend /> : <AllFriends />}
    </Wrapper>
  )
}

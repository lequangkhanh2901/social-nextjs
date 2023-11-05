import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import useDebounce from '~/helper/hooks/useDebounce'
import useClickOutSide from '~/helper/hooks/useClickOutSide'

import Input from '~/components/common/Input'
import find from '~/public/icons/find.svg'
import loadingDots from '~/public/icons/loading-dots.svg'
import Friends from './Friends'
import FriendsOfFriends from './FriendsOfFriends'

type ComponentKey = 'FRIENDS' | 'FRIENDS_OF_FRIENDS'

export default function SearchBox() {
  const q = useSearchParams().get('q') || ''

  const router = useRouter()
  const [value, setValue] = useState('')
  const [isShow, setIsShow] = useState(false)
  const [loadingComponent, setLoadingComponent] = useState<ComponentKey[]>([
    // 'FRIENDS',
    // 'FRIENDS_OF_FRIENDS'
  ])

  const inputRef = useRef<HTMLDivElement>(null)

  useClickOutSide(
    () => {
      if (isShow) setIsShow(false)
    },
    inputRef,
    [isShow]
  )

  useEffect(() => {
    setValue(q)
  }, [])

  const search = useDebounce(value)

  useEffect(() => {
    if (value.trim()) {
      setIsShow(true)
    }
  }, [value])

  const handleEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && value) {
      router.push(`/search?q=${value}&k=FRIEND`)
    }
  }

  const handleChangeLoading = useCallback(
    (loading: boolean, key: ComponentKey) => {
      if (loading) {
        if (!loadingComponent.includes(key))
          setLoadingComponent((prev) => [...prev, key])
      } else {
        if (loadingComponent.includes(key)) {
          setLoadingComponent((prev) => prev.filter((_key) => _key !== key))
        }
      }
    },
    [loadingComponent]
  )

  return (
    <div className="col-span-2 relative">
      <div
        ref={inputRef}
        onClick={() => {
          if (value.trim()) setIsShow(true)
        }}
      >
        <Input
          value={value}
          name=""
          placeholder="Search..."
          prefix={<Image src={find} alt="search_icon" width={16} height={16} />}
          onChange={(e) =>
            !e.target.value.startsWith(' ') && setValue(e.target.value)
          }
          onKeyUp={handleEnter}
          subfix={
            search && loadingComponent.length ? (
              <Image
                src={loadingDots}
                alt="loading"
                width={12}
                height={12}
                className="opacity-70 animate-loading-rolling"
              />
            ) : undefined
          }
        />
      </div>

      {!!value.trim() && isShow && (
        <div className="absolute top-full left-0 w-full max-h-[90vh] overflow-y-auto z-10 bg-common-white shadow-lg rounded-md p-2">
          <Friends
            search={search}
            onChangeStatus={(loading) =>
              handleChangeLoading(loading, 'FRIENDS')
            }
          />
          <FriendsOfFriends
            search={search}
            onChangeStatus={(loading) =>
              handleChangeLoading(loading, 'FRIENDS_OF_FRIENDS')
            }
          />
        </div>
      )}
    </div>
  )
}

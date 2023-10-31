'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'

import { getRequest } from '~/services/client/getRequest'
import useIsInView from '~/helper/hooks/useIsInView'

import VideoItem from './VideoItem'
import Skeleton from '../photos/Skeleton'
import Wrapper from '../Wrapper'

interface Media {
  id: string
  cdn: string
}

export default function Main() {
  const { username } = useParams()
  const [medias, setMedias] = useState<Media[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const data: any = await getRequest(`/media/${username}/videos`, {
          params: {
            limit: 12,
            skip: (page - 1) * 12
          }
        })

        setMedias(data.medias)
        setCount(data.meta.count)
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    })()
  }, [page])

  const isInView = useIsInView(loadMoreRef)

  useEffect(() => {
    if (isInView && !isLoading && count > medias.length) {
      setPage((prev) => prev + 1)
    }
  }, [isInView])

  return (
    <Wrapper title="Videos">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {medias.map((media) => (
          <VideoItem key={media.id} cdn={media.cdn} />
        ))}
      </div>
      <div
        ref={loadMoreRef}
        className={count === medias.length ? 'hidden' : ''}
      >
        <Skeleton />
      </div>
    </Wrapper>
  )
}

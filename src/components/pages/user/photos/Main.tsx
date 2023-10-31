'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'

import { getRequest } from '~/services/client/getRequest'
import useIsInView from '~/helper/hooks/useIsInView'

import ImageItem from './ImageItem'
import Skeleton from './Skeleton'
import Wrapper from '../Wrapper'

interface Media {
  id: string
  cdn: string
}

export default function Main() {
  const [medias, setMedias] = useState<Media[]>([])
  const [count, setCount] = useState(0)
  const { username } = useParams()
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        const data: any = await getRequest(`/media/${username}/images`, {
          params: {
            skip: (page - 1) * 12,
            limit: 12
          }
        })

        setMedias((prev) => [...prev, ...data.medias])
        setCount(data.meta.count)
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    })()
  }, [page, username])

  const isInView = useIsInView(loadMoreRef)

  useEffect(() => {
    if (isInView && !isLoading && count > medias.length)
      setPage((prev) => prev + 1)
  }, [isInView])

  return (
    <Wrapper title="Photos">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {medias.map((media) => (
          <ImageItem key={media.id} cdn={media.cdn} />
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

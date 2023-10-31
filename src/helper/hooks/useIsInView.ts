import { RefObject, useEffect, useRef, useState } from 'react'

function useIsInView(ref: RefObject<HTMLElement>) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observer.current = new IntersectionObserver(([entry]) =>
      setIsIntersecting(entry.isIntersecting)
    )
  }, [])

  useEffect(() => {
    if (observer.current && ref.current) {
      observer.current.observe(ref.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [ref, observer])

  return isIntersecting
}
export default useIsInView

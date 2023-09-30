import { useEffect, useState } from 'react'

export default function useDebounce(value: string, time: number = 700) {
  const [debouncedValue, setDebouncedValue] = useState('')
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedValue(value)
    }, time)

    return () => {
      clearTimeout(timeOut)
    }
  }, [value, time])
  return debouncedValue
}

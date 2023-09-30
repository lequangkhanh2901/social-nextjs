import { useState } from 'react'

export default function usePopup() {
  const [isShow, setIsShow] = useState(false)
  return {
    isShow,
    openPopup: () => setIsShow(true),
    closePopup: () => setIsShow(false),
    togglePopup: () => setIsShow((prev) => !prev)
  }
}

'use client'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  children: ReactNode
  shouldCloseOnOverlayClick?: boolean
  zIndex?: number
  onClose: () => void
  onRequestClose?: () => void
  onAfterOpen?: () => void
}

function Modal({
  isOpen,
  children,
  shouldCloseOnOverlayClick,
  zIndex = 60,
  onClose,
  onAfterOpen
}: ModalProps) {
  const [isLoaded, setIsloaded] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [isBeforeClose, setIsbeforeClose] = useState(false)
  const [isActive, setIsActive] = useState(isOpen)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    setIsloaded(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setIsActive(isOpen)
      setIsStarted(true)
      onAfterOpen && onAfterOpen()
    }

    return () => {
      if (isOpen) {
        setTimeout(() => {
          setIsStarted(false)
          setIsbeforeClose(false)
          setIsActive(false)
        }, 300)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (isBeforeClose) {
      setOpacity(0)
    } else {
      if (isStarted) {
        setOpacity(1)
      }
    }
  }, [isBeforeClose, isStarted])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (shouldCloseOnOverlayClick) {
      setIsbeforeClose(true)
      setTimeout(() => {
        onClose()
      }, 300)
    }
  }

  if (!isLoaded || !isActive) return null

  return createPortal(
    <div
      className={`fixed inset-0 bg-[#11111155] backdrop-blur-[1px] flex items-center justify-center duration-300 opacity-0`}
      onClick={(e) => handleOverlayClick(e)}
      style={{
        zIndex: zIndex,
        opacity: opacity
      }}
    >
      <div
        className="bg-common-white p-2 rounded-lg shadow-md"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal

import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface DrawerProps {
  children: ReactNode
  placement?: 'left' | 'right'
  width?: string
  show: boolean
  setShow: (e: boolean) => void
}

function Drawer({
  children,
  placement = 'left',
  width = '300px',
  show,
  setShow
}: DrawerProps) {
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    if (show) {
      setIsShow(true)
    }
  }, [show])

  const handleClose = () => {
    setIsShow(false)
    setTimeout(() => {
      setShow(false)
    }, 300)
  }

  return createPortal(
    <div
      className="h-screen w-screen fixed inset-0 z-50 duration-300 backdrop-blur-[1px]"
      style={{
        backgroundColor: isShow ? '#80808080' : '#80808000'
      }}
      onClick={handleClose}
    >
      <div
        className={`${
          placement === 'right' ? 'ml-auto' : ''
        } bg-common-white h-full duration-300 p-1 shadow-md shadow-common-black`}
        style={{
          translate: isShow ? '0' : placement === 'left' ? '-100%' : '100%',
          width: `min(85% , ${width})`
        }}
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

export default Drawer

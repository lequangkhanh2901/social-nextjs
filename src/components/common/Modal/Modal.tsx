import { MouseEvent, ReactNode } from 'react'
import ReactModal from 'react-modal'
import { useThemeContext } from '~/components/layout/Wrapper'

interface ModalProps {
  children: ReactNode
  isOpen: boolean
  zIndex?: number
  shouldCloseOnOverlayClick?: boolean
  placement?:
    | 'top'
    | 'right'
    | 'left'
    | 'bottom'
    | 'center'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'

  onRequestClose: (e: MouseEvent) => void
  onAfterOpen?: () => void
}

function Modal({
  children,
  isOpen,
  zIndex = 100,
  shouldCloseOnOverlayClick,
  placement = 'center',
  onRequestClose,
  onAfterOpen
}: ModalProps) {
  const { theme } = useThemeContext()

  const renderclass = () => {
    switch (placement) {
      case 'top':
        return 'justify-center'
      case 'right':
        return 'justify-end items-center'
      case 'left':
        return 'items-center'
      case 'bottom':
        return 'justify-center items-end'
      case 'center':
        return 'justify-center items-center'
      case 'top-left':
        return 'items-start'
      case 'top-right':
        return 'justify-end items-start'
      case 'bottom-left':
        return 'items-end'
      case 'bottom-right':
        return 'justify-end items-end'
      default:
        return ''
    }
  }

  return (
    <ReactModal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      overlayClassName={`bg-[#22222288] fixed inset-0 flex p-5 ${renderclass()}`}
      className={`bg-common-white rounded-md react-modal-${theme} outline-none `}
      style={{
        overlay: {
          zIndex
        }
      }}
      closeTimeoutMS={200}
      onRequestClose={onRequestClose}
      onAfterOpen={onAfterOpen}
      ariaHideApp={false}
      preventScroll
    >
      {children}
    </ReactModal>
  )
}

export default Modal

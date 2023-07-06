import { ReactNode } from 'react'
import ReactModal from 'react-modal'

interface ModalProps {
  isOpen: boolean
  contentLabel?: string
  children: ReactNode
  shouldCloseOnOverlayClick?: boolean
  onRequestClose?: () => void
  onAfterOpen?: () => void
  onAfterClose?: () => void
}

function Modal({
  isOpen,
  contentLabel,
  children,
  shouldCloseOnOverlayClick,
  onRequestClose,
  onAfterOpen,
  onAfterClose
}: ModalProps) {
  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel={contentLabel}
      closeTimeoutMS={300}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      onRequestClose={onRequestClose}
      onAfterOpen={onAfterOpen}
      onAfterClose={onAfterClose}
      style={{
        overlay: {
          backgroundColor: '#11111155',
          backdropFilter: 'blur(4px)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4
        },
        content: {
          position: 'static'
        }
      }}
    >
      {children}
    </ReactModal>
  )
}

export default Modal

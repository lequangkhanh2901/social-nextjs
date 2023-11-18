import { ReactNode } from 'react'
import Button from '../Button'
import Modal from '../Modal/Modal'

interface Props {
  isOpen: boolean
  message?: ReactNode
  onConfirm: () => void
  onCancel: () => void
}

export default function Confirm({
  isOpen,
  onConfirm,
  onCancel,
  message = 'Confirm do this action?'
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={(e) => {
        e.stopPropagation()
        onCancel()
      }}
    >
      <div className="p-5 w-[300px]" onClick={(e) => e.stopPropagation()}>
        <p className="text-center font-bold text-lg text-common-gray-dark pb-3">
          {message}
        </p>
        <div className="flex w-full gap-5">
          <Button title="Confirm" onClick={onConfirm} passClass="w-full" />
          <Button
            title="Cancel"
            onClick={onCancel}
            isOutline
            passClass="w-full"
          />
        </div>
      </div>
    </Modal>
  )
}

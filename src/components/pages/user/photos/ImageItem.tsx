import Image from 'next/image'
import usePopup from '~/helper/hooks/usePopup'
import Modal from '~/components/common/Modal/Modal'

import close from '~/public/icons/close_white.svg'

export default function ImageItem({ cdn }: { cdn: string }) {
  const { openPopup, isShow, closePopup } = usePopup()

  return (
    <>
      <div
        className="aspect-square border border-common-gray-light rounded-lg relative cursor-pointer"
        onClick={openPopup}
      >
        <Image
          fill
          src={cdn}
          alt=""
          className="object-cover rounded-[inherit]"
        />
      </div>

      <Modal isOpen={isShow} onRequestClose={closePopup}>
        <div className="aspect-square max-h-[90vh] max-w-[90vw] w-[90vw] h-[90vh] relative group">
          <Image
            fill
            src={cdn}
            alt=""
            className="object-contain rounded-[inherit]"
          />
          <div
            className="absolute top-3 right-3 w-10 aspect-square rounded-full bg-[#00000080] cursor-pointer justify-center items-center hidden group-hover:flex opacity-40 hover:opacity-90"
            onClick={closePopup}
          >
            <Image src={close} alt="" width={20} />
          </div>
        </div>
      </Modal>
    </>
  )
}

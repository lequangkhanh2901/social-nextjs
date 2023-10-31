import Image from 'next/image'

import usePopup from '~/helper/hooks/usePopup'

import Modal from '~/components/common/Modal/Modal'
import Video from '~/components/common/Video'

import play from '~/public/icons/play_solid_white.svg'
import close from '~/public/icons/close_white.svg'

export default function VideoItem({ cdn }: { cdn: string }) {
  const { isShow, openPopup, closePopup } = usePopup()

  return (
    <>
      <div
        className="aspect-square border border-common-gray-light rounded-lg relative cursor-pointer"
        onClick={openPopup}
      >
        <video
          className="w-full h-full object-cover rounded-[inherit]"
          preload="metadata"
        >
          <source src={cdn} />
        </video>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-full bg-[#00000050] opacity-70 hover:opacity-100">
          <Image src={play} width={20} alt="" />
        </div>
      </div>
      <Modal isOpen={isShow} onRequestClose={closePopup}>
        <div className="max-h-[90vh] max-w-[90vw] w-[90vw] h-[90vh] relative group flex justify-center items-center">
          <Video src={cdn} className="max-w-full max-h-full" />
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

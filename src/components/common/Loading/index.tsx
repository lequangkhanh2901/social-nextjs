import Image from 'next/image'

import loadingIcon from '~/public/icons/loading.png'

function Loading() {
  return (
    <div className="h-[calc(100vh-56px)] bg-[#11111155] absolute z-10 w-full flex items-center justify-center">
      <Image src={loadingIcon} alt="" className="animate-spin invert" />
    </div>
  )
}

export default Loading

import Image from 'next/image'
import wellcome from '~/public/images/common/welcome.png'

export default function Conversations() {
  return (
    <div className="flex flex-col items-center">
      <Image src={wellcome} width={500} height={400} alt="Welcom" />
      <p className="text-4xl text-common-purble">Select a chat!</p>
    </div>
  )
}

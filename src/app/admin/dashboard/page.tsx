import Image from 'next/image'

import manager from '~/public/icons/manager/manager.svg'

function Dashboard() {
  return (
    <div className="text-center text-4xl mt-[10vh]">
      <div>Admin workspace</div>
      <div className="text-8xl text-common-purble">KAN</div>
      <Image
        src={manager}
        alt="manager"
        width={200}
        className="block mx-auto"
      />
    </div>
  )
}
export default Dashboard

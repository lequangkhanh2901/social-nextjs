import Notification from '~/components/layout/protected/Header/Menu/Notafication'
import User from '~/components/layout/protected/Header/Menu/User'

export default function Menu() {
  return (
    <div className="ml-auto w-fit pr-4 flex gap-2">
      <Notification />
      <User />
    </div>
  )
}

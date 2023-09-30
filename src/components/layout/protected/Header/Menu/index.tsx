import Message from './Message'
import Notification from './Notafication'
import User from './User'

export default function Menu() {
  return (
    <div className="ml-auto w-fit pr-4 flex gap-2">
      <Message />
      <Notification />
      <User />
    </div>
  )
}

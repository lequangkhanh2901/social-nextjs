import home from '~/public/icons/layout/header/home.svg'
import homeActive from '~/public/icons/layout/header/home_active.svg'
import friend from '~/public/icons/layout/header/friend.svg'
import friendActive from '~/public/icons/layout/header/friend_active.svg'
import develop from '~/public/icons/layout/header/develop.svg'
import NavigateItem from './NavigateItem'

export default function Navigate() {
  return (
    <div className="flex gap-2 w-full">
      <NavigateItem href="/" alt="Home" icon={home} activeIcon={homeActive} />
      <NavigateItem
        href="/friends"
        alt="Friends"
        icon={friend}
        activeIcon={friendActive}
      />
      <NavigateItem
        href="/"
        alt="develop"
        icon={develop}
        activeIcon={develop}
        developing
      />
      <NavigateItem
        href="/"
        alt="develop"
        icon={develop}
        activeIcon={develop}
        developing
      />
    </div>
  )
}

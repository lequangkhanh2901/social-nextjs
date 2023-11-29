import dashboard from '~/public/icons/layout/dashboard.svg'
import users from '~/public/icons/layout/users.svg'
import managers from '~/public/icons/layout/managers.svg'

const sideBarMenu = [
  {
    key: 1,
    icon: dashboard,
    label: 'Dashboard',
    link: '/admin/dashboard'
  },
  {
    key: 2,
    icon: users,
    label: 'Users',
    link: '/admin/users'
  },
  // {
  //   key: 3,
  //   icon: posts,
  //   label: 'Posts',
  //   link: '/admin/posts'
  // },
  {
    key: 4,
    icon: managers,
    label: 'Managers',
    link: '/admin/managers'
  }
]

export { sideBarMenu }

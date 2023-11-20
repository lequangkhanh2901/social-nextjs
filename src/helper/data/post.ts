import { RegimeCreatePost } from '../enum/post'

export const postTypes = [
  {
    key: 'public',
    value: RegimeCreatePost.PUBLIC
  },
  {
    key: 'private',
    value: RegimeCreatePost.PRIVATE
  },
  {
    key: 'onlyFriend',
    value: RegimeCreatePost.ONLY_FRIEND
  },
  {
    key: 'cusTom',
    value: RegimeCreatePost.CUSTOM
  }
]

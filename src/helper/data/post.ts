import { RegimePost } from '../enum/post'

export const postTypes = [
  {
    key: 'public',
    value: RegimePost.PUBLIC
  },
  {
    key: 'private',
    value: RegimePost.PRIVATE
  },
  {
    key: 'onlyFriend',
    value: RegimePost.ONLY_FRIEND
  }
]

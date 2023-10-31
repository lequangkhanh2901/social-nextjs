export interface RequestFriend {
  id: string

  createdAt: string
  user: {
    id: string
    name: string
    username: string
    avatarId: {
      cdn: string
    }
  }
}

export interface RequestFriendSent {
  id: string

  createdAt: string
  user_target: {
    id: string
    name: string
    username: string
    avatarId: {
      cdn: string
    }
  }
}

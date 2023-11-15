export interface UserPost {
  avatarId: {
    cdn: string
  }
  name: string
  username: string
}

export interface IUser {
  avatarId: {
    id: string
    cdn: string
  }
  id: string
  name: string
  username: string
}

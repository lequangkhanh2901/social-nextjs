import { MediaType, RegimePost } from '../enum/post'
import { UserPost } from './user'

export interface Post {
  id: string
  content: string
  type: RegimePost
  medias: Media[]
  createdAt: string
  updatedAt: string
  user: UserPost
  likeData: {
    total: number
    isLiked: boolean
  }
  totalComment: number
}

export interface Media {
  id: string
  cdn: string
  createdAt: string
  type: MediaType
}

export type FileType = 'image/png' | 'image/jpeg' | 'image/jpg' | 'video/mp4'

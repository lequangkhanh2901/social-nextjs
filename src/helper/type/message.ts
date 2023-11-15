import { ConversationType, MessageViewSatus } from '../enum/message'
import { IUser } from './user'

export interface IConversation {
  id: string
  users: [IUser]
  messages?: {
    id: string
    content: string
    viewStatus: MessageViewSatus
    userId: string
    createdAt: string
  }
  type: ConversationType
  name?: string
  avatar?: {
    cdn: string
  }
  unreadLastUsersId: string[]
  updatedAt: string
}

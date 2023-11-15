import { useRouter } from 'next/navigation'
import { getRequest } from '~/services/client/getRequest'
import Avatar from '~/components/common/Avatar'

export interface User {
  id: string
  name: string
  username: string
  avatarId: {
    id: string
    cdn: string
  }
}

export default function UserItem({ id, name, username, avatarId }: User) {
  const router = useRouter()

  const handeClickItem = async () => {
    try {
      const conversationData: any = await getRequest(
        `/conversation/${id}/start`
      )
      if (conversationData.conversation) {
        router.replace(
          `/conversations/${conversationData.conversation.id}/messages`
        )

        return
      }

      router.replace(`/conversations/start/@${username}`)
    } catch (error) {}
  }

  return (
    <div
      onClick={handeClickItem}
      className="flex gap-2 items-center rounded hover:bg-common-gray-light px-2 py-1 cursor-pointer"
    >
      <Avatar src={avatarId.cdn} width={40} />
      <div>
        <p>{name}</p>
        <p className="text-xs text-common-gray-dark">@{username}</p>
      </div>
    </div>
  )
}

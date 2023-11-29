import usePopup from '~/helper/hooks/usePopup'
import { IUser } from '~/helper/type/user'
import Avatar from '~/components/common/Avatar'
import ViewManager from '../ViewManager'

export default function ManagerItem({ id, avatarId, name, username }: IUser) {
  const { isShow, closePopup, openPopup } = usePopup()

  return (
    <>
      <div
        className="p-2 rounded-md border border-common-gray-medium hover:shadow-[0_1px_4px_#0ff]"
        onClick={openPopup}
      >
        <Avatar src={avatarId.cdn} alt="" width={100} />
        <p>{name}</p>
      </div>

      {isShow && (
        <ViewManager
          id={id}
          avatarId={avatarId}
          name={name}
          username={username}
          onClose={closePopup}
        />
      )}
    </>
  )
}

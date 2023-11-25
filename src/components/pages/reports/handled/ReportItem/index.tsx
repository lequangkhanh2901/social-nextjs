import { format } from 'date-fns'
import { AcceptAction, ReportReason } from '~/helper/enum/report'
import { IUser } from '~/helper/type/user'

import Avatar from '~/components/common/Avatar'

export interface Report {
  id: string
  reason: ReportReason
  note: string
  user: IUser
  userTarget: IUser
  type: 'POST' | 'COMMENT'
  actions: AcceptAction[]
  updatedAt: string
}

export default function ReportItem({
  reason,
  note,
  user,
  userTarget,
  type,
  actions,
  updatedAt
}: Report) {
  return (
    <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] whitespace-nowrap text-center border-b last:border-b-0">
      <div className="border-r py-2 col-span-1">{type}</div>
      <div className="border-r py-2 col-span-2 flex items-center gap-2">
        <Avatar src={user.avatarId.cdn} width={36} />
        <p className="hover:underline cursor-pointer">{user.name}</p>
      </div>
      <div className="border-r py-2 col-span-2 flex items-center gap-2">
        <Avatar src={userTarget.avatarId.cdn} width={36} />
        <p className="hover:underline cursor-pointer">{userTarget.name}</p>
      </div>
      <div className="border-r py-2 col-span-3 text-sm">{reason}</div>
      <div className="border-r py-2 col-span-2 text-sm whitespace-normal">
        {note}
      </div>
      <div className="col-span-2 border-r">
        {actions.map((action) => (
          <p key={action}>{action}</p>
        ))}
      </div>
      <div className="col-span-2 flex items-center justify-center text-sm">
        {format(new Date(updatedAt), 'HH:mm dd/MM/yyyy')}
      </div>
    </div>
  )
}

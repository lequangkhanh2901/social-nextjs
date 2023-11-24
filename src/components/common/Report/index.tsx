import { useState } from 'react'
import { toast } from 'react-hot-toast'

import { ReportReason } from '~/helper/enum/report'
import { postRequest } from '~/services/client/postRequest'
import Button from '../Button'
import Input from '../Input'
import Modal from '../Modal/Modal'
import Select from '../Select'

interface Props {
  type: 'POST' | 'COMMENT'
  nameUser: string
  postId?: string
  commentId?: number
  onClose: () => void
}

export default function Report({
  nameUser,
  type,
  commentId,
  postId,
  onClose
}: Props) {
  const [reason, setReason] = useState<ReportReason>()
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReport = async () => {
    if (loading || !reason) return
    try {
      setLoading(true)
      await postRequest('/report', {
        postId,
        commentId,
        reason,
        note
      })
      toast.success('Reported')
      onClose()
    } catch (error: any) {
      if (
        error.response?.data?.statusCode === 403 &&
        error.response.data.message === 'EXISTED'
      ) {
        toast.error(`You already report this ${type.toLowerCase()}`)
        onClose()
      } else toast.error('Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen onRequestClose={onClose}>
      <div className="p-4 w-[500px]">
        <h2 className="text-xl font-semibold text-center pb-2 mb-2 border-b border-common-gray-light">
          Report {type.toLowerCase()} of{' '}
          <span className="text-2xl text-common-purble">{nameUser}</span>
        </h2>
        <div className="flex gap-2 items-center py-3">
          <span>Reason: </span>
          <Select
            trigger="click"
            currentActiveKey={reason}
            data={Object.values(ReportReason).map((reason) => ({
              key: reason,
              label: reason
            }))}
            onChange={(reason) => setReason(reason as ReportReason)}
            passClass="text-xs grow"
          />
        </div>
        <Input
          name=""
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note..."
        />

        <div className="flex items-center gap-4 mt-3">
          <Button
            title="Cancel"
            isOutline
            passClass="w-full"
            onClick={onClose}
          />
          <Button
            title="Report"
            passClass="w-full"
            loadding={loading}
            disabled={!reason}
            onClick={handleReport}
          />
        </div>
      </div>
    </Modal>
  )
}

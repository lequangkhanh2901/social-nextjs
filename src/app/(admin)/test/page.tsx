'use client'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import Button from '~/components/common/Button'

function Test() {
  return (
    <div>
      Text
      <Link href="/dashboard">dashboard</Link>
      <Button title="toast" onClick={() => toast.error('error')} />
    </div>
  )
}

export default Test

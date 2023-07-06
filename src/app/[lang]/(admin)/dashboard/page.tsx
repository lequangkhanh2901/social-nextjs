'use client'

import Link from 'next/link'
import { toast } from 'react-hot-toast'

import { getDictionary } from '~/locales'

import Button from '~/components/common/Button'
import Collapse from '~/components/common/Collpase'
import Input from '~/components/common/Input'
import Modal from '~/components/common/Modal'

function Dashboard({ params }: any) {
  const translate = getDictionary(params.lang || 'en')

  return (
    <div className="text-txt-primary h-[2000px] ">
      {translate.common.login}

      <Link href="/en">Home</Link>

      <Link href="/en/test">Test</Link>

      <Button title="toas" onClick={() => toast.success('hello')} />
      <Input />
      <Collapse title="Collapse">
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
          dolore et vero deleniti laborum, tenetur recusandae voluptatum! Ea
          quam minus veniam sunt laudantium vitae, tempora aperiam veritatis
          commodi quisquam in.
        </div>
      </Collapse>
      <Modal isOpen={false}>Test modal</Modal>
    </div>
  )
}
export default Dashboard

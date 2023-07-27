'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

import { dictionaries, getDictionary } from '~/locales'

import Button from '~/components/common/Button'
import Collapse from '~/components/common/Collpase'
import Input from '~/components/common/Input'
import Modal from '~/components/common/Modal/Modal'
import Loading from '~/components/common/Loading'
import { useSearchParams } from 'next/navigation'

function Dashboard() {
  const lang = useSearchParams().get('lang')
  const translate = getDictionary(lang || dictionaries.defaultLocale)

  const [isShowModal, setIsShowModal] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  if (isLoading) return <Loading />

  return (
    <>
      <div className="text-txt-primary h-[2000px] ">
        {translate.common.login}

        <Link href="/en">Home</Link>

        <Link href="/test">Test</Link>

        <Button title="toas" onClick={() => toast.success('hello')} />
        <Button title="toas" onClick={() => setIsShowModal(true)} />
        <Button title="Load" onClick={() => setIsLoading(true)} />
        <Input
          rules={{
            minLength: 5,
            required: true
          }}
        />
        <Collapse title="Collapse">
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
            dolore et vero deleniti laborum, tenetur recusandae voluptatum! Ea
            quam minus veniam sunt laudantium vitae, tempora aperiam veritatis
            commodi quisquam in.
          </div>
        </Collapse>

        <Modal
          isOpen={isShowModal}
          shouldCloseOnOverlayClick
          placement="left"
          onRequestClose={() => setIsShowModal(false)}
        >
          <div className="p-6">hello</div>
        </Modal>
      </div>
    </>
  )
}
export default Dashboard

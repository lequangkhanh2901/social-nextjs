'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

import Button from '~/components/common/Button'
import Collapse from '~/components/common/Collpase'
import Modal from '~/components/common/Modal/Modal'
import Loading from '~/components/common/Loading'

function Dashboard() {
  const [isShowModal, setIsShowModal] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  if (isLoading) return <Loading />

  return (
    <>
      <div className="text-txt-primary h-[2000px] ">
        <Link href="/en">Home</Link>

        <Link href="/test">Test</Link>

        <Button title="toas" onClick={() => toast.success('hello')} />
        <Button title="toas" onClick={() => setIsShowModal(true)} />
        <Button title="Load" onClick={() => setIsLoading(true)} />

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

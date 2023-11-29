'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useFormik } from 'formik'

import usePopup from '~/helper/hooks/usePopup'
import { CREATE_MANAGER } from '~/helper/schema/user'
import { IUser } from '~/helper/type/user'
import { getRequest } from '~/services/client/getRequest'

import Button from '~/components/common/Button'
import Input from '~/components/common/Input'
import Modal from '~/components/common/Modal/Modal'
import Pagination from '~/components/common/Pagination'
import Title from '~/components/common/Title'
import ManagerItem from '../ManagerItem'

export default function Main() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || 1
  const name = searchParams.get('name')

  const { isShow, closePopup, openPopup } = usePopup()
  const [managers, setManagers] = useState<IUser[]>([])
  const [total, setTotal] = useState(0)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: CREATE_MANAGER,
    onSubmit: async () => {
      //
    }
  })

  useEffect(() => {
    ;(async () => {
      try {
        const data: any = await getRequest('/user/managers', {
          params: {
            limit: 10,
            skip: (+page - 1) * 10,
            name
          }
        })
        setManagers(data.managers)
        setTotal(data.meta.count)
      } catch (error) {}
    })()
  }, [page])

  return (
    <>
      <div className="m-5">
        <div className="rounded-lg bg-common-white flex items-center justify-between pr-5">
          <Title title="Managers" />
          <Button isOutline title="Add manager" onClick={openPopup} />
        </div>
        <div className="mt-5 rounded-lg bg-common-white p-5">
          <div className="flex gap-5 justify-between flex-wrap">
            {managers.map((manager) => (
              <ManagerItem key={manager.id} {...manager} />
            ))}
          </div>
          <Pagination current={+page} perPage={10} total={total} />
        </div>
      </div>
      <Modal isOpen={isShow} onRequestClose={closePopup}>
        <div className="w-[500px] p-4">
          <h3 className="text-center text-3xl">Create a manager account</h3>
          <div>
            <form onSubmit={formik.handleSubmit}>
              <Input
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="Email"
                label="Email"
                error={
                  formik.errors.email &&
                  formik.touched.email &&
                  formik.errors.email
                }
              />
              <Input
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="Password"
                label="Password"
                error={
                  formik.errors.password &&
                  formik.touched.password &&
                  formik.errors.password
                }
              />
              <Button title="Add" type="submit" passClass="w-full" />
            </form>
          </div>
        </div>
      </Modal>
    </>
  )
}

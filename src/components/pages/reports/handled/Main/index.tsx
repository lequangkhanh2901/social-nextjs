'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { getRequest } from '~/services/client/getRequest'

import Pagination from '~/components/common/Pagination'
import ReportItem, { Report } from '../ReportItem'

export default function Main() {
  const page = useSearchParams().get('page') || 1
  const [reports, setReports] = useState<Report[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    ;(async () => {
      try {
        const data: any = await getRequest('/report/handled', {
          params: {
            limit: 10,
            skip: (+page - 1) * 10
          }
        })

        setTotal(data.meta.count)
        setReports(data.reports)
      } catch (error) {}
    })()
  }, [page])

  return (
    <div className="m-5 p-5 rounded-xl bg-common-white">
      <h1 className="text-3xl">Handled reports</h1>
      <div className="mt-2">
        <div className="overflow-x-auto max-w-[calc(80vw-80px)]">
          <div className="rounded-md border min-w-[1050px]">
            <div className="whitespace-nowrap grid grid-cols-[repeat(14,minmax(0,1fr))] text-lg font-semibold text-center border-b">
              <div className="py-2 col-span-1 border-r">Type</div>
              <div className="py-2 col-span-2 border-r">User</div>
              <div className="py-2 col-span-2 border-r">User target</div>
              <div className="py-2 col-span-3 border-r">Reason</div>
              <div className="py-2 col-span-2 border-r">Note</div>
              <div className="py-2 col-span-2 border-r">Actions</div>
              <div className="py-2 col-span-2">Time</div>
            </div>
            {reports.map((report) => (
              <ReportItem key={report.id} {...report} />
            ))}
          </div>
        </div>
        <Pagination current={+page} perPage={10} total={total} />
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { getRequest } from '~/services/client/getRequest'

import Pagination from '~/components/common/Pagination'
import ReportItem, { Report } from '../ReportItem'

export default function MainReports() {
  const page = useSearchParams().get('page') || 1

  const [reports, setReports] = useState<Report[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    getReports()
  }, [page])

  const getReports = async () => {
    try {
      const data: any = await getRequest('/report', {
        params: {
          limit: 10,
          skip: (+page - 1) * 10
        }
      })
      setReports(data.reports)
      setTotal(data.meta.count)
    } catch (error) {}
  }

  return (
    <>
      <div className="p-5 bg-common-white rounded-xl m-5">
        <h1 className="text-3xl">Reports</h1>
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
                <ReportItem
                  key={report.id}
                  {...report}
                  onUpdated={getReports}
                />
              ))}
            </div>
          </div>
          <Pagination current={+page} perPage={10} total={total} />
        </div>
      </div>
    </>
  )
}

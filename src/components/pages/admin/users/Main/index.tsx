'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend
} from 'chart.js'

import { getRequest } from '~/services/client/getRequest'
import Title from '~/components/common/Title'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
)

export default function Main() {
  const [userStatis, setUserStatis] = useState<
    Record<
      string,
      {
        users: number
        bannedUsers: number
      }
    >
  >()
  const [totalUser, setTotalUser] = useState({
    totalUser: 0,
    totalBannedUser: 0
  })

  useEffect(() => {
    ;(async () => {
      try {
        const data: any = await getRequest('/user/statis')
        setUserStatis(data.newUsers)
        setTotalUser({
          totalUser: data.totalUser,
          totalBannedUser: data.totalBannedUser
        })
      } catch (error) {}
    })()
  }, [])

  return (
    <div className="m-5 rounded-lg">
      <div className="bg-common-white rounded-lg">
        <Title title="Users" />
      </div>

      <div className="flex mt-5 gap-5">
        <Link
          href="/admin/users/list"
          className="p-5 rounded-lg bg-common-white aspect-square w-[200px] relative"
        >
          <span className="h-full flex items-center justify-center text-7xl font-bold border-[10px] border-common-purble rounded-full">
            {totalUser.totalUser}
          </span>
          <span className="absolute bottom-[20%] left-1/2 -translate-x-1/2">
            Total user
          </span>
        </Link>
        <Link
          href="/admin/users/banned"
          className="p-5 rounded-lg bg-common-white aspect-square w-[200px] relative"
        >
          <span className="h-full flex items-center justify-center text-7xl font-bold border-[10px] border-common-danger text-common-danger rounded-full">
            {totalUser.totalBannedUser}
          </span>
          <span className="absolute bottom-[20%] left-1/2 -translate-x-1/2 whitespace-nowrap">
            Total banned user
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-12 mt-5 gap-x-5">
        <div className="col-span-12 rounded-lg p-5 bg-common-white">
          <h3>New users in nearest six months</h3>
          {userStatis && (
            <Bar
              data={{
                labels: Object.keys(userStatis),
                datasets: [
                  {
                    label: 'Users',
                    data: Object.keys(userStatis).map(
                      (month) => userStatis[month].users
                    ),
                    backgroundColor: '#f0f',
                    maxBarThickness: 20
                  },
                  {
                    label: 'Banned Users',
                    data: Object.keys(userStatis).map(
                      (month) => userStatis[month].bannedUsers
                    ),
                    backgroundColor: '#f00',
                    maxBarThickness: 20
                  }
                ]
              }}
              options={{
                aspectRatio: 3 / 1
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

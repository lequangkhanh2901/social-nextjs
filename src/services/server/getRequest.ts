import { getCookie } from '~/untils/serverCookie'
import axiosInstance from './axiosInstanceServer'
import { ACCESS_TOKEN } from '~/settings/constants'

const getRequest = async (url: string): Promise<object> => {
  const token = getCookie(ACCESS_TOKEN)

  if (token) {
    return axiosInstance
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then((res: any) => res)
      .catch((error) => Promise.reject(error))
  }

  return axiosInstance
    .get(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res: any) => res)
    .catch((err) => Promise.reject(err))
}

export { getRequest }

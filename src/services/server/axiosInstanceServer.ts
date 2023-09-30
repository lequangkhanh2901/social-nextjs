import axios from 'axios'
import { ACCESS_TOKEN, REFRESH_TOKEN, SERVER_API } from '~/settings/constants'
import { getCookie, setCookie } from '~/untils/serverCookie'

const axiosInstance = axios.create({
  baseURL: SERVER_API,
  headers: {
    // 'Content-Type': 'application/json'
  },
  timeout: 600000
})

axiosInstance.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response: any) => {
    return response?.data
  },
  async (error: any) => {
    const { config, response } = error

    const originalRequest = config

    if (response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const tokenRefresh = getCookie(REFRESH_TOKEN)
      // // Refresh the token
      return axiosInstance
        .post(
          '/auth/refresh-token',
          {},
          {
            headers: {
              Authorization: `Bearer ${tokenRefresh}`
            }
          }
        )
        .then((res: any) => {
          // Update the token in the headers
          axiosInstance.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${res?.access}`
          originalRequest.headers['Authorization'] = `Bearer ${res?.access}`
          setCookie(ACCESS_TOKEN, res.access)
          setCookie(REFRESH_TOKEN, res.refresh)
          // setCookie(res?.access)
          // Repeat the original request with the updated headers
          return axiosInstance(originalRequest)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    }

    return Promise.reject(error)
  }
)

export default axiosInstance

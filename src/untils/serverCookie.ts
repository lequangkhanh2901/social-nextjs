import { cookies } from 'next/headers'

export const getCookie = (key: string) => cookies().get(key)?.value

export const setCookie = (
  key: string,
  value: string,
  options?: { [key: string]: any }
) => cookies().set(key, value, options)

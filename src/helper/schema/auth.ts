import { object, string } from 'yup'

export const LOGIN_SCHEMA = object({
  email: string().email('isEmail').required('isRequired'),
  password: string().min(6).max(30).required('isRequired')
})

export const SIGNUP_SCHEMA = object({
  email: string().min(6).max(30).email('isEmail').required('isRequired'),
  password: string().min(6).max(30).required('isRequired')
})

export const FORGOT_PASSWORD_SCHEMA = object({
  email: string().min(6).max(30).email('isEmail').required('isRequired')
})

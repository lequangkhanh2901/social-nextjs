import { mixed, object, string } from 'yup'
import { Sex } from '../enum/user'

export const SETUP_USER_SCHEMA = object({
  name: string().trim().required('isRequire').min(3).max(30),
  username: string()
    .trim()
    .required('isRequire')
    .min(6)
    .max(30)
    .matches(/^[A-Za-z0-9]+$/, 'wrongFormat'),
  sex: mixed<Sex>().oneOf(Object.values(Sex)).required('isRequired')
})

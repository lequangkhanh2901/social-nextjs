import { getCookie } from '~/untils/serverCookie'
import axiosInstance from './axiosInstance'
import { ACCESS_TOKEN } from '~/settings/constants'

const postRequest = (
  url: string,
  data: { [key: string]: any }
  // options?: RequestOptionsInterface,
  // fomrData?: boolean,
): Promise<object> => {
  // const data = options?.data;
  const token = getCookie(ACCESS_TOKEN)
  // const enableFlashMessageSuccess = options?.enableFlashMessageSuccess || false;
  // const enableFlashMessageError = options?.enableFlashMessageError || true;

  if (token) {
    return axiosInstance
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`
          // 'Content-Type': fomrData ? 'multipart/form-data' : 'application/json',
        }
      })
      .then((res: any) => {
        // if (enableFlashMessageSuccess && res?.message) {
        //   message.success(i18n?.t(`common:messages.${res?.message}`));
        // }
        return res
      })
      .catch((err) => {
        // if (
        //   enableFlashMessageError &&
        //   err?.response?.data?.errors?.length > 0
        // ) {
        //   err?.response?.data?.errors?.forEach((mess: string) => {
        //     message.error(i18n?.t(`common:messages.${mess}`));
        //   });
        // }
        return Promise.reject(err)
      })
  }

  return axiosInstance
    .post(url, data, {
      headers: {
        // 'Content-Type': fomrData ? fomrData : 'application/json',
      }
    })
    .then((res: any) => {
      // if (enableFlashMessageSuccess && res?.message) {
      //   message.success(i18n?.t(`common:messages.${res?.message}`));
      // }
      return res
    })
    .catch((err) => {
      // if (enableFlashMessageError && err?.response?.data?.errors?.length > 0) {
      //   err?.response?.data?.errors?.forEach((mess: string) => {
      //     message.error(i18n?.t(`common:messages.${mess}`));
      //   });
      // }
      return Promise.reject(err)
    })
}

export { postRequest }

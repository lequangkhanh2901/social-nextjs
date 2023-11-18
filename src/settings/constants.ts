export const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API
export const REFRESH_EXPIRE = process.env.NEXT_PUBLIC_REFRESH_EXPIRE
  ? +process.env.NEXT_PUBLIC_REFRESH_EXPIRE
  : 7
export const PEER_HOST = process.env.NEXT_PUBLIC_PEER_HOST
export const PEER_PORT = +(process.env.NEXT_PUBLIC_PEER_PORT as string)

//-----------------

export const DATA_THEME = '_data_theme'
export const DATA_LANG = '_data_lang'
export const REFRESH_TOKEN = '_refresh_token'
export const ACCESS_TOKEN = '_access_token'

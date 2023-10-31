export const generateKey = (num: number) => {
  const data = 'abcdefghijklmnopqrstuwvxyz123456789ABCDEFGHIJKLMNOPQRSTUWVXYZ'
  let key = ''
  for (let i = 0; i < num; i++) {
    key += data.charAt(Number((Math.random() * data.length).toFixed(0)))
  }
  return key
}

export const updateSearchParam = (key: string, value: string) => {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.set(key, value)

  return searchParams.toString()
}

export const convertSecondsToHHMMSS = (time: number) => {
  let formatedTime = ''

  if (time > 3600) {
    formatedTime += `${Math.floor(time / 3600)}:`
    time = time % 3600
  }
  if (time > 60) {
    formatedTime += `${Math.floor(time / 60)}:`
    time = time % 60
  } else if (formatedTime) {
    formatedTime += '00:'
  }
  formatedTime += time

  return formatedTime
}

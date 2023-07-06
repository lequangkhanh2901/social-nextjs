export const generateKey = (num: number) => {
  const data = 'abcdefghijklmnopqrstuwvxyz123456789ABCDEFGHIJKLMNOPQRSTUWVXYZ'
  let key = ''
  for (let i = 0; i < num; i++) {
    key += data.charAt(Number((Math.random() * data.length).toFixed(0)))
  }
  return key
}

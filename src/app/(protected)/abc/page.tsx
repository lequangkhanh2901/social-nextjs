import { getRequest } from '~/services/server/getRequest'

export default async function Abc() {
  try {
    await getRequest('/user')
    return <div>Server</div>
  } catch (error) {
    return <div>error</div>
  }
}

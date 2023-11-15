import { io } from 'socket.io-client'

const useSocket = () => {
  return io(process.env.NEXT_PUBLIC_SOCKET_URL as string)
}

export default useSocket

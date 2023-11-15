import { createSlice } from '@reduxjs/toolkit'
import { io } from 'socket.io-client'

const initSocket = {
  socket: io(process.env.NEXT_PUBLIC_SOCKET_URL as string)
}

const socketSlice = createSlice({
  name: 'socket',
  initialState: initSocket,
  reducers: {
    // initSocket:(state, action) => {
    //   state.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string)
    // }
  }
})

export const {} = socketSlice.actions
export default socketSlice
